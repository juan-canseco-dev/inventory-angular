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
import { ReceivePurchaseRequest, PurchaseDetails, UpdatePurchaseRequest } from '../../models';
import { PurchasesService } from '../../service';
import { PurchasesFacade } from '../../store';
import { ProductsService } from '../../../products/service';

interface PurchaseFormItem {
  productId: number;
  productName: string;
  productUnit: string;
  quantity: number;
  price: number;
  total: number;
}

@Component({
  selector: 'app-edit-purchase',
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
  private readonly facade = inject(PurchasesFacade);
  private readonly autocompleteFacade = inject(AutocompleteFacade);
  private readonly permissionsFacade = inject(PermissionsFacade);
  private readonly productsService = inject(ProductsService);
  private readonly purchasesService = inject(PurchasesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private readonly purchaseId = Number(this.route.snapshot.queryParamMap.get('purchaseId'));

  readonly details = this.facade.purchaseDetails;
  readonly detailsLoading = this.facade.purchaseDetailsLoading;
  readonly detailsError = this.facade.purchaseDetailsError;

  readonly updateLoading = this.facade.updateLoading;
  readonly updateSuccess = this.facade.updateSuccess;
  readonly updateError = this.facade.updateError;

  readonly productOptions = this.autocompleteFacade.productOptions;
  readonly productOptionsLoading = this.autocompleteFacade.productOptionsLoading;
  readonly productOptionsError = this.autocompleteFacade.productOptionsError;

  readonly purchaseForm = this.fb.group({
    id: this.fb.control<number | null>(null, [Validators.required]),
    arrived: this.fb.control<string | null>(null),
    orderedAt: this.fb.control<string | null>(null),
    arrivedAt: this.fb.control<string | null>(null),
    total: this.fb.control<number | null>(null),
    markAsArrived: this.fb.control(false, { nonNullable: true }),
    receiveComment: this.fb.control('', { nonNullable: true })
  });

  readonly searchProduct = new FormControl<string | LookupOption>('', { nonNullable: true });
  readonly quantityControl = new FormControl<number | null>(1, [Validators.required, Validators.min(1)]);
  readonly purchaseItems = signal<PurchaseFormItem[]>([]);
  readonly itemsTouched = signal(false);
  readonly selectedProduct = signal<LookupOption | null>(null);
  readonly addProductLoading = signal(false);
  readonly receiveLoading = signal(false);
  readonly directActionError = signal<ApiError | null>(null);

  readonly distinctItemsCount = computed(() => this.purchaseItems().length);
  readonly totalUnits = computed(() =>
    this.purchaseItems().reduce((sum, item) => sum + item.quantity, 0)
  );
  readonly purchaseTotal = computed(() =>
    this.purchaseItems().reduce((sum, item) => sum + item.total, 0)
  );
  readonly canReceivePurchase = computed(() =>
    this.permissionsFacade.hasPermission(PermissionCatalog.Purchases_Receive)
  );
  readonly saveError = computed(() => this.directActionError() ?? this.updateError());
  readonly isSaving = computed(() => this.updateLoading() || this.receiveLoading());
  readonly showReceiveSection = computed(() => {
    const details = this.details();
    return !!details && !details.arrived && this.canReceivePurchase();
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
        this.router.navigate(['/purchases'], {
          queryParams: { updated: true }
        });
      }
    });

    effect(() => {
      this.total.setValue(this.purchaseTotal(), { emitEvent: false });
    });
  }

  ngOnInit(): void {
    this.facade.resetPurchaseDetailsState();
    this.facade.resetUpdateState();
    this.autocompleteFacade.clearProductOptions();
    this.autocompleteFacade.loadProductOptions('');
    this.setAutocomplete();

    if (this.purchaseId) {
      this.facade.loadPurchaseDetails(this.purchaseId);
    }
  }

  ngOnDestroy(): void {
    this.facade.resetPurchaseDetailsState();
    this.facade.resetUpdateState();
    this.autocompleteFacade.clearProductOptions();
  }

  onSaveClick(): void {
    this.directActionError.set(null);

    if (!this.purchaseItems().length) {
      this.itemsTouched.set(true);
    }

    if (this.purchaseForm.invalid || !this.purchaseItems().length) {
      this.purchaseForm.markAllAsTouched();
      this.quantityControl.markAsTouched();
      return;
    }

    if (this.showReceiveSection() && this.markAsArrived.value) {
      this.submitUpdateAndReceive();
      return;
    }

    this.facade.updatePurchase(this.toUpdateRequest());
  }

  onCancelClick(): void {
    this.router.navigate(['/purchases']);
  }

  onRetryClick(): void {
    if (!this.purchaseId) return;
    this.facade.loadPurchaseDetails(this.purchaseId);
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
          this.purchaseItems.update((items) => {
            const existingItem = items.find((item) => item.productId === product.value);

            if (!existingItem) {
              return [
                ...items,
                {
                  productId: product.value,
                  productName: details.name,
                  productUnit: details.unit.name,
                  quantity,
                  price: details.purchasePrice,
                  total: quantity * details.purchasePrice
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

    this.purchaseItems.update((items) =>
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
    this.purchaseItems.update((items) => items.filter((item) => item.productId !== productId));
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

  private patchForm(details: PurchaseDetails): void {
    this.purchaseForm.patchValue({
      id: details.id,
      arrived: details.arrived ? 'Arrived' : 'Pending',
      orderedAt: this.toDisplayDate(details.orderedAt),
      arrivedAt: details.arrivedAt ? this.toDisplayDate(details.arrivedAt) : 'Pending',
      total: details.total,
      markAsArrived: false,
      receiveComment: details.receiveComments ?? ''
    });

    this.purchaseItems.set(
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

  private toUpdateRequest(): UpdatePurchaseRequest {
    const raw = this.purchaseForm.getRawValue();

    return {
      purchaseId: raw.id!,
      productsWithQuantities: this.purchaseItems().reduce<Record<number, number>>((acc, item) => {
        acc[item.productId] = item.quantity;
        return acc;
      }, {})
    };
  }

  private toReceiveRequest(): ReceivePurchaseRequest {
    return {
      purchaseId: this.id.value!,
      comment: this.receiveComment.value.trim()
    };
  }

  private submitUpdateAndReceive(): void {
    this.facade.resetUpdateState();
    this.receiveLoading.set(true);

    this.purchasesService.update(this.toUpdateRequest())
      .pipe(
        switchMap(() => this.purchasesService.receive(this.toReceiveRequest())),
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.receiveLoading.set(false))
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/purchases'], {
            queryParams: { updated: true }
          });
        },
        error: (error) => {
          this.directActionError.set(toApiError(error));
        }
      });
  }

  get id() {
    return this.purchaseForm.get('id') as FormControl;
  }

  get arrived() {
    return this.purchaseForm.get('arrived') as FormControl;
  }

  get orderedAt() {
    return this.purchaseForm.get('orderedAt') as FormControl;
  }

  get arrivedAt() {
    return this.purchaseForm.get('arrivedAt') as FormControl;
  }

  get total() {
    return this.purchaseForm.get('total') as FormControl;
  }

  get markAsArrived() {
    return this.purchaseForm.get('markAsArrived') as FormControl;
  }

  get receiveComment() {
    return this.purchaseForm.get('receiveComment') as FormControl;
  }
}
