import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ColComponent,
  RowComponent,
  ToastModule
} from '@coreui/angular';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, finalize, switchMap, take } from 'rxjs';
import { PermissionCatalog } from '../../../../core/permissions';
import { PermissionsFacade } from '../../../../core/auth/store';
import { AutocompleteFacade, LookupOption } from '../../../../shared/autocomplete';
import { Error as ApiError } from '../../../../shared/types/api.errors';
import { toApiError } from '../../../../shared/utils';
import { DeliverOrderRequest, OrderDetails, UpdateOrderRequest } from '../../models';
import { OrdersService } from '../../service';
import { OrdersFacade } from '../../store';
import { ProductsService } from '../../../products/service';

interface OrderFormItem {
  productId: number;
  productName: string;
  productUnit: string;
  quantity: number;
  price: number;
  total: number;
}

@Component({
  selector: 'app-edit-order',
  imports: [
    RowComponent,
    ColComponent,
    ToastModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    NgxShimmerLoadingModule
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(OrdersFacade);
  private readonly autocompleteFacade = inject(AutocompleteFacade);
  private readonly permissionsFacade = inject(PermissionsFacade);
  private readonly productsService = inject(ProductsService);
  private readonly ordersService = inject(OrdersService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private readonly orderId = Number(this.route.snapshot.queryParamMap.get('orderId'));

  readonly details = this.facade.orderDetails;
  readonly detailsLoading = this.facade.orderDetailsLoading;
  readonly detailsError = this.facade.orderDetailsError;

  readonly updateLoading = this.facade.updateLoading;
  readonly updateSuccess = this.facade.updateSuccess;
  readonly updateError = this.facade.updateError;

  readonly productOptions = this.autocompleteFacade.productOptions;
  readonly productOptionsLoading = this.autocompleteFacade.productOptionsLoading;
  readonly productOptionsError = this.autocompleteFacade.productOptionsError;

  readonly orderForm = this.fb.group({
    id: this.fb.control<number | null>(null, [Validators.required]),
    delivered: this.fb.control<string | null>(null),
    orderedAt: this.fb.control<string | null>(null),
    deliveredAt: this.fb.control<string | null>(null),
    total: this.fb.control<number | null>(null),
    markAsDelivered: this.fb.control(false, { nonNullable: true }),
    deliverComment: this.fb.control('', { nonNullable: true })
  });

  readonly searchProduct = new FormControl<string | LookupOption>('', { nonNullable: true });
  readonly quantityControl = new FormControl<number | null>(1, [Validators.required, Validators.min(1)]);
  readonly orderItems = signal<OrderFormItem[]>([]);
  readonly itemsTouched = signal(false);
  readonly selectedProduct = signal<LookupOption | null>(null);
  readonly addProductLoading = signal(false);
  readonly deliverLoading = signal(false);
  readonly directActionError = signal<ApiError | null>(null);

  readonly distinctItemsCount = computed(() => this.orderItems().length);
  readonly totalUnits = computed(() =>
    this.orderItems().reduce((sum, item) => sum + item.quantity, 0)
  );
  readonly orderTotal = computed(() =>
    this.orderItems().reduce((sum, item) => sum + item.total, 0)
  );
  readonly canDeliverOrder = computed(() =>
    this.permissionsFacade.hasPermission(PermissionCatalog.Orders_Deliver)
  );
  readonly saveError = computed(() => this.directActionError() ?? this.updateError());
  readonly isSaving = computed(() => this.updateLoading() || this.deliverLoading());
  readonly showDeliverSection = computed(() => {
    const details = this.details();
    console.log("Can Deliver:" + this.canDeliverOrder());
    return !!details && !details.delivered && this.canDeliverOrder();
  });

  constructor() {
    effect(() => {
      const details = this.details();
      if (details) {
        this.patchForm(details);
      }
    });

    effect(() => {
      if (this.updateSuccess()) {
        this.facade.resetUpdateState();
        this.router.navigate(['/orders'], {
          queryParams: { updated: true }
        });
      }
    });

    effect(() => {
      this.total.setValue(this.orderTotal(), { emitEvent: false });
    });
  }

  ngOnInit(): void {
    this.facade.resetOrderDetailsState();
    this.facade.resetUpdateState();
    this.autocompleteFacade.clearProductOptions();
    this.autocompleteFacade.loadProductOptions('');
    this.setAutocomplete();

    if (this.orderId) {
      this.facade.loadOrderDetails(this.orderId);
    }
  }

  ngOnDestroy(): void {
    this.facade.resetOrderDetailsState();
    this.facade.resetUpdateState();
    this.autocompleteFacade.clearProductOptions();
  }

  onSaveClick(): void {
    this.directActionError.set(null);

    if (!this.orderItems().length) {
      this.itemsTouched.set(true);
    }

    if (this.orderForm.invalid || !this.orderItems().length) {
      this.orderForm.markAllAsTouched();
      this.quantityControl.markAsTouched();
      return;
    }

    if (this.showDeliverSection() && this.markAsDelivered.value) {
      this.submitUpdateAndDeliver();
      return;
    }

    this.facade.updateOrder(this.toUpdateRequest());
  }

  onCancelClick(): void {
    this.router.navigate(['/orders']);
  }

  onRetryClick(): void {
    if (!this.orderId) return;
    this.facade.loadOrderDetails(this.orderId);
  }

  onProductFocus(): void {
    const value = this.searchProduct.value;
    const query = typeof value === 'string' ? value : value?.label ?? '';
    this.autocompleteFacade.loadProductOptions(query);
  }

  onProductSelected(event: MatAutocompleteSelectedEvent): void {
    const option = event.option.value as LookupOption;
    this.selectedProduct.set(option);
    this.searchProduct.setValue(option, { emitEvent: false });
  }

  onAddItemClick(): void {
    this.quantityControl.markAsTouched();

    const product = this.selectedProduct();
    const quantity = Number(this.quantityControl.value);

    if (!product || !Number.isFinite(quantity) || quantity < 1) {
      return;
    }

    this.addProductLoading.set(true);

    this.productsService.getById(product.value)
      .pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (details) => {
          this.orderItems.update((items) => {
            const existingItem = items.find((item) => item.productId === product.value);

            if (!existingItem) {
              return [
                ...items,
                {
                  productId: product.value,
                  productName: details.name,
                  productUnit: details.unit.name,
                  quantity,
                  price: details.salePrice,
                  total: quantity * details.salePrice
                }
              ];
            }

            return items.map((item) =>
              item.productId === product.value
                ? {
                    ...item,
                    quantity: item.quantity + quantity,
                    total: (item.quantity + quantity) * item.price
                  }
                : item
            );
          });

          this.itemsTouched.set(false);
          this.selectedProduct.set(null);
          this.searchProduct.setValue('', { emitEvent: false });
          this.quantityControl.setValue(1);
          this.addProductLoading.set(false);
        },
        error: () => {
          this.addProductLoading.set(false);
        }
      });
  }

  onItemQuantityChange(productId: number, value: string): void {
    const quantity = Math.max(1, Number(value) || 1);

    this.orderItems.update((items) =>
      items.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity,
              total: quantity * item.price
            }
          : item
      )
    );
  }

  onRemoveItemClick(productId: number): void {
    this.orderItems.update((items) => items.filter((item) => item.productId !== productId));
  }

  clearProductSearch(): void {
    this.selectedProduct.set(null);
    this.searchProduct.setValue('');
  }

  displayLookupOption(value: string | LookupOption | null): string {
    if (!value) return '';
    return typeof value === 'string' ? value : value.label;
  }

  getValidationErrorLabel(field: string): string {
    switch (field) {
      case 'productsWithQuantities':
        return 'Products';
      default:
        return field;
    }
  }

  private setAutocomplete(): void {
    this.searchProduct.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value) => {
        if (typeof value !== 'string') {
          return;
        }

        this.selectedProduct.set(null);
        this.autocompleteFacade.searchProducts(value);
      });
  }

  private patchForm(details: OrderDetails): void {
    console.log(details);
    this.orderForm.patchValue({
      id: details.id,
      delivered: details.delivered ? 'Delivered' : 'Pending',
      orderedAt: this.toDisplayDate(details.orderedAt),
      deliveredAt: details.deliveredAt ? this.toDisplayDate(details.deliveredAt) : 'Pending',
      total: details.total,
      markAsDelivered: false,
      deliverComment: details.deliverComments ?? ''
    });

    this.orderItems.set(
      details.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        productUnit: item.productUnit,
        quantity: item.quantity,
        price: item.price,
        total: item.total
      }))
    );
  }

  private toDisplayDate(value: string | Date): string {
    return new Date(value).toLocaleString();
  }

  private toUpdateRequest(): UpdateOrderRequest {
    const raw = this.orderForm.getRawValue();

    return {
      orderId: raw.id!,
      productsWithQuantities: this.orderItems().reduce<Record<number, number>>((acc, item) => {
        acc[item.productId] = item.quantity;
        return acc;
      }, {})
    };
  }

  private toDeliverRequest(): DeliverOrderRequest {
    return {
      orderId: this.id.value!,
      comment: this.deliverComment.value.trim()
    };
  }

  private submitUpdateAndDeliver(): void {
    this.facade.resetUpdateState();
    this.deliverLoading.set(true);

    this.ordersService.update(this.toUpdateRequest())
      .pipe(
        switchMap(() => this.ordersService.deliver(this.toDeliverRequest())),
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.deliverLoading.set(false))
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/orders'], {
            queryParams: { updated: true }
          });
        },
        error: (error) => {
          this.directActionError.set(toApiError(error));
        }
      });
  }

  get id() {
    return this.orderForm.get('id') as FormControl;
  }

  get delivered() {
    return this.orderForm.get('delivered') as FormControl;
  }

  get orderedAt() {
    return this.orderForm.get('orderedAt') as FormControl;
  }

  get deliveredAt() {
    return this.orderForm.get('deliveredAt') as FormControl;
  }

  get total() {
    return this.orderForm.get('total') as FormControl;
  }

  get markAsDelivered() {
    return this.orderForm.get('markAsDelivered') as FormControl;
  }

  get deliverComment() {
    return this.orderForm.get('deliverComment') as FormControl;
  }
}
