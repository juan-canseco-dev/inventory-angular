import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  OnInit,
  ViewChild,
  WritableSignal,
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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { debounceTime, distinctUntilChanged, take } from 'rxjs';
import { GetCategoriesRequest, Category } from '../../models';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddComponent } from '../../components/add/add.component';
import { DeleteComponent } from '../../components/delete/delete.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSortModule, Sort } from '@angular/material/sort';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { EditComponent } from '../../components/edit';
import { CategoriesFacade } from '../../store';
import { CategoryDialogResult } from '../../models/category-dialog-result';

@Component({
  selector: 'app-categories',
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
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesComponent implements OnInit {
  private readonly facade = inject(CategoriesFacade);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);

  readonly injector = inject(Injector);

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  readonly page = this.facade.page;
  readonly categories = this.facade.categories;
  readonly loading = this.facade.loading;
  readonly loadError = this.facade.loadError;
  readonly empty = this.facade.empty;

  readonly addError = signal<string | null>(null);
  readonly addSuccess = signal(false);

  readonly editError = signal<string | null>(null);
  readonly editSuccess = signal(false);

  readonly deleteError = signal<string | null>(null);
  readonly deleteSuccess = signal(false);

  displayedColumns: string[] = ['id', 'name', 'actions'];
  filtersClicked = false;

  searchControl = new FormControl('');

  request: GetCategoriesRequest = {
    pageNumber: 1,
    pageSize: 10,
    sortOrder: 'asc',
    orderBy: 'id',
    name: null
  };

  constructor() {
    effect(() => {
      const isLoading = this.loading();
      const hasLoadError = this.loadError();
      const isEmpty = this.empty();

      if (this.filtersClicked && !isLoading && !hasLoadError && !isEmpty) {
        this.focusSearchInput();
      }
    });
  }

  get sortDirection(): 'asc' | 'desc' {
    return this.request.sortOrder === 'desc' ? 'desc' : 'asc';
  }

  get showSuccessState(): boolean {
    return !this.loading() && !this.loadError() && !this.empty();
  }

  get showFiltersAndCreateActions(): boolean {
    return this.showSuccessState || this.empty();
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
      .subscribe((result?: CategoryDialogResult) => {
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

  onDeleteClick(category: Category): void {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: { category },
      disableClose: true,
      injector: this.injector
    });

    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((result?: CategoryDialogResult) => {
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

  onEditClick(category: Category): void {
    const dialogRef = this.dialog.open(EditComponent, {
      data: { category },
      disableClose: true,
      injector: this.injector
    });

    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((result?: CategoryDialogResult) => {
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

  private focusSearchInput(): void {
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
