import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, inject, Injector, OnInit, runInInjectionContext, signal, Signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, FormControl, FormControlName } from '@angular/forms';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  ContainerComponent,
  PageItemDirective,
  PageLinkDirective,
  PaginationComponent,
  RowComponent,
  TableDirective,
  TableModule,
  GridModule,
  ToastModule
} from '@coreui/angular';
import { IconDirective, IconModule } from '@coreui/icons-angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { debounceTime, distinctUntilChanged, filter, map, Observable, of, retryWhen, shareReplay, single } from 'rxjs';
import { Result } from '../../../core/models/result';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { SuppliersService } from '../../../core/services/suppliers';

@Component({
  selector: 'app-add',
  imports: [
    RowComponent,
    ColComponent,
    ContainerComponent,
    TableDirective,
    TableModule,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    CardFooterComponent,
    PaginationComponent,
    PageItemDirective,
    PageLinkDirective,
    ButtonDirective,
    ToastModule,
    IconDirective,
    FontAwesomeModule,
    RouterLink,
    ButtonDirective,
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
export class AddComponent implements OnInit {

  private result$: Observable<Result<number>> = of(Result.empty<number>());

  empty$: Observable<boolean> = of(true);
  loading$: Observable<boolean> = of(false);
  success$: Observable<boolean> = of(false);

  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private service = inject(SuppliersService);

  supplierForm !: FormGroup;

  ngOnInit(): void {
    this.supplierForm = this.fb.group({
      companyName: [null,
        [Validators.required,
        Validators.maxLength(50)]
      ],
      contactName: [null, [
        Validators.required,
        Validators.maxLength(50)]
      ],
      contactPhone: [null,
        [
          Validators.required,
          Validators.maxLength(20)
        ]
      ],
      address: this.fb.group({
        country: [null,
          [
            Validators.required,
            Validators.maxLength(50)
          ]
        ],
        state: [null,
          [
            Validators.required,
            Validators.maxLength(50)
          ]
        ],
        city: [null,
          [
            Validators.required,
            Validators.maxLength(50)
          ]
        ],
        zipCode: [null,
          [
            Validators.required,
            Validators.maxLength(10)
          ]
        ],
        street: [null,
          [
            Validators.required,
            Validators.maxLength(75)
          ]
        ]
      })
    });
  }


  onSaveClick() {

    if (!this.supplierForm.valid) return;

    this.result$ = this.service.create(this.supplierForm.value).pipe(
      shareReplay(1)
    );

    this.empty$ = this.result$.pipe(
      map(r => r.status === 'empty')
    );

    this.loading$ = this.result$.pipe(
      map(r => r.status === 'loading')
    );

    this.success$ = this.result$.pipe(
      map(r => r.status === 'success'),
      takeUntilDestroyed(this.destroyRef)
    );

    this.success$.subscribe(r=> console.log(r));
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
