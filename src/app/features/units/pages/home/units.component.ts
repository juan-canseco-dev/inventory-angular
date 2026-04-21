import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  OnInit,
  ViewChild,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  RowComponent,
  TableDirective,
  TableModule,
  GridModule,
  ToastModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { debounceTime, distinctUntilChanged, take } from 'rxjs';
import { GetUnitsRequest, Unit, UnitDialogResult } from '../../models';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddComponent, EditComponent, DeleteComponent } from '../../components';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSortModule, Sort } from '@angular/material/sort';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { UnitsFacade } from '../../store';
import { flashError, flashSuccess } from '../../../../shared/utils';
import { PermissionsFacade } from 'src/app/core/auth/store';
import { PermissionCatalog } from 'src/app/core/permissions';

@Component({
  selector: 'app-units',
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
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    NgxShimmerLoadingModule
  ],
  templateUrl: './units.component.html',
  styleUrl: './units.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnitsComponent implements OnInit {
  private readonly facade = inject(UnitsFacade);
  private readonly permissionsFacade = inject(PermissionsFacade);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);

  readonly injector = inject(Injector);

  readonly page = this.facade.page;
  readonly units = this.facade.units;
  readonly loading = this.facade.loading;
  readonly loadError = this.facade.loadError;
  readonly empty = this.facade.empty;

  readonly hasLoadedPage = computed(() => !!this.page());
  readonly hasRenderedData = computed(() => this.units().length > 0);
  readonly showInitialLoading = computed(() => this.loading() && !this.hasLoadedPage());
  readonly showInitialError = computed(() => !!this.loadError() && !this.hasLoadedPage());
  readonly isRefreshing = computed(() => this.loading() && this.hasLoadedPage());
  readonly showRefreshError = computed(() => !!this.loadError() && this.hasLoadedPage());

  readonly addError = signal<string | null>(null);
  readonly addSuccess = signal(false);

  readonly editError = signal<string | null>(null);
  readonly editSuccess = signal(false);

  readonly deleteError = signal<string | null>(null);
  readonly deleteSuccess = signal(false);

  readonly hasCreatePermission = computed(() =>
    this.permissionsFacade.hasPermission(PermissionCatalog.Units_Create)
  );

  readonly hasDeletePermission = computed(() =>
    this.permissionsFacade.hasPermission(PermissionCatalog.Units_Delete)
  );

  readonly hasEditPermission = computed(() =>
    this.permissionsFacade.hasPermission(PermissionCatalog.Units_Update)
  );

  readonly success = computed(() =>
    this.hasRenderedData()
  );

  readonly showHeaderActions = computed(() =>
    this.hasLoadedPage()
  );

  readonly showEmptyState = computed(() =>
    this.hasLoadedPage() && !this.hasRenderedData() && !this.showInitialError()
  );

  @ViewChild('searchInput') private searchInput?: ElementRef<HTMLInputElement>;

  displayedColumns: string[] = ['id', 'name', 'actions'];
  filtersClicked = false;

  searchControl = new FormControl('');

  request: GetUnitsRequest = {
    pageNumber: 1,
    pageSize: 10,
    sortOrder: 'asc',
    orderBy: 'id',
    name: null
  };

  constructor() {
    effect(() => {
      if (this.filtersClicked && this.showHeaderActions()) {
        this.focusSearchInput();
      }
    });
  }

  get sortDirection(): 'asc' | 'desc' {
    return this.request.sortOrder === 'desc' ? 'desc' : 'asc';
  }

  ngOnInit(): void {
    this.getAll();
    this.setFiltering();
  }

  onPageChange(e: PageEvent): void {
    this.request.pageNumber = e.pageIndex + 1;
    this.request.pageSize = e.pageSize;
    this.getAll();
  }

  onSortChange(sort: Sort): void {
    this.request.orderBy = sort.active;
    this.request.sortOrder = sort.direction === 'desc' ? 'desc' : 'asc';
    this.getAll();
  }

  setFiltering(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value) => {
        this.request.name = value?.trim() ? value.trim() : null;
        this.request.pageNumber = 1;
        this.getAll();
      });
  }

  getAll(): void {
    this.facade.loadPage({ ...this.request });
  }
  onFiltersClicked(): void {
    this.filtersClicked = !this.filtersClicked;

    if (!this.filtersClicked) {
      this.searchControl.setValue('');
      return;
    }

    this.focusSearchInput();
  }


  onCreateClick(): void {
    const dialogRef = this.dialog.open(AddComponent, {
      data: {},
      disableClose: true,
      injector: this.injector
    });

    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((result?: UnitDialogResult) => {
        if (!result) return;

        if (result.success) {
          flashSuccess(this.addSuccess);
          return;
        }

        if (result.error) {
          flashError(this.addError, result.error);
        }
      });
  }

  onDeleteClick(unit: Unit): void {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: { unit },
      disableClose: true,
      injector: this.injector
    });

    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((result?: UnitDialogResult) => {
        if (!result) return;

        if (result.success) {
          flashSuccess(this.deleteSuccess);
          return;
        }

        if (result.error) {
          flashError(this.deleteError, result.error);
        }
      });
  }

  onEditClick(unit: Unit): void {
    const dialogRef = this.dialog.open(EditComponent, {
      data: { unit },
      disableClose: true,
      injector: this.injector
    });

    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((result?: UnitDialogResult) => {
        if (!result) return;

        if (result.success) {
          flashSuccess(this.editSuccess);
          return;
        }

        if (result.error) {
          flashError(this.editError, result.error);
        }
      });
  }

  onRetryClick(): void {
    this.getAll();
  }

  private focusSearchInput(): void {
    setTimeout(() => {
      this.searchInput?.nativeElement.focus();
    });
  }
}
