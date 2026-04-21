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
import { DeleteComponent, DeleteOrderDialogResult } from '../../components/delete';
import { GetOrdersRequest, Order } from '../../models';
import { OrdersFacade } from '../../store';

type OrderFilterKey =
  | 'customer'
  | 'delivered'
  | 'orderedAt'
  | 'deliveredAt';

type OrderSortField = 'id' | 'customer' | 'total' | 'orderedAt' | 'deliveredAt' | 'delivered';

@Component({
  selector: 'app-orders',
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
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersComponent implements OnInit, OnDestroy {
  private readonly facade = inject(OrdersFacade);
  private readonly autocompleteFacade = inject(AutocompleteFacade);
  private readonly permissionsFacade = inject(PermissionsFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('customerInput') private customerInput?: ElementRef<HTMLInputElement>;
  @ViewChild('deliveredInput') private deliveredInput?: ElementRef<HTMLSelectElement>;
  @ViewChild('orderedAtStartDateInput') private orderedAtStartDateInput?: ElementRef<HTMLInputElement>;
  @ViewChild('deliveredAtStartDateInput') private deliveredAtStartDateInput?: ElementRef<HTMLInputElement>;

  readonly page = this.facade.page;
  readonly orders = this.facade.orders;
  readonly loading = this.facade.loading;
  readonly error = this.facade.loadError;
  readonly empty = this.facade.empty;

  readonly addSuccess = signal(false);
  readonly updateSuccess = signal(false);
  readonly deleteSuccess = signal(false);
  readonly actionError = signal<string | null>(null);

  readonly hasLoadedPage = computed(() => !!this.page());
  readonly hasRenderedData = computed(() => this.orders().length > 0);
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
    this.permissionsFacade.hasPermission(PermissionCatalog.Orders_Create)
  );
  readonly hasViewPermission = computed(() =>
    this.permissionsFacade.hasPermission(PermissionCatalog.Orders_View)
  );
  readonly hasEditPermission = computed(() =>
    this.permissionsFacade.hasPermission(PermissionCatalog.Orders_Update)
  );
  readonly hasDeletePermission = computed(() =>
    this.permissionsFacade.hasPermission(PermissionCatalog.Orders_Delete)
  );

  readonly customerOptions = this.autocompleteFacade.customerOptions;
  readonly customerOptionsLoading = this.autocompleteFacade.customerOptionsLoading;
  readonly customerOptionsError = this.autocompleteFacade.customerOptionsError;

  readonly searchCustomer = new FormControl<string | LookupOption>('', { nonNullable: true });
  readonly searchDelivered = new FormControl('', { nonNullable: true });
  readonly searchOrderedAtStartDate = new FormControl<Date | null>(null);
  readonly searchOrderedAtEndDate = new FormControl<Date | null>(null);
  readonly searchDeliveredAtStartDate = new FormControl<Date | null>(null);
  readonly searchDeliveredAtEndDate = new FormControl<Date | null>(null);

  readonly searchForm = new FormGroup({
    customer: this.searchCustomer,
    delivered: this.searchDelivered,
    orderedAtStartDate: this.searchOrderedAtStartDate,
    orderedAtEndDate: this.searchOrderedAtEndDate,
    deliveredAtStartDate: this.searchDeliveredAtStartDate,
    deliveredAtEndDate: this.searchDeliveredAtEndDate
  });

  displayedColumns: string[] = [
    'id',
    'customer',
    'total',
    'delivered',
    'orderedAt',
    'deliveredAt',
    'actions'
  ];

  filtersClicked = false;
  private lastFocusedFilter: OrderFilterKey = 'customer';
  private readonly sortableFields: ReadonlySet<OrderSortField> = new Set([
    'id',
    'customer',
    'total',
    'orderedAt',
    'deliveredAt',
    'delivered'
  ]);

  request: GetOrdersRequest = {
    pageNumber: 1,
    pageSize: 10,
    sortOrder: 'asc',
    orderBy: 'id',
    customerId: null,
    delivered: null,
    orderedAtStartDate: null,
    orderedAtEndDate: null,
    deliveredAtStartDate: null,
    deliveredAtEndDate: null
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
    this.autocompleteFacade.clearCustomerOptions();
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
          customer: '',
          delivered: '',
          orderedAtStartDate: null,
          orderedAtEndDate: null,
          deliveredAtStartDate: null,
          deliveredAtEndDate: null
        },
        { emitEvent: false }
      );
      this.request.customerId = null;
      this.request.delivered = null;
      this.request.orderedAtStartDate = null;
      this.request.orderedAtEndDate = null;
      this.request.deliveredAtStartDate = null;
      this.request.deliveredAtEndDate = null;
      this.request.pageNumber = 1;
      this.loadPage();
      return;
    }

    this.focusLastUsedFilter();
  }

  onFilterFocus(filter: OrderFilterKey): void {
    this.lastFocusedFilter = filter;
  }

  onCreateClick(): void {
    this.router.navigateByUrl('/orders/create');
  }

  onEditClick(order: Order): void {
    this.router.navigate(['/orders/edit'], {
      queryParams: { orderId: order.id }
    });
  }

  onDetailsClick(order: Order): void {
    this.router.navigate(['/orders/details'], {
      queryParams: { orderId: order.id }
    });
  }

  onDeleteClick(order: Order): void {
    const dialogRef = this.dialog.open<
      DeleteComponent,
      { order: Order },
      DeleteOrderDialogResult | undefined
    >(DeleteComponent, {
      data: { order },
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

  onCustomerFocus(): void {
    this.onFilterFocus('customer');
    this.loadCustomerOptionsFromControl();
  }

  onCustomerSelected(event: MatAutocompleteSelectedEvent): void {
    const option = event.option.value as LookupOption;
    this.request.customerId = option.value;
    this.searchCustomer.setValue(option, { emitEvent: false });
    this.request.pageNumber = 1;
    this.loadPage();
  }

  clearOrderedAtRange(): void {
    this.searchOrderedAtStartDate.setValue(null);
    this.searchOrderedAtEndDate.setValue(null);
  }

  clearDeliveredAtRange(): void {
    this.searchDeliveredAtStartDate.setValue(null);
    this.searchDeliveredAtEndDate.setValue(null);
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
        this.request.customerId = typeof value.customer === 'string' ? null : this.request.customerId;
        this.request.delivered = this.toNullableBoolean(value.delivered);
        this.request.orderedAtStartDate = this.toRangeStartDate(value.orderedAtStartDate);
        this.request.orderedAtEndDate = this.toRangeEndDate(value.orderedAtEndDate);
        this.request.deliveredAtStartDate = this.toRangeStartDate(value.deliveredAtStartDate);
        this.request.deliveredAtEndDate = this.toRangeEndDate(value.deliveredAtEndDate);
        this.request.pageNumber = 1;
        this.loadPage();
      });

    this.searchCustomer.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value) => {
        if (typeof value !== 'string') {
          return;
        }

        this.request.customerId = null;
        this.autocompleteFacade.searchCustomers(value);
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

  private loadCustomerOptionsFromControl(): void {
    const value = this.searchCustomer.value;
    const query = typeof value === 'string' ? value : value?.label ?? '';

    this.autocompleteFacade.loadCustomerOptions(query);
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

  private getFilterInput(filter: OrderFilterKey): HTMLInputElement | HTMLSelectElement | undefined {
    switch (filter) {
      case 'delivered':
        return this.deliveredInput?.nativeElement;
      case 'orderedAt':
        return this.orderedAtStartDateInput?.nativeElement;
      case 'deliveredAt':
        return this.deliveredAtStartDateInput?.nativeElement;
      case 'customer':
      default:
        return this.customerInput?.nativeElement;
    }
  }

  private isSortableField(value: string): value is OrderSortField {
    return this.sortableFields.has(value as OrderSortField);
  }

  private loadPage(): void {
    this.facade.loadPage({ ...this.request });
  }
}
