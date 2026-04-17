import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule
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
import { IconModule } from '@coreui/icons-angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { ProductDetails } from '../../models';
import { ProductsFacade } from '../../store';

@Component({
  selector: 'app-product-details',
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
    IconModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    NgxShimmerLoadingModule
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(ProductsFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private readonly productId = Number(this.route.snapshot.queryParamMap.get('productId'));

  readonly details = this.facade.productDetails;
  readonly detailsLoading = this.facade.productDetailsLoading;
  readonly detailsError = this.facade.productDetailsError;

  readonly productForm = this.fb.group({
    id: this.fb.control<number | null>({ value: null, disabled: false }),
    name: this.fb.control<string | null>({ value: null, disabled: false }),
    supplier: this.fb.control<string | null>({ value: null, disabled: false }),
    category: this.fb.control<string | null>({ value: null, disabled: false }),
    unit: this.fb.control<string | null>({ value: null, disabled: false }),
    stock: this.fb.control<number | null>({ value: null, disabled: false }),
    purchasePrice: this.fb.control<number | null>({ value: null, disabled: false }),
    salePrice: this.fb.control<number | null>({ value: null, disabled: false })
  });

  constructor() {
    this.facade.resetProductDetailsState();

    if (this.productId) {
      this.facade.loadProductDetails(this.productId);
    }

    effect(() => {
      const details = this.details();
      if (details) {
        this.patchForm(details);
      }
    });

    this.destroyRef.onDestroy(() => {
      this.facade.resetProductDetailsState();
    });
  }

  onBackClick(): void {
    this.router.navigate(['/products']);
  }

  onRetryClick(): void {
    if (!this.productId) return;
    this.facade.loadProductDetails(this.productId);
  }

  private patchForm(details: ProductDetails): void {
    this.productForm.patchValue({
      id: details.id,
      name: details.name,
      supplier: details.supplier.companyName,
      category: details.category.name,
      unit: details.unit.name,
      stock: details.stock,
      purchasePrice: details.purchasePrice,
      salePrice: details.salePrice
    });
  }

  get id() {
    return this.productForm.get('id') as FormControl;
  }

  get name() {
    return this.productForm.get('name') as FormControl;
  }

  get supplier() {
    return this.productForm.get('supplier') as FormControl;
  }

  get category() {
    return this.productForm.get('category') as FormControl;
  }

  get unit() {
    return this.productForm.get('unit') as FormControl;
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
