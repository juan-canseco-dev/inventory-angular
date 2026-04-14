import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  OnInit,
  ViewChild,
  WritableSignal,
  computed,
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
export class UnitsComponent implements OnInit, AfterViewChecked {
  private readonly facade = inject(UnitsFacade);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);

  readonly injector = inject(Injector);

  readonly page = this.facade.page;
  readonly units = this.facade.units;
  readonly loading = this.facade.loading;
  readonly loadError = this.facade.loadError;
  readonly empty = this.facade.empty;

  readonly addError = signal<string | null>(null);
  readonly addSuccess = signal(false);

  readonly editError = signal<string | null>(null);
  readonly editSuccess = signal(false);

  readonly deleteError = signal<string | null>(null);
  readonly deleteSuccess = signal(false);

  readonly success = computed(() =>
    !!this.page() && !this.loading() && !this.loadError() && !this.empty()
  );

  readonly showHeaderActions = computed(() =>
    this.success() || this.empty()
  );

  @ViewChild('searchInput') private searchInput?: ElementRef<HTMLInputElement>;

  displayedColumns: string[] = ['id', 'name', 'actions'];
  filtersClicked = false;

  searchControl = new FormControl('');
  private shouldFocusSearch = false;

  request: GetUnitsRequest = {
    pageNumber: 1,
    pageSize: 10,
    sortOrder: 'asc',
    orderBy: 'id',
    name: null
  };

  get sortDirection(): 'asc' | 'desc' {
    return this.request.sortOrder === 'desc' ? 'desc' : 'asc';
  }

  ngOnInit(): void {
    this.getAll();
    this.setFiltering();
  }

  ngAfterViewChecked(): void {
    if (this.shouldFocusSearch && this.filtersClicked && this.success()) {
      this.shouldFocusSearch = false;
      this.focusSearchControl();
    }
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
    this.shouldFocusSearch = this.filtersClicked;
    this.facade.loadPage({ ...this.request });
  }

  onFiltersClicked(): void {
    this.filtersClicked = !this.filtersClicked;

    if (this.filtersClicked) {
      this.shouldFocusSearch = true;

      if (this.showHeaderActions()) {
        this.focusSearchControl();
      }

      return;
    }

    this.shouldFocusSearch = false;
    this.searchControl.setValue('');
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
          this.flashSuccess(this.addSuccess);
          return;
        }

        if (result.error) {
          this.flashError(this.addError, result.error);
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
          this.flashSuccess(this.deleteSuccess);
          return;
        }

        if (result.error) {
          this.flashError(this.deleteError, result.error);
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
          this.flashSuccess(this.editSuccess);
          return;
        }

        if (result.error) {
          this.flashError(this.editError, result.error);
        }
      });
  }

  onRetryClick(): void {
    this.getAll();
  }

  private focusSearchControl(): void {
    setTimeout(() => {
      this.searchInput?.nativeElement.focus();
    });
  }

  private flashSuccess(target: WritableSignal<boolean>, durationMs = 2000): void {
    target.set(true);
    setTimeout(() => target.set(false), durationMs);
  }

  private flashError(target: WritableSignal<string | null>, message: string, durationMs = 2000): void {
    target.set(message);
    setTimeout(() => target.set(null), durationMs);
  }
}
