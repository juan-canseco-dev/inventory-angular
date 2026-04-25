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
import { CreatePurchaseRequest } from '../../models';
import { PurchasesFacade } from '../../store';
import { SuppliersFecade } from '../../../suppliers/store';
import { ProductsService } from '../../../products/service';
import { Error as ApiError } from '../../../../shared/types/api.errors';
import { toApiError } from '../../../../shared/utils';

interface PurchaseFormItem {
  productId: number;
  productName: string;
  productUnit: string;
  quantity: number;
  price: number;
  total: number;
}

@Component({
  selector: 'app-add-purchase',
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
  private readonly facade = inject(PurchasesFacade);
  private readonly autocompleteFacade = inject(AutocompleteFacade);
  private readonly suppliersFacade = inject(SuppliersFecade);
  private readonly productsService = inject(ProductsService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly createLoading = this.facade.createLoading;
  readonly createSuccess = this.facade.createSuccess;
  readonly createError = this.facade.createError;

  readonly supplierOptions = this.autocompleteFacade.supplierOptions;
  readonly supplierOptionsLoading = this.autocompleteFacade.supplierOptionsLoading;
  readonly supplierOptionsError = this.autocompleteFacade.supplierOptionsError;

  readonly productOptions = signal<LookupOption[]>([]);
  readonly productOptionsLoading = signal(false);
  readonly productOptionsError = signal<ApiError | null>(null);

  readonly selectedSupplier = this.suppliersFacade.supplierDetails;
  readonly selectedSupplierLoading = this.suppliersFacade.supplierDetailsLoading;
  readonly selectedSupplierError = this.suppliersFacade.supplierDetailsError;

  readonly purchaseForm = this.fb.group({
    supplierId: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)])
  });

  readonly searchSupplier = new FormControl<string | LookupOption>('', { nonNullable: true });
  readonly searchProduct = new FormControl<string | LookupOption>('', { nonNullable: true });
  readonly quantityControl = new FormControl<number | null>(1, [Validators.required, Validators.min(1)]);

  readonly selectedSupplierId = signal<number | null>(null);
  readonly supplierPickerOpen = signal(false);
  readonly purchaseItems = signal<PurchaseFormItem[]>([]);
  readonly itemsTouched = signal(false);
  readonly selectedProduct = signal<LookupOption | null>(null);
  readonly addProductLoading = signal(false);

  readonly hasItems = computed(() => this.purchaseItems().length > 0);
  readonly distinctItemsCount = computed(() => this.purchaseItems().length);
  readonly totalUnits = computed(() =>
    this.purchaseItems().reduce((sum, item) => sum + item.quantity, 0)
  );
  readonly purchaseTotal = computed(() =>
    this.purchaseItems().reduce((sum, item) => sum + item.total, 0)
  );

  constructor() {
    effect(() => {
      if (this.createSuccess()) {
        this.facade.resetCreateState();
        this.router.navigate(['/purchases'], {
          queryParams: { added: true }
        });
      }
    });
  }

  ngOnInit(): void {
    this.facade.resetCreateState();
    this.suppliersFacade.resetSupplierDetailsState();
    this.autocompleteFacade.clearSupplierOptions();
    this.autocompleteFacade.loadSupplierOptions('');
    this.setAutocomplete();
  }

  ngOnDestroy(): void {
    this.facade.resetCreateState();
    this.suppliersFacade.resetSupplierDetailsState();
    this.autocompleteFacade.clearSupplierOptions();
  }

  onSaveClick(): void {
    this.supplierId.markAsTouched();

    if (!this.hasItems()) {
      this.itemsTouched.set(true);
    }

    if (this.purchaseForm.invalid || !this.hasItems()) {
      this.purchaseForm.markAllAsTouched();
      this.quantityControl.markAsTouched();
      return;
    }

    this.facade.createPurchase(this.toCreateRequest());
  }

  onCancelClick(): void {
    this.router.navigate(['/purchases']);
  }

  onOpenSupplierPicker(): void {
    this.supplierPickerOpen.set(true);
    this.onSupplierFocus();
  }

  onCloseSupplierPicker(): void {
    this.supplierPickerOpen.set(false);
  }

  onSupplierFocus(): void {
    this.loadOptionsFromControl(this.searchSupplier, 'supplier');
  }

  onProductFocus(): void {
    this.loadOptionsFromControl(this.searchProduct, 'product');
  }

  onSupplierSelected(event: MatAutocompleteSelectedEvent): void {
    const option = event.option.value as LookupOption;
    this.resetPurchaseCart();
    this.supplierId.setValue(option.value);
    this.selectedSupplierId.set(option.value);
    this.searchSupplier.setValue(option, { emitEvent: false });
    this.supplierId.markAsTouched();
    this.supplierPickerOpen.set(false);
    this.suppliersFacade.loadSupplierDetails(option.value);
    this.loadSupplierProductOptions('');
  }

  onClearSupplierClick(): void {
    this.supplierId.setValue(null, { emitEvent: false });
    this.selectedSupplierId.set(null);
    this.searchSupplier.setValue('', { emitEvent: false });
    this.supplierPickerOpen.set(false);
    this.suppliersFacade.resetSupplierDetailsState();
    this.resetPurchaseCart();
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

  clearOptionsFormControl(type: 'supplier' | 'product'): void {
    switch (type) {
      case 'supplier':
        this.onClearSupplierClick();
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

  getSupplierCompanyName(supplier: any): string {
    return supplier?.companyName ?? supplier?.compayName ?? '';
  }

  getSupplierContactName(supplier: any): string {
    return supplier?.contactName ?? '';
  }

  getSupplierContactPhone(supplier: any): string {
    return supplier?.contactPhone ?? supplier?.phone ?? '';
  }

  getSupplierInitial(supplier: any): string {
    return this.getSupplierCompanyName(supplier).charAt(0);
  }

  getValidationErrorLabel(field: string): string {
    switch (field) {
      case 'supplierId':
        return 'Supplier';
      case 'productsWithQuantities':
        return 'Products';
      default:
        return field;
    }
  }

  private setAutocomplete(): void {
    this.searchSupplier.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value) => {
        if (typeof value !== 'string') {
          return;
        }

        this.supplierId.setValue(null);
        this.selectedSupplierId.set(null);
        this.suppliersFacade.resetSupplierDetailsState();
        this.resetPurchaseCart();
        this.autocompleteFacade.searchSuppliers(value);
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
        this.loadSupplierProductOptions(value);
      });
  }

  private loadOptionsFromControl(
    control: FormControl<string | LookupOption>,
    type: 'supplier' | 'product'
  ): void {
    const query = typeof control.value === 'string'
      ? control.value
      : control.value?.label ?? '';

    switch (type) {
      case 'supplier':
        this.autocompleteFacade.loadSupplierOptions(query);
        break;
      case 'product':
        this.loadSupplierProductOptions(query);
        break;
    }
  }

  private loadSupplierProductOptions(query: string): void {
    const supplierId = this.selectedSupplierId();

    if (!supplierId) {
      this.productOptions.set([]);
      this.productOptionsError.set(null);
      this.productOptionsLoading.set(false);
      return;
    }

    this.productOptionsLoading.set(true);
    this.productOptionsError.set(null);

    this.productsService.getAll({
      pageNumber: 1,
      pageSize: 20,
      orderBy: 'name',
      sortOrder: 'asc',
      name: query.trim() || null,
      supplierId,
      categoryId: null,
      unitId: null
    })
      .pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (page) => {
          this.productOptions.set(
            (page.items ?? []).map((product) => ({
              value: product.id,
              label: product.name
            }))
          );
          this.productOptionsLoading.set(false);
        },
        error: (error) => {
          this.productOptions.set([]);
          this.productOptionsError.set(toApiError(error));
          this.productOptionsLoading.set(false);
        }
      });
  }

  private toCreateRequest(): CreatePurchaseRequest {
    const raw = this.purchaseForm.getRawValue();

    return {
      supplierId: raw.supplierId!,
      productsWithQuantities: this.purchaseItems().reduce<Record<number, number>>((acc, item) => {
        acc[item.productId] = item.quantity;
        return acc;
      }, {})
    };
  }

  private resetPurchaseCart(): void {
    this.purchaseItems.set([]);
    this.itemsTouched.set(false);
    this.selectedProduct.set(null);
    this.productOptions.set([]);
    this.productOptionsError.set(null);
    this.productOptionsLoading.set(false);
    this.searchProduct.setValue('', { emitEvent: false });
    this.quantityControl.setValue(1);
  }

  get supplierId() {
    return this.purchaseForm.get('supplierId') as FormControl;
  }
}
