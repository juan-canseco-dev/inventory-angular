import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild
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
import { Supplier, GetSuppliersRequest } from '../../models';
import { SuppliersFecade } from '../../store';
import {
  DeleteComponent,
  DeleteSupplierDialogResult
} from '../../components/delete';

type SupplierFilterKey = 'company' | 'name' | 'phone';

@Component({
  selector: 'app-suppliers',
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
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuppliersComponent implements OnInit {
  private readonly facade = inject(SuppliersFecade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('companyInput') private companyInput?: ElementRef<HTMLInputElement>;
  @ViewChild('nameInput') private nameInput?: ElementRef<HTMLInputElement>;
  @ViewChild('phoneInput') private phoneInput?: ElementRef<HTMLInputElement>;

  readonly page = this.facade.page;
  readonly suppliers = this.facade.suppliers;
  readonly loading = this.facade.loading;
  readonly error = this.facade.loadError;
  readonly empty = this.facade.empty;

  readonly isSuccess = computed(() => !this.loading() && !this.error() && !this.empty());
  readonly canShowToolbarActions = computed(() => this.isSuccess() || this.empty());

  readonly addSuccess = signal(false);
  readonly updateSuccess = signal(false);
  readonly deleteSuccess = signal(false);
  readonly actionError = signal<string | null>(null);

  displayedColumns: string[] = ['id', 'companyName', 'contactName' ,'contactPhone', 'actions'];

  filtersClicked = false;
  private lastFocusedFilter: SupplierFilterKey = 'company';

  searchCompany = new FormControl('');
  searchName = new FormControl('');
  searchPhone = new FormControl('');

  searchForm = new FormGroup({
    company: this.searchCompany,
    name: this.searchName,
    phone: this.searchPhone
  });

  request: GetSuppliersRequest = {
    pageNumber: 1,
    pageSize: 10,
    sortOrder: 'asc',
    orderBy: 'id',
    compayName: null,
    contactPhone: null,
    contactName: null
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
          name: '',
          company: '',
          phone: ''
        },
        { emitEvent: true }
      );
      return;
    }

    this.focusLastUsedFilter();
  }

  onFilterFocus(filter: SupplierFilterKey): void {
    this.lastFocusedFilter = filter;
  }

  onCreateClick(): void {
    this.router.navigateByUrl('/suppliers/create');
  }

  onEditClick(supplier: Supplier): void {
    this.router.navigate(['/suppliers/edit'], {
      queryParams: { supplierId: supplier.id }
    });
  }

  onDetailsClick(supplier: Supplier): void {
    this.router.navigate(['/suppliers/details'], {
      queryParams: { supplierId: supplier.id }
    });
  }

  onDeleteClick(supplier: Supplier): void {
    const dialogRef = this.dialog.open<
      DeleteComponent,
      { supplier: Supplier },
      DeleteSupplierDialogResult | undefined
    >(DeleteComponent, {
      data: { supplier },
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (!result) return;

        if (result.success) {
          this.deleteSuccess.set(true);
          this.actionError.set(null);
          return;
        }

        if (result.error) {
          this.actionError.set(result.error);
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
        this.request.compayName = value.company ? value.company : null;
        this.request.contactName = value.name ? value.name : null;
        this.request.contactPhone = value.phone ? value.phone : null;
        this.request.pageNumber = 1;
        this.loadPage();
      });
  }

  private focusLastUsedFilter(): void {
    setTimeout(() => {
      this.getFilterInput(this.lastFocusedFilter)?.focus();
    });
  }

  private getFilterInput(filter: SupplierFilterKey): HTMLInputElement | undefined {
    switch (filter) {
      case 'name':
        return this.nameInput?.nativeElement;
      case 'phone':
        return this.phoneInput?.nativeElement;
      case 'company':
      default:
        return this.companyInput?.nativeElement;
    }
  }
}
