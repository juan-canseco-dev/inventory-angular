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
import { SupplierDetails } from '../../models';
import { SuppliersFecade } from '../../store';

@Component({
  selector: 'app-details',
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
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(SuppliersFecade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private readonly supplierId = Number(this.route.snapshot.queryParamMap.get('supplierId'));

  readonly details = this.facade.supplierDetails;
  readonly detailsLoading = this.facade.supplierDetailsLoading;
  readonly detailsError = this.facade.supplierDetailsError;

  supplierForm: FormGroup = this.fb.group({
    id: [{ value: null }, [Validators.required]],
    companyName: [{ value: null }, [Validators.required, Validators.maxLength(50)]],
    contactName: [{ value: null }, [Validators.required, Validators.maxLength(50)]],
    contactPhone: [{ value: null }, [Validators.required, Validators.maxLength(20)]],
    address: this.fb.group({
      country: [{ value: null  }, [Validators.required, Validators.maxLength(50)]],
      state: [{ value: null }, [Validators.required, Validators.maxLength(50)]],
      city: [{ value: null }, [Validators.required, Validators.maxLength(50)]],
      zipCode: [{ value: null }, [Validators.required, Validators.maxLength(10)]],
      street: [{ value: null }, [Validators.required, Validators.maxLength(75)]]
    })
  });

  constructor() {
    this.facade.resetSupplierDetailsState();

    if (this.supplierId) {
      this.facade.loadSupplierDetails(this.supplierId);
    }

    effect(() => {
      const details = this.details();
      if (details) {
        this.patchForm(details);
      }
    });

    this.destroyRef.onDestroy(() => {
      this.facade.resetSupplierDetailsState();
    });
  }

  onBackClick(): void {
    this.router.navigate(['/suppliers']);
  }

  onRetryClick(): void {
    if (!this.supplierId) return;
    this.facade.loadSupplierDetails(this.supplierId);
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
