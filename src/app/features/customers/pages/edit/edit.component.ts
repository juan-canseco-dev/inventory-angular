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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { CustomerDetails, UpdateCustomerRequest } from '../../models';
import { CustomersFacade } from '../../store';

@Component({
  selector: 'app-edit-customer',
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
export class EditCustomerComponent {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(CustomersFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private readonly customerId = Number(this.route.snapshot.queryParamMap.get('customerId'));

  readonly details = this.facade.customerDetails;
  readonly detailsLoading = this.facade.customerDetailsLoading;
  readonly detailsError = this.facade.customerDetailsError;

  readonly updateLoading = this.facade.updateLoading;
  readonly updateSuccess = this.facade.updateSuccess;
  readonly updateError = this.facade.updateError;

  customerForm: FormGroup = this.fb.group({
    id: [{ value: null }, [Validators.required]],
    dni: [null, [Validators.required, Validators.maxLength(20)]],
    phone: [null, [Validators.required, Validators.maxLength(20)]],
    fullName: [null, [Validators.required, Validators.maxLength(50)]],
    address: this.fb.group({
      country: [null, [Validators.required, Validators.maxLength(50)]],
      state: [null, [Validators.required, Validators.maxLength(50)]],
      city: [null, [Validators.required, Validators.maxLength(50)]],
      zipCode: [null, [Validators.required, Validators.maxLength(10)]],
      street: [null, [Validators.required, Validators.maxLength(75)]]
    })
  });

  constructor() {
    this.facade.resetCustomerDetailsState();
    this.facade.resetUpdateState();

    if (this.customerId) {
      this.facade.loadCustomerDetails(this.customerId);
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
        this.router.navigate(['/customers'], {
          queryParams: { updated: true }
        });
      }
    });

    this.destroyRef.onDestroy(() => {
      this.facade.resetCustomerDetailsState();
      this.facade.resetUpdateState();
    });
  }

  onSaveClick(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    this.facade.updateCustomer(this.toUpdateRequest());
  }

  onRetryClick(): void {
    if (!this.customerId) return;
    this.facade.loadCustomerDetails(this.customerId);
  }

  private toUpdateRequest(): UpdateCustomerRequest {
    const raw = this.customerForm.getRawValue();

    return {
      customerId: raw.id,
      dni: raw.dni,
      phone: raw.phone,
      fullName: raw.fullName,
      address: raw.address
    };
  }

  private patchForm(details: CustomerDetails): void {
    this.customerForm.patchValue({
      id: details.id,
      dni: details.dni,
      phone: details.phone,
      fullName: details.fullName,
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
    return this.customerForm.get('id') as FormControl;
  }

  get dni() {
    return this.customerForm.get('dni') as FormControl;
  }

  get phone() {
    return this.customerForm.get('phone') as FormControl;
  }

  get fullName() {
    return this.customerForm.get('fullName') as FormControl;
  }

  get address() {
    return this.customerForm.get('address') as FormGroup;
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
