import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
  ToastModule,
  ButtonDirective
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
import { SupplierDetails, UpdateSupplierRequest } from '../../models';
import { SuppliersFecade } from '../../store';

@Component({
  selector: 'app-edit',
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
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    NgxShimmerLoadingModule
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditComponent {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(SuppliersFecade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private readonly supplierId = Number(this.route.snapshot.queryParamMap.get('supplierId'));

  readonly details = this.facade.supplierDetails;
  readonly detailsLoading = this.facade.supplierDetailsLoading;
  readonly detailsError = this.facade.supplierDetailsError;

  readonly updateLoading = this.facade.updateLoading;
  readonly updateSuccess = this.facade.updateSuccess;
  readonly updateError = this.facade.updateError;

  supplierForm: FormGroup = this.fb.group({
    id: [{ value: null}, [Validators.required]],
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
    this.facade.resetSupplierDetailsState();
    this.facade.resetUpdateState();

    if (this.supplierId) {
      this.facade.loadSupplierDetails(this.supplierId);
    }

    effect(() => {
      const details = this.details();
      if (details) {
        this.patchForm(details);
      }
    });

    effect(() => {
      if (this.updateSuccess()) {
        this.facade.resetUpdateState();
        this.router.navigate(['/suppliers'], {
          queryParams: { updated: true }
        });
      }
    });

    this.destroyRef.onDestroy(() => {
      this.facade.resetSupplierDetailsState();
      this.facade.resetUpdateState();
    });
  }

  onSaveClick(): void {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }

    this.facade.updateSupplier(this.toUpdateRequest());
  }

  onRetryClick(): void {
    if (!this.supplierId) return;
    this.facade.loadSupplierDetails(this.supplierId);
  }

  private toUpdateRequest(): UpdateSupplierRequest {
    const raw = this.supplierForm.getRawValue();

    return {
      supplierId: raw.id,
      companyName: raw.companyName,
      contactName: raw.contactName,
      contactPhone: raw.contactPhone,
      address: raw.address
    };
  }

  private patchForm(details: SupplierDetails): void {
    this.supplierForm.patchValue({
      id: details.id,
      companyName: (details as any).companyName ?? details.compayName ?? '',
      contactName: details.contactName,
      contactPhone: details.contactPhone,
      address: {
        country: details.address.country,
        state: details.address.state,
        city: details.address.city,
        zipCode: details.address.zipCode,
        street: details.address.street
      }
    });
  }

  get id() {
    return this.supplierForm.get('id') as FormControl;
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
