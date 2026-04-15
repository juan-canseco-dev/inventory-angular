import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
  signal,
  computed,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  ContainerComponent,
  GridModule,
  RowComponent,
  TableDirective,
  TableModule,
  ToastModule
} from '@coreui/angular';
import { IconDirective, IconModule } from '@coreui/icons-angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule, Sort } from '@angular/material/sort';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Customer, GetCustomersRequest } from '../../models';
import { CustomersFacade } from '../../store';
import {
  DeleteCustomerComponent,
  DeleteCustomerDialogResult
} from '../../components/delete';
import { flashError, flashSuccess} from '../../../../shared/utils';
import { PermissionsFacade } from 'src/app/core/auth/store';
import { PermissionCatalog } from 'src/app/core/permissions';

type CustomerFilterKey = 'dni' | 'name' | 'phone';

@Component({
  selector: 'app-customers',
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
    ButtonDirective,
    ToastModule,
    IconDirective,
    FontAwesomeModule,
    RouterLink,
    GridModule,
    IconModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    NgxShimmerLoadingModule
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersComponent implements OnInit {

  private readonly facade = inject(CustomersFacade);
  private readonly permissionsFacade = inject(PermissionsFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('dniInput') private dniInput?: ElementRef<HTMLInputElement>;
  @ViewChild('fullNameInput') private fullNameInput?: ElementRef<HTMLInputElement>;
  @ViewChild('phoneInput') private phoneInput?: ElementRef<HTMLInputElement>;

  readonly page = this.facade.page;
  readonly customers = this.facade.customers;
  readonly loading = this.facade.loading;
  readonly error = this.facade.loadError;
  readonly empty = this.facade.empty;

  readonly isSuccess = computed(() => !this.loading() && !this.error() && !this.empty());
  readonly canShowToolbarActions = computed(() => this.isSuccess() || this.empty());

  readonly addSuccess = signal(false);
  readonly updateSuccess = signal(false);
  readonly deleteSuccess = signal(false);
  readonly actionError = signal<string | null>(null);

  readonly hasCreatePermission = computed(() => this.permissionsFacade.hasPermission(PermissionCatalog.Customers_Create));
  readonly hasEditPermission = computed(() => this.permissionsFacade.hasPermission(PermissionCatalog.Customers_Update));
  readonly hasDeletePermission = computed(() => this.permissionsFacade.hasPermission(PermissionCatalog.Customers_Delete));

  displayedColumns: string[] = ['id', 'dni', 'fullName', 'phone', 'actions'];

  filtersClicked = false;
  private lastFocusedFilter: CustomerFilterKey = 'dni';

  searchDni = new FormControl('');
  searchFullName = new FormControl('');
  searchPhone = new FormControl('');

  searchForm = new FormGroup({
    dni: this.searchDni,
    fullName: this.searchFullName,
    phone: this.searchPhone
  });

  request: GetCustomersRequest = {
    pageNumber: 1,
    pageSize: 10,
    sortOrder: 'asc',
    orderBy: 'id',
    dni: null,
    fullName: null,
    phone: null
  };

  constructor() {
    effect(() => {
      if (this.canShowToolbarActions() && this.filtersClicked) {
        this.focusLastUsedFilter();
      }
    });
  }

  ngOnInit(): void {
    this.loadPage();
    this.setFiltering();

    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        this.addSuccess.set(params.get('added') === 'true');
        this.updateSuccess.set(params.get('updated') === 'true');
      });
  }

  onPageChange(e: PageEvent): void {
    this.request.pageNumber = e.pageIndex + 1;
    this.request.pageSize = e.pageSize;
    this.loadPage();
  }

  onSortChange(sort: Sort): void {
    this.request.orderBy = sort.active;
    this.request.sortOrder = sort.direction || 'asc';
    this.loadPage();
  }

  onFiltersClicked(): void {
    this.filtersClicked = !this.filtersClicked;

    if (!this.filtersClicked) {
      this.searchForm.patchValue(
        {
          dni: '',
          fullName: '',
          phone: ''
        },
        { emitEvent: true }
      );
      return;
    }

    this.focusLastUsedFilter();
  }

  onFilterFocus(filter: CustomerFilterKey): void {
    this.lastFocusedFilter = filter;
  }

  onCreateClick(): void {
    this.router.navigateByUrl('/customers/create');
  }

  onEditClick(customer: Customer): void {
    this.router.navigate(['/customers/edit'], {
      queryParams: { customerId: customer.id }
    });
  }

  onDetailsClick(customer: Customer): void {
    this.router.navigate(['/customers/details'], {
      queryParams: { customerId: customer.id }
    });
  }


  onDeleteClick(customer: Customer): void {
    const dialogRef = this.dialog.open<
      DeleteCustomerComponent,
      { customer: Customer },
      DeleteCustomerDialogResult | undefined
    >(DeleteCustomerComponent, {
      data: { customer },
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
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

  private loadPage(): void {
    this.facade.loadPage({ ...this.request });
  }

  private setFiltering(): void {
    this.searchForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(value => {
        this.request.dni = value.dni ? value.dni : null;
        this.request.fullName = value.fullName ? value.fullName : null;
        this.request.phone = value.phone ? value.phone : null;
        this.request.pageNumber = 1;
        this.loadPage();
      });
  }

  private focusLastUsedFilter(): void {
    setTimeout(() => {
      this.getFilterInput(this.lastFocusedFilter)?.focus();
    });
  }

  private getFilterInput(filter: CustomerFilterKey): HTMLInputElement | undefined {
    switch (filter) {
      case 'name':
        return this.fullNameInput?.nativeElement;
      case 'phone':
        return this.phoneInput?.nativeElement;
      case 'dni':
      default:
        return this.dniInput?.nativeElement;
    }
  }
}
