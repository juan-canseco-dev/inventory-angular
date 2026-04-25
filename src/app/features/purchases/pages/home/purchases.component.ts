import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  GridModule,
  RowComponent,
  TableDirective,
  TableModule,
  ToastModule
} from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent
} from '@angular/material/autocomplete';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PermissionCatalog } from '../../../../core/permissions';
import { PermissionsFacade } from '../../../../core/auth/store';
import { flashError, flashSuccess } from '../../../../shared/utils';
import { AutocompleteFacade, LookupOption } from '../../../../shared/autocomplete';
import { DeleteComponent, DeletePurchaseDialogResult } from '../../components/delete';
import { GetPurchasesRequest, Purchase } from '../../models';
import { PurchasesFacade } from '../../store';

type PurchaseFilterKey =
  | 'supplier'
  | 'arrived'
  | 'orderedAt'
  | 'arrivedAt';

type PurchaseSortField = 'id' | 'supplier' | 'total' | 'orderedAt' | 'arrivedAt' | 'arrived';

@Component({
  selector: 'app-purchases',
  imports: [
    RowComponent,
    ColComponent,
    TableDirective,
    TableModule,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    CardFooterComponent,
    ButtonDirective,
    ToastModule,
    FontAwesomeModule,
    GridModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    NgxShimmerLoadingModule
  ],
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PurchasesComponent implements OnInit, OnDestroy {
  private readonly facade = inject(PurchasesFacade);
  private readonly autocompleteFacade = inject(AutocompleteFacade);
  private readonly permissionsFacade = inject(PermissionsFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('supplierInput') private supplierInput?: ElementRef<HTMLInputElement>;
  @ViewChild('arrivedInput') private arrivedInput?: ElementRef<HTMLSelectElement>;
  @ViewChild('orderedAtStartDateInput') private orderedAtStartDateInput?: ElementRef<HTMLInputElement>;
  @ViewChild('arrivedAtStartDateInput') private arrivedAtStartDateInput?: ElementRef<HTMLInputElement>;

  readonly page = this.facade.page;
  readonly purchases = this.facade.purchases;
  readonly loading = this.facade.loading;
  readonly error = this.facade.loadError;
  readonly empty = this.facade.empty;

  readonly addSuccess = signal(false);
  readonly updateSuccess = signal(false);
  readonly deleteSuccess = signal(false);
  readonly actionError = signal<string | null>(null);

  readonly hasLoadedPage = computed(() => !!this.page());
  readonly hasRenderedData = computed(() => this.purchases().length > 0);
  readonly isSuccess = computed(() => this.hasRenderedData());
  readonly showInitialLoading = computed(() => this.loading() && !this.hasLoadedPage());
  readonly showInitialError = computed(() => !!this.error() && !this.hasLoadedPage());
  readonly isRefreshing = computed(() => this.loading() && this.hasLoadedPage());
  readonly showEmptyState = computed(() =>
    this.hasLoadedPage() && !this.hasRenderedData() && !this.showInitialError()
  );
  readonly showRefreshError = computed(() => !!this.error() && this.hasLoadedPage());
  readonly canShowToolbarActions = computed(() => this.hasLoadedPage());

  readonly hasCreatePermission = computed(() =>
    this.permissionsFacade.hasPermission(PermissionCatalog.Purchases_Create)
  );
  readonly hasViewPermission = computed(() =>
    this.permissionsFacade.hasPermission(PermissionCatalog.Purchases_View)
  );
  readonly hasEditPermission = computed(() =>
    this.permissionsFacade.hasPermission(PermissionCatalog.Purchases_Update)
  );
  readonly hasDeletePermission = computed(() =>
    this.permissionsFacade.hasPermission(PermissionCatalog.Purchases_Delete)
  );

  readonly supplierOptions = this.autocompleteFacade.supplierOptions;
  readonly supplierOptionsLoading = this.autocompleteFacade.supplierOptionsLoading;
  readonly supplierOptionsError = this.autocompleteFacade.supplierOptionsError;

  readonly searchSupplier = new FormControl<string | LookupOption>('', { nonNullable: true });
  readonly searchArrived = new FormControl('', { nonNullable: true });
  readonly searchOrderedAtStartDate = new FormControl<Date | null>(null);
  readonly searchOrderedAtEndDate = new FormControl<Date | null>(null);
  readonly searchArrivedAtStartDate = new FormControl<Date | null>(null);
  readonly searchArrivedAtEndDate = new FormControl<Date | null>(null);

  readonly searchForm = new FormGroup({
    supplier: this.searchSupplier,
    arrived: this.searchArrived,
    orderedAtStartDate: this.searchOrderedAtStartDate,
    orderedAtEndDate: this.searchOrderedAtEndDate,
    arrivedAtStartDate: this.searchArrivedAtStartDate,
    arrivedAtEndDate: this.searchArrivedAtEndDate
  });

  displayedColumns: string[] = [
    'id',
    'supplier',
    'total',
    'arrived',
    'orderedAt',
    'arrivedAt',
    'actions'
  ];

  filtersClicked = false;
  private lastFocusedFilter: PurchaseFilterKey = 'supplier';
  private readonly sortableFields: ReadonlySet<PurchaseSortField> = new Set([
    'id',
    'supplier',
    'total',
    'orderedAt',
    'arrivedAt',
    'arrived'
  ]);

  request: GetPurchasesRequest = {
    pageNumber: 1,
    pageSize: 10,
    sortOrder: 'asc',
    orderBy: 'id',
    supplierId: null,
    arrived: null,
    orderedAtStartDate: null,
    orderedAtEndDate: null,
    arrivedAtStartDate: null,
    arrivedAtEndDate: null
  };

  constructor() {
    effect(() => {
      if (this.filtersClicked && this.canShowToolbarActions()) {
        this.focusLastUsedFilter();
      }
    });
  }

  ngOnInit(): void {
    this.loadPage();
    this.setFiltering();
    this.setStatusToasts();
  }

  ngOnDestroy(): void {
    this.autocompleteFacade.clearSupplierOptions();
  }

  onPageChange(event: PageEvent): void {
    this.request.pageNumber = event.pageIndex + 1;
    this.request.pageSize = event.pageSize;
    this.loadPage();
  }

  onSortChange(sort: Sort): void {
    if (!this.isSortableField(sort.active)) {
      return;
    }

    this.request.orderBy = sort.active;
    this.request.sortOrder = sort.direction || 'asc';
    this.loadPage();
  }

  onFiltersClicked(): void {
    this.filtersClicked = !this.filtersClicked;

    if (!this.filtersClicked) {
      this.searchForm.patchValue(
        {
          supplier: '',
          arrived: '',
          orderedAtStartDate: null,
          orderedAtEndDate: null,
          arrivedAtStartDate: null,
          arrivedAtEndDate: null
        },
        { emitEvent: false }
      );
      this.request.supplierId = null;
      this.request.arrived = null;
      this.request.orderedAtStartDate = null;
      this.request.orderedAtEndDate = null;
      this.request.arrivedAtStartDate = null;
      this.request.arrivedAtEndDate = null;
      this.request.pageNumber = 1;
      this.loadPage();
      return;
    }

    this.focusLastUsedFilter();
  }

  onFilterFocus(filter: PurchaseFilterKey): void {
    this.lastFocusedFilter = filter;
  }

  onCreateClick(): void {
    this.router.navigateByUrl('/purchases/create');
  }

  onEditClick(purchase: Purchase): void {
    this.router.navigate(['/purchases/edit'], {
      queryParams: { purchaseId: purchase.id }
    });
  }

  onDetailsClick(purchase: Purchase): void {
    this.router.navigate(['/purchases/details'], {
      queryParams: { purchaseId: purchase.id }
    });
  }

  onDeleteClick(purchase: Purchase): void {
    const dialogRef = this.dialog.open<
      DeleteComponent,
      { purchase: Purchase },
      DeletePurchaseDialogResult | undefined
    >(DeleteComponent, {
      data: { purchase },
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (!result) return;

        if (result.success) {
          flashSuccess(this.deleteSuccess);
          return;
        }

        if (result.error) {
          flashError(this.actionError, result.error);
        }
      });
  }

  onRetryClick(): void {
    this.loadPage();
  }

  onSupplierFocus(): void {
    this.onFilterFocus('supplier');
    this.loadSupplierOptionsFromControl();
  }

  onSupplierSelected(event: MatAutocompleteSelectedEvent): void {
    const option = event.option.value as LookupOption;
    this.request.supplierId = option.value;
    this.searchSupplier.setValue(option, { emitEvent: false });
    this.request.pageNumber = 1;
    this.loadPage();
  }

  clearOrderedAtRange(): void {
    this.searchOrderedAtStartDate.setValue(null);
    this.searchOrderedAtEndDate.setValue(null);
  }

  clearArrivedAtRange(): void {
    this.searchArrivedAtStartDate.setValue(null);
    this.searchArrivedAtEndDate.setValue(null);
  }

  displayLookupOption(value: string | LookupOption | null): string {
    if (!value) return '';
    return typeof value === 'string' ? value : value.label;
  }

  private setFiltering(): void {
    this.searchForm.valueChanges
      .pipe(
        debounceTime(300),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value) => {
        this.request.supplierId = typeof value.supplier === 'string' ? null : this.request.supplierId;
        this.request.arrived = this.toNullableBoolean(value.arrived);
        this.request.orderedAtStartDate = this.toRangeStartDate(value.orderedAtStartDate);
        this.request.orderedAtEndDate = this.toRangeEndDate(value.orderedAtEndDate);
        this.request.arrivedAtStartDate = this.toRangeStartDate(value.arrivedAtStartDate);
        this.request.arrivedAtEndDate = this.toRangeEndDate(value.arrivedAtEndDate);
        this.request.pageNumber = 1;
        this.loadPage();
      });

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

        this.request.supplierId = null;
        this.autocompleteFacade.searchSuppliers(value);
      });
  }

  private setStatusToasts(): void {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.addSuccess.set(params.get('added') === 'true');
        this.updateSuccess.set(params.get('updated') === 'true');
      });
  }

  private loadSupplierOptionsFromControl(): void {
    const value = this.searchSupplier.value;
    const query = typeof value === 'string' ? value : value?.label ?? '';

    this.autocompleteFacade.loadSupplierOptions(query);
  }

  private toNullableBoolean(value: string | null | undefined): boolean | null {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return null;
  }

  private toRangeStartDate(value: Date | null | undefined): Date | null {
    if (!value) return null;

    return new Date(
      value.getFullYear(),
      value.getMonth(),
      value.getDate(),
      0,
      0,
      0
    );
  }

  private toRangeEndDate(value: Date | null | undefined): Date | null {
    if (!value) return null;

    return new Date(
      value.getFullYear(),
      value.getMonth(),
      value.getDate(),
      23,
      59,
      59
    );
  }

  private focusLastUsedFilter(): void {
    setTimeout(() => {
      this.getFilterInput(this.lastFocusedFilter)?.focus();
    });
  }

  private getFilterInput(filter: PurchaseFilterKey): HTMLInputElement | HTMLSelectElement | undefined {
    switch (filter) {
      case 'arrived':
        return this.arrivedInput?.nativeElement;
      case 'orderedAt':
        return this.orderedAtStartDateInput?.nativeElement;
      case 'arrivedAt':
        return this.arrivedAtStartDateInput?.nativeElement;
      case 'supplier':
      default:
        return this.supplierInput?.nativeElement;
    }
  }

  private isSortableField(value: string): value is PurchaseSortField {
    return this.sortableFields.has(value as PurchaseSortField);
  }

  private loadPage(): void {
    this.facade.loadPage({ ...this.request });
  }
}
