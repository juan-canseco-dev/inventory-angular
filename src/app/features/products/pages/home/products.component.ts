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
import { IconModule } from '@coreui/icons-angular';
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
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule, Sort } from '@angular/material/sort';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PermissionCatalog } from '../../../..//core/permissions';
import { PermissionsFacade } from '../../../../core/auth/store';
import { flashError, flashSuccess } from '../../../../shared/utils';
import { AutocompleteFacade, LookupOption } from '../../../../shared/autocomplete';
import { DeleteComponent, DeleteProductDialogResult } from '../../components/delete';
import { GetProductsRequest, Product } from '../../models';
import { ProductsFacade } from '../../store';

type ProductFilterKey = 'name' | 'supplier' | 'category' | 'unit';

@Component({
  selector: 'app-products',
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
    IconModule,
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
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    NgxShimmerLoadingModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit, OnDestroy {
  private readonly facade = inject(ProductsFacade);
  private readonly autocompleteFacade = inject(AutocompleteFacade);
  private readonly permissionsFacade = inject(PermissionsFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('nameInput') private nameInput?: ElementRef<HTMLInputElement>;
  @ViewChild('supplierInput') private supplierInput?: ElementRef<HTMLInputElement>;
  @ViewChild('categoryInput') private categoryInput?: ElementRef<HTMLInputElement>;
  @ViewChild('unitInput') private unitInput?: ElementRef<HTMLInputElement>;

  readonly page = this.facade.page;
  readonly products = this.facade.products;
  readonly loading = this.facade.loading;
  readonly error = this.facade.loadError;
  readonly empty = this.facade.empty;

  readonly addSuccess = signal(false);
  readonly updateSuccess = signal(false);
  readonly deleteSuccess = signal(false);
  readonly actionError = signal<string | null>(null);

  /**
   * The page has been loaded at least once, including empty responses.
   */
  readonly hasLoadedPage = computed(() => !!this.page());

  /**
   * There is already rendered data available.
   * This allows the table to remain visible while refreshing.
   */
  readonly hasRenderedData = computed(() => this.products().length > 0);

  /**
   * Full-page loading only for first load.
   */
  readonly showInitialLoading = computed(() =>
    this.loading() && !this.hasLoadedPage()
  );

  /**
   * Full-page error only when there is no previous data to keep visible.
   */
  readonly showInitialError = computed(() =>
    !!this.error() && !this.hasLoadedPage()
  );

  /**
   * Refreshing state for search, sort, pagination, etc.
   * Keeps the last loaded state visible.
   */
  readonly isRefreshing = computed(() =>
    this.loading() && this.hasLoadedPage()
  );

  /**
   * Table remains visible whenever data exists.
   */
  readonly showContentTable = computed(() => this.hasRenderedData());

  /**
   * Keep the empty state visible while refreshing or after refresh errors.
   */
  readonly showEmptyState = computed(() =>
    this.hasLoadedPage() && !this.hasRenderedData() && !this.showInitialError()
  );

  readonly showRefreshError = computed(() =>
    !!this.error() && this.hasLoadedPage()
  );

  /**
   * Toolbar actions stay visible after the first successful load.
   */
  readonly canShowToolbarActions = computed(() =>
    this.hasLoadedPage()
  );

  readonly hasCreatePermission = computed(() =>
    this.permissionsFacade.hasPermission(PermissionCatalog.Products_Create)
  );
  readonly hasEditPermission = computed(() =>
    this.permissionsFacade.hasPermission(PermissionCatalog.Products_Update)
  );
  readonly hasDeletePermission = computed(() =>
    this.permissionsFacade.hasPermission(PermissionCatalog.Products_Delete)
  );

  readonly supplierOptions = this.autocompleteFacade.supplierOptions;
  readonly supplierOptionsLoading = this.autocompleteFacade.supplierOptionsLoading;
  readonly supplierOptionsError = this.autocompleteFacade.supplierOptionsError;

  readonly categoryOptions = this.autocompleteFacade.categoryOptions;
  readonly categoryOptionsLoading = this.autocompleteFacade.categoryOptionsLoading;
  readonly categoryOptionsError = this.autocompleteFacade.categoryOptionsError;

  readonly unitOptions = this.autocompleteFacade.unitOptions;
  readonly unitOptionsLoading = this.autocompleteFacade.unitOptionsLoading;
  readonly unitOptionsError = this.autocompleteFacade.unitOptionsError;

  readonly searchName = new FormControl('', { nonNullable: true });
  readonly searchSupplier = new FormControl<string | LookupOption>('', { nonNullable: true });
  readonly searchCategory = new FormControl<string | LookupOption>('', { nonNullable: true });
  readonly searchUnit = new FormControl<string | LookupOption>('', { nonNullable: true });

  readonly searchForm = new FormGroup({
    name: this.searchName,
    supplier: this.searchSupplier,
    category: this.searchCategory,
    unit: this.searchUnit
  });

  displayedColumns: string[] = [
    'id',
    'name',
    'supplier',
    'category',
    'unit',
    'stock',
    'purchasePrice',
    'salePrice',
    'actions'
  ];

  filtersClicked = false;
  private lastFocusedFilter: ProductFilterKey = 'name';

  request: GetProductsRequest = {
    pageNumber: 1,
    pageSize: 10,
    sortOrder: 'asc',
    orderBy: 'id',
    name: null,
    supplierId: null,
    categoryId: null,
    unitId: null
  };

  constructor() {
    effect(() => {
      if (
        this.filtersClicked &&
        this.canShowToolbarActions()
      ) {
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
    this.autocompleteFacade.clearCategoryOptions();
    this.autocompleteFacade.clearUnitOptions();
  }

  onPageChange(event: PageEvent): void {
    this.request.pageNumber = event.pageIndex + 1;
    this.request.pageSize = event.pageSize;
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
          supplier: '',
          category: '',
          unit: ''
        },
        { emitEvent: false }
      );

      this.request.name = null;
      this.request.supplierId = null;
      this.request.categoryId = null;
      this.request.unitId = null;
      this.request.pageNumber = 1;

      this.loadPage();
      return;
    }

    this.focusLastUsedFilter();
  }

  onFilterFocus(filter: ProductFilterKey): void {
    this.lastFocusedFilter = filter;
  }

  onCreateClick(): void {
    this.router.navigateByUrl('/products/create');
  }

  onEditClick(product: Product): void {
    this.router.navigate(['/products/edit'], {
      queryParams: { productId: product.id }
    });
  }

  onDetailsClick(product: Product): void {
    this.router.navigate(['/products/details'], {
      queryParams: { productId: product.id }
    });
  }

  onDeleteClick(product: Product): void {
    const dialogRef = this.dialog.open<
      DeleteComponent,
      { product: Product },
      DeleteProductDialogResult | undefined
    >(DeleteComponent, {
      data: { product },
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

  onSupplierFocus(): void {
    this.onFilterFocus('supplier');
    this.loadOptionsFromControl(this.searchSupplier, 'supplier');
  }

  onCategoryFocus(): void {
    this.onFilterFocus('category');
    this.loadOptionsFromControl(this.searchCategory, 'category');
  }

  onUnitFocus(): void {
    this.onFilterFocus('unit');
    this.loadOptionsFromControl(this.searchUnit, 'unit');
  }

  onSupplierSelected(event: MatAutocompleteSelectedEvent): void {
    this.onLookupSelected(event, 'supplier');
  }

  onCategorySelected(event: MatAutocompleteSelectedEvent): void {
    this.onLookupSelected(event, 'category');
  }

  onUnitSelected(event: MatAutocompleteSelectedEvent): void {
    this.onLookupSelected(event, 'unit');
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
      .subscribe(value => {
        const nextRequest: GetProductsRequest = {
          ...this.request,
          pageNumber: 1,
          name: value.name ? value.name : null,
          supplierId: typeof value.supplier === 'string' ? null : this.request.supplierId,
          categoryId: typeof value.category === 'string' ? null : this.request.categoryId,
          unitId: typeof value.unit === 'string' ? null : this.request.unitId
        };

        const hasChanged =
          nextRequest.name !== this.request.name ||
          nextRequest.supplierId !== this.request.supplierId ||
          nextRequest.categoryId !== this.request.categoryId ||
          nextRequest.unitId !== this.request.unitId ||
          nextRequest.pageNumber !== this.request.pageNumber;

        if (!hasChanged) {
          return;
        }

        this.request = nextRequest;
        this.loadPage();
      });

    this.searchSupplier.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(value => {
        if (typeof value !== 'string') {
          return;
        }

        this.request.supplierId = null;
        this.autocompleteFacade.searchSuppliers(value);
      });

    this.searchCategory.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(value => {
        if (typeof value !== 'string') {
          return;
        }

        this.request.categoryId = null;
        this.autocompleteFacade.searchCategories(value);
      });

    this.searchUnit.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(value => {
        if (typeof value !== 'string') {
          return;
        }

        this.request.unitId = null;
        this.autocompleteFacade.searchUnits(value);
      });
  }

  private setStatusToasts(): void {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        this.addSuccess.set(params.get('added') === 'true');
        this.updateSuccess.set(params.get('updated') === 'true');
      });
  }

  private onLookupSelected(
    event: MatAutocompleteSelectedEvent,
    type: 'supplier' | 'category' | 'unit'
  ): void {
    const option = event.option.value as LookupOption;

    switch (type) {
      case 'supplier':
        this.request.supplierId = option.value;
        this.searchSupplier.setValue(option, { emitEvent: false });
        break;
      case 'category':
        this.request.categoryId = option.value;
        this.searchCategory.setValue(option, { emitEvent: false });
        break;
      case 'unit':
        this.request.unitId = option.value;
        this.searchUnit.setValue(option, { emitEvent: false });
        break;
    }

    this.request.pageNumber = 1;
    this.loadPage();
  }

  private loadOptionsFromControl(
    control: FormControl<string | LookupOption>,
    type: 'supplier' | 'category' | 'unit'
  ): void {
    const query = typeof control.value === 'string'
      ? control.value
      : control.value?.label ?? '';

    switch (type) {
      case 'supplier':
        this.autocompleteFacade.loadSupplierOptions(query);
        break;
      case 'category':
        this.autocompleteFacade.loadCategoryOptions(query);
        break;
      case 'unit':
        this.autocompleteFacade.loadUnitOptions(query);
        break;
    }
  }

  private focusLastUsedFilter(): void {
    setTimeout(() => {
      this.getFilterInput(this.lastFocusedFilter)?.focus();
    });
  }

  private getFilterInput(filter: ProductFilterKey): HTMLInputElement | undefined {
    switch (filter) {
      case 'supplier':
        return this.supplierInput?.nativeElement;
      case 'category':
        return this.categoryInput?.nativeElement;
      case 'unit':
        return this.unitInput?.nativeElement;
      case 'name':
      default:
        return this.nameInput?.nativeElement;
    }
  }

  private loadPage(): void {
    this.facade.loadPage({ ...this.request });
  }
}
