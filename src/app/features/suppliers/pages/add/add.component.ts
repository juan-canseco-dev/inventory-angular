import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
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
import { IconModule } from '@coreui/icons-angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { CreateSupplierRequest } from '../../models';
import { SuppliersFecade } from '../../store';

@Component({
  selector: 'app-add',
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
    IconModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    NgxShimmerLoadingModule
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddComponent {

  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(SuppliersFecade);
  private readonly router = inject(Router);

  readonly createLoading = this.facade.createLoading;
  readonly createSuccess = this.facade.createSuccess;
  readonly createError = this.facade.createError;

  supplierForm: FormGroup = this.fb.group({
    companyName: [null, [Validators.required, Validators.maxLength(50)]],
    contactName: [null, [Validators.required, Validators.maxLength(50)]],
    contactPhone: [null, [Validators.required, Validators.maxLength(20)]],
    address: this.fb.group({
      country: [null, [Validators.required, Validators.maxLength(50)]],
      state: [null, [Validators.required, Validators.maxLength(50)]],
      city: [null, [Validators.required, Validators.maxLength(50)]],
      zipCode: [null, [Validators.required, Validators.maxLength(10)]],
      street: [null, [Validators.required, Validators.maxLength(75)]]
    })
  });

  constructor() {
    this.facade.resetCreateState();

    effect(() => {
      if (this.createSuccess()) {
        this.facade.resetCreateState();
        this.router.navigate(['/suppliers'], {
          queryParams: { added: true }
        });
      }
    });
  }

  onSaveClick(): void {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }

    this.facade.createSupplier(this.toCreateRequest());
  }

  private toCreateRequest(): CreateSupplierRequest {
    const raw = this.supplierForm.getRawValue();

    return {
      companyName: raw.companyName,
      contactName: raw.contactName,
      contactPhone: raw.contactPhone,
      address: raw.address
    };
  }

  get companyName() {
    return this.supplierForm.get('companyName') as FormControl;
  }

  get contactName() {
    return this.supplierForm.get('contactName') as FormControl;
  }

  get contactPhone() {
    return this.supplierForm.get('contactPhone') as FormControl;
  }

  get address() {
    return this.supplierForm.get('address') as FormGroup;
  }

  get country() {
    return this.address.get('country') as FormControl;
  }

  get state() {
    return this.address.get('state') as FormControl;
  }

  get city() {
    return this.address.get('city') as FormControl;
  }

  get zipCode() {
    return this.address.get('zipCode') as FormControl;
  }

  get street() {
    return this.address.get('street') as FormControl;
  }
}
