import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, inject, Injector, OnInit, runInInjectionContext, signal, Signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
import { debounceTime, distinctUntilChanged, filter, map, Observable, of, retryWhen, shareReplay, single, switchMap } from 'rxjs';
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
import { Supplier } from 'src/app/core/models/supplier';
import { faL } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit',
  imports: [
    RowComponent,
    ColComponent,
    TableModule,
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
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditComponent implements OnInit {

  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private service = inject(SuppliersService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private supplierForm !: FormGroup;
  private editResult$: Observable<Result<any>> = of(Result.empty<any>());
  private fetchResult$: Observable<Result<Supplier>> = of(Result.empty<Supplier>());

  idle$: Observable<boolean> = of(false);
  fetching$: Observable<boolean> = of(false);
  supplier$: Observable<Supplier | null> = of(null);
  fetchError$: Observable<string | null> = of(null);
  editing$: Observable<boolean> = of(false);
  edited$: Observable<boolean> = of(false);
  editError$: Observable<string | null> = of(null);

  ngOnInit(): void {
    this.supplierForm = this.fb.group({
      id: [null, [
        Validators.required
      ]],
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



  getSupplier() : void {

    this.fetchResult$ = this.route.queryParamMap.pipe(
      map(params => params.get('supplierId') !== null? +!params.get('supplierId') : 0),
      switchMap(id => this.service.getById(id)),
      shareReplay(1)
    );

    this.fetching$ = this.fetchResult$.pipe(
      map(r => r.status === 'loading')
    );

    this.fetchError$ = this.fetchResult$.pipe(
      map(r => r.status === 'failure' ? r.failure.message : null)
    );

    this.supplier$ = this.fetchResult$.pipe(
      filter(r => r.status === 'success'),
      map(r => r.value),
      takeUntilDestroyed(this.destroyRef)
    );

    this.idle$ = this.fetchResult$.pipe(
      filter(r => r.status === 'success'),
      map(_ => true)
    );

    this.supplier$.subscribe(supplier => {
      this.supplierForm.patchValue({
        id: supplier.id,
        companyName: supplier.companyName,
        contactName: supplier.contactName,
        contactPhone: supplier.contactPhone,
        address: {
          country: supplier.address.country,
          state: supplier.address.state,
          city: supplier.address.city,
          zipCode: supplier.address.zipCode, 
          street: supplier.address.street
        }
      });
    });
  } 

  onEditClick() : void {
    this.idle$ = of(false);
    
  }

}
