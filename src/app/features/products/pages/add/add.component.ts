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
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
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
import { CreateProductRequest } from '../../models';
import { ProductsFacade } from '../../store';
import { salePriceGreaterThanPurchasePriceValidator } from '../../validators/sale-price.validator';

@Component({
  selector: 'app-add-product',
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    CardFooterComponent,
    ToastModule,
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
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(ProductsFacade);
  private readonly autocompleteFacade = inject(AutocompleteFacade);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly createLoading = this.facade.createLoading;
  readonly createSuccess = this.facade.createSuccess;
  readonly createError = this.facade.createError;

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
    name: this.fb.control<string | null>(null, [Validators.required, Validators.maxLength(50)]),
    supplierId: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
    categoryId: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
    unitId: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
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
      if (this.createSuccess()) {
        this.facade.resetCreateState();
        this.router.navigate(['/products'], {
          queryParams: { added: true }
        });
      }
    });
  }


  ngOnInit() {
    this.facade.resetCreateState();
    this.autocompleteFacade.clearSupplierOptions();
    this.autocompleteFacade.clearCategoryOptions();
    this.autocompleteFacade.clearUnitOptions();
    this.autocompleteFacade.loadSupplierOptions('');
    this.autocompleteFacade.loadCategoryOptions('');
    this.autocompleteFacade.loadUnitOptions('');
    this.setAutocomplete();
  }

  ngOnDestroy(): void {
    this.facade.resetCreateState();
    this.autocompleteFacade.clearSupplierOptions();
    this.autocompleteFacade.clearCategoryOptions();
    this.autocompleteFacade.clearUnitOptions();
  }

  onSaveClick(): void {

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      console.log(this.productForm);
      return;
    }

    this.facade.createProduct(this.toCreateRequest());
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

  private toCreateRequest(): CreateProductRequest {
    const raw = this.productForm.getRawValue();

    return {
      supplierId: raw.supplierId!,
      categoryId: raw.categoryId!,
      unitId: raw.unitId!,
      name: raw.name!,
      purchasePrice: raw.purchasePrice!,
      salePrice: raw.salePrice!
    };
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

  get purchasePrice() {
    return this.productForm.get('purchasePrice') as FormControl;
  }

  get salePrice() {
    return this.productForm.get('salePrice') as FormControl;
  }
}
