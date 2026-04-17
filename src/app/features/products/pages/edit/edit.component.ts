import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  OnDestroy,
  OnInit,
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
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  GridModule,
  RowComponent,
  ToastModule
} from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AutocompleteFacade, LookupOption } from '../../../../shared/autocomplete';
import { ProductDetails, UpdateProductRequest } from '../../models';
import { ProductsFacade } from '../../store';
import { salePriceGreaterThanPurchasePriceValidator } from '../../validators/sale-price.validator';

@Component({
  selector: 'app-edit-product',
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    CardFooterComponent,
    ToastModule,
    ButtonDirective,
    FontAwesomeModule,
    GridModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
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
  private readonly facade = inject(ProductsFacade);
  private readonly autocompleteFacade = inject(AutocompleteFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private readonly productId = Number(this.route.snapshot.queryParamMap.get('productId'));

  readonly details = this.facade.productDetails;
  readonly detailsLoading = this.facade.productDetailsLoading;
  readonly detailsError = this.facade.productDetailsError;

  readonly updateLoading = this.facade.updateLoading;
  readonly updateSuccess = this.facade.updateSuccess;
  readonly updateError = this.facade.updateError;

  readonly supplierOptions = this.autocompleteFacade.supplierOptions;
  readonly supplierOptionsLoading = this.autocompleteFacade.supplierOptionsLoading;
  readonly supplierOptionsError = this.autocompleteFacade.supplierOptionsError;

  readonly categoryOptions = this.autocompleteFacade.categoryOptions;
  readonly categoryOptionsLoading = this.autocompleteFacade.categoryOptionsLoading;
  readonly categoryOptionsError = this.autocompleteFacade.categoryOptionsError;

  readonly unitOptions = this.autocompleteFacade.unitOptions;
  readonly unitOptionsLoading = this.autocompleteFacade.unitOptionsLoading;
  readonly unitOptionsError = this.autocompleteFacade.unitOptionsError;

  readonly productForm = this.fb.group({
    id: this.fb.control<number | null>({ value: null, disabled: false }, [Validators.required]),
    name: this.fb.control<string | null>(null, [Validators.required, Validators.maxLength(50)]),
    supplierId: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
    categoryId: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
    unitId: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
    stock: this.fb.control<number | null>({ value: null, disabled: false }),
    purchasePrice: this.fb.control<number | null>(null, [Validators.required, Validators.min(0.01)]),
    salePrice: this.fb.control<number | null>(null, [Validators.required, Validators.min(0.01)])
  }, {
    validators: [salePriceGreaterThanPurchasePriceValidator()]
  });

  readonly searchSupplier = new FormControl<string | LookupOption>('', { nonNullable: true });
  readonly searchCategory = new FormControl<string | LookupOption>('', { nonNullable: true });
  readonly searchUnit = new FormControl<string | LookupOption>('', { nonNullable: true });


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
        this.router.navigate(['/products'], {
          queryParams: { updated: true }
        });
      }
    });

  }

  ngOnInit(): void {

    this.facade.resetProductDetailsState();
    this.facade.resetUpdateState();
    this.autocompleteFacade.clearSupplierOptions();
    this.autocompleteFacade.clearCategoryOptions();
    this.autocompleteFacade.clearUnitOptions();
    this.autocompleteFacade.loadSupplierOptions('');
    this.autocompleteFacade.loadCategoryOptions('');
    this.autocompleteFacade.loadUnitOptions('');
    this.setAutocomplete();


    if (this.productId) {
      this.facade.loadProductDetails(this.productId);
    }
  }

  ngOnDestroy(): void {
    this.facade.resetProductDetailsState();
    this.facade.resetUpdateState();
    this.autocompleteFacade.clearSupplierOptions();
    this.autocompleteFacade.clearCategoryOptions();
    this.autocompleteFacade.clearUnitOptions();
  }


  onSaveClick(): void {

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.facade.updateProduct(this.toUpdateRequest());
  }

  getValidationErrorLabel(field: string): string {
    switch (field) {
      case 'supplierId':
        return 'Supplier';
      case 'categoryId':
        return 'Category';
      case 'unitId':
        return 'Unit';
      case 'purchasePrice':
        return 'Purchase Price';
      case 'salePrice':
        return 'Sale Price';
      default:
        return field;
    }
  }

  onRetryClick(): void {
    if (!this.productId) return;
    this.facade.loadProductDetails(this.productId);
  }

  onSupplierFocus(): void {
    this.loadOptionsFromControl(this.searchSupplier, 'supplier');
  }

  onCategoryFocus(): void {
    this.loadOptionsFromControl(this.searchCategory, 'category');
  }

  onUnitFocus(): void {
    this.loadOptionsFromControl(this.searchUnit, 'unit');
  }

  onSupplierSelected(event: MatAutocompleteSelectedEvent): void {
    const option = event.option.value as LookupOption;
    this.supplierId.setValue(option.value);
    this.searchSupplier.setValue(option, { emitEvent: false });
    this.supplierId.markAsTouched();
  }

  onCategorySelected(event: MatAutocompleteSelectedEvent): void {
    const option = event.option.value as LookupOption;
    this.categoryId.setValue(option.value);
    this.searchCategory.setValue(option, { emitEvent: false });
    this.categoryId.markAsTouched();
  }

  onUnitSelected(event: MatAutocompleteSelectedEvent): void {
    const option = event.option.value as LookupOption;
    this.unitId.setValue(option.value);
    this.searchUnit.setValue(option, { emitEvent: false });
    this.unitId.markAsTouched();
  }

  displayLookupOption(value: string | LookupOption | null): string {
    if (!value) return '';
    return typeof value === 'string' ? value : value.label;
  }

  private setAutocomplete(): void {
    this.searchSupplier.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(value => {
        if (typeof value !== 'string') {
          return;
        }

        this.supplierId.setValue(null);
        this.autocompleteFacade.searchSuppliers(value);
      });

    this.searchCategory.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(value => {
        if (typeof value !== 'string') {
          return;
        }

        this.categoryId.setValue(null);
        this.autocompleteFacade.searchCategories(value);
      });

    this.searchUnit.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(value => {
        if (typeof value !== 'string') {
          return;
        }

        this.unitId.setValue(null);
        this.autocompleteFacade.searchUnits(value);
      });
  }

  private loadOptionsFromControl(
    control: FormControl<string | LookupOption>,
    type: 'supplier' | 'category' | 'unit'
  ): void {
    const query = typeof control.value === 'string'
      ? control.value
      : control.value?.label ?? '';

    switch (type) {
      case 'supplier':
        this.autocompleteFacade.loadSupplierOptions(query);
        break;
      case 'category':
        this.autocompleteFacade.loadCategoryOptions(query);
        break;
      case 'unit':
        this.autocompleteFacade.loadUnitOptions(query);
        break;
    }
  }

  private patchForm(details: ProductDetails): void {
    this.productForm.patchValue({
      id: details.id,
      name: details.name,
      supplierId: details.supplier.id,
      categoryId: details.category.id,
      unitId: details.unit.id,
      stock: details.stock,
      purchasePrice: details.purchasePrice,
      salePrice: details.salePrice
    });

    this.searchSupplier.setValue({
      value: details.supplier.id,
      label: details.supplier.companyName
    }, { emitEvent: false });

    this.searchCategory.setValue({
      value: details.category.id,
      label: details.category.name
    }, { emitEvent: false });

    this.searchUnit.setValue({
      value: details.unit.id,
      label: details.unit.name
    }, { emitEvent: false });
  }

  clearOptionsFormControl(
    type: 'supplier' | 'category' | 'unit'
  ): void {
    switch (type) {
      case 'supplier':
        this.searchSupplier.setValue('');
        this.supplierId.setValue(null, { emitEvent: false });
        break;
      case 'category':
        this.searchCategory.setValue('');
        this.categoryId.setValue(null, { emitEvent: false });
        break;
      case 'unit':
        this.searchUnit.setValue('');
        this.unitId.setValue(null, { emitEvent: false });
        break;
    }
  }

  private toUpdateRequest(): UpdateProductRequest {
    const raw = this.productForm.getRawValue();

    return {
      productId: raw.id!,
      supplierId: raw.supplierId!,
      categoryId: raw.categoryId!,
      unitId: raw.unitId!,
      name: raw.name!,
      purchasePrice: raw.purchasePrice!,
      salePrice: raw.salePrice!
    };
  }

  get id() {
    return this.productForm.get('id') as FormControl;
  }

  get name() {
    return this.productForm.get('name') as FormControl;
  }

  get supplierId() {
    return this.productForm.get('supplierId') as FormControl;
  }

  get categoryId() {
    return this.productForm.get('categoryId') as FormControl;
  }

  get unitId() {
    return this.productForm.get('unitId') as FormControl;
  }

  get stock() {
    return this.productForm.get('stock') as FormControl;
  }

  get purchasePrice() {
    return this.productForm.get('purchasePrice') as FormControl;
  }

  get salePrice() {
    return this.productForm.get('salePrice') as FormControl;
  }
}
