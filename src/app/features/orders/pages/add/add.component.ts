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
import { Router } from '@angular/router';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, take } from 'rxjs';
import { AutocompleteFacade, LookupOption } from '../../../../shared/autocomplete';
import { CreateOrderRequest } from '../../models';
import { OrdersFacade } from '../../store';
import { CustomersFacade } from '../../../customers/store';
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
  selector: 'app-add-order',
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
    MatFormFieldModule,
    MatInputModule,
    NgxShimmerLoadingModule
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(OrdersFacade);
  private readonly autocompleteFacade = inject(AutocompleteFacade);
  private readonly customersFacade = inject(CustomersFacade);
  private readonly productsService = inject(ProductsService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly createLoading = this.facade.createLoading;
  readonly createSuccess = this.facade.createSuccess;
  readonly createError = this.facade.createError;

  readonly customerOptions = this.autocompleteFacade.customerOptions;
  readonly customerOptionsLoading = this.autocompleteFacade.customerOptionsLoading;
  readonly customerOptionsError = this.autocompleteFacade.customerOptionsError;

  readonly productOptions = this.autocompleteFacade.productOptions;
  readonly productOptionsLoading = this.autocompleteFacade.productOptionsLoading;
  readonly productOptionsError = this.autocompleteFacade.productOptionsError;

  readonly selectedCustomer = this.customersFacade.customerDetails;
  readonly selectedCustomerLoading = this.customersFacade.customerDetailsLoading;
  readonly selectedCustomerError = this.customersFacade.customerDetailsError;

  readonly orderForm = this.fb.group({
    customerId: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)])
  });

  readonly searchCustomer = new FormControl<string | LookupOption>('', { nonNullable: true });
  readonly searchProduct = new FormControl<string | LookupOption>('', { nonNullable: true });
  readonly quantityControl = new FormControl<number | null>(1, [Validators.required, Validators.min(1)]);

  readonly selectedCustomerId = signal<number | null>(null);
  readonly customerPickerOpen = signal(false);
  readonly orderItems = signal<OrderFormItem[]>([]);
  readonly itemsTouched = signal(false);
  readonly selectedProduct = signal<LookupOption | null>(null);
  readonly addProductLoading = signal(false);

  readonly hasItems = computed(() => this.orderItems().length > 0);
  readonly distinctItemsCount = computed(() => this.orderItems().length);
  readonly totalUnits = computed(() =>
    this.orderItems().reduce((sum, item) => sum + item.quantity, 0)
  );
  readonly orderTotal = computed(() =>
    this.orderItems().reduce((sum, item) => sum + item.total, 0)
  );

  constructor() {
    effect(() => {
      if (this.createSuccess()) {
        this.facade.resetCreateState();
        this.router.navigate(['/orders'], {
          queryParams: { added: true }
        });
      }
    });
  }

  ngOnInit(): void {
    this.facade.resetCreateState();
    this.customersFacade.resetCustomerDetailsState();
    this.autocompleteFacade.clearCustomerOptions();
    this.autocompleteFacade.clearProductOptions();
    this.autocompleteFacade.loadCustomerOptions('');
    this.autocompleteFacade.loadProductOptions('');
    this.setAutocomplete();
  }

  ngOnDestroy(): void {
    this.facade.resetCreateState();
    this.customersFacade.resetCustomerDetailsState();
    this.autocompleteFacade.clearCustomerOptions();
    this.autocompleteFacade.clearProductOptions();
  }

  onSaveClick(): void {
    this.customerId.markAsTouched();

    if (!this.hasItems()) {
      this.itemsTouched.set(true);
    }

    if (this.orderForm.invalid || !this.hasItems()) {
      this.orderForm.markAllAsTouched();
      this.quantityControl.markAsTouched();
      return;
    }

    this.facade.createOrder(this.toCreateRequest());
  }

  onCancelClick(): void {
    this.router.navigate(['/orders']);
  }

  onOpenCustomerPicker(): void {
    this.customerPickerOpen.set(true);
    this.onCustomerFocus();
  }

  onCloseCustomerPicker(): void {
    this.customerPickerOpen.set(false);
  }

  onCustomerFocus(): void {
    this.loadOptionsFromControl(this.searchCustomer, 'customer');
  }

  onProductFocus(): void {
    this.loadOptionsFromControl(this.searchProduct, 'product');
  }

  onCustomerSelected(event: MatAutocompleteSelectedEvent): void {
    const option = event.option.value as LookupOption;
    this.customerId.setValue(option.value);
    this.selectedCustomerId.set(option.value);
    this.searchCustomer.setValue(option, { emitEvent: false });
    this.customerId.markAsTouched();
    this.customerPickerOpen.set(false);
    this.customersFacade.loadCustomerDetails(option.value);
  }

  onClearCustomerClick(): void {
    this.customerId.setValue(null, { emitEvent: false });
    this.selectedCustomerId.set(null);
    this.searchCustomer.setValue('', { emitEvent: false });
    this.customerPickerOpen.set(false);
    this.customersFacade.resetCustomerDetailsState();
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

  clearOptionsFormControl(type: 'customer' | 'product'): void {
    switch (type) {
      case 'customer':
        this.onClearCustomerClick();
        break;
      case 'product':
        this.selectedProduct.set(null);
        this.searchProduct.setValue('');
        break;
    }
  }

  displayLookupOption(value: string | LookupOption | null): string {
    if (!value) return '';
    return typeof value === 'string' ? value : value.label;
  }

  getValidationErrorLabel(field: string): string {
    switch (field) {
      case 'customerId':
        return 'Customer';
      case 'productsWithQuantities':
        return 'Products';
      default:
        return field;
    }
  }

  private setAutocomplete(): void {
    this.searchCustomer.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value) => {
        if (typeof value !== 'string') {
          return;
        }

        this.customerId.setValue(null);
        this.selectedCustomerId.set(null);
        this.customersFacade.resetCustomerDetailsState();
        this.autocompleteFacade.searchCustomers(value);
      });

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

  private loadOptionsFromControl(
    control: FormControl<string | LookupOption>,
    type: 'customer' | 'product'
  ): void {
    const query = typeof control.value === 'string'
      ? control.value
      : control.value?.label ?? '';

    switch (type) {
      case 'customer':
        this.autocompleteFacade.loadCustomerOptions(query);
        break;
      case 'product':
        this.autocompleteFacade.loadProductOptions(query);
        break;
    }
  }

  private toCreateRequest(): CreateOrderRequest {
    const raw = this.orderForm.getRawValue();

    return {
      customerId: raw.customerId!,
      productsWithQuantities: this.orderItems().reduce<Record<number, number>>((acc, item) => {
        acc[item.productId] = item.quantity;
        return acc;
      }, {})
    };
  }

  get customerId() {
    return this.orderForm.get('customerId') as FormControl;
  }
}
