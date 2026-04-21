import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  WritableSignal,
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
import { GetUsersRequest, User } from '../../models';
import { DeleteComponent, DeleteUserDialogResult } from '../../components/delete';
import { UsersFacade } from '../../store';
import { PermissionsFacade } from 'src/app/core/auth/store';
import { PermissionCatalog } from 'src/app/core/permissions';

type UserFilterKey = 'fullName' | 'email';

@Component({
  selector: 'app-users',
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
    MatCardModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    NgxShimmerLoadingModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {
  private readonly facade = inject(UsersFacade);
  private readonly permissionsFacade = inject(PermissionsFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('fullNameInput') private fullNameInput?: ElementRef<HTMLInputElement>;
  @ViewChild('emailInput') private emailInput?: ElementRef<HTMLInputElement>;

  readonly page = this.facade.page;
  readonly users = this.facade.users;
  readonly loading = this.facade.loading;
  readonly error = this.facade.loadError;
  readonly empty = this.facade.empty;

  readonly hasLoadedPage = computed(() => !!this.page());
  readonly hasRenderedData = computed(() => this.users().length > 0);
  readonly isSuccess = computed(() => this.hasRenderedData());
  readonly showInitialLoading = computed(() => this.loading() && !this.hasLoadedPage());
  readonly showInitialError = computed(() => !!this.error() && !this.hasLoadedPage());
  readonly isRefreshing = computed(() => this.loading() && this.hasLoadedPage());
  readonly showEmptyState = computed(() =>
    this.hasLoadedPage() && !this.hasRenderedData() && !this.showInitialError()
  );
  readonly showRefreshError = computed(() => !!this.error() && this.hasLoadedPage());
  readonly canShowToolbarActions = computed(() => this.hasLoadedPage());

  readonly addSuccess = signal(false);
  readonly updateSuccess = signal(false);
  readonly deleteSuccess = signal(false);
  readonly actionError = signal<string | null>(null);

  readonly hasCreatePermission = computed(() =>
    this.permissionsFacade.hasPermission(PermissionCatalog.Users_Create)
  );
  readonly hasEditPermission = computed(() =>
    this.permissionsFacade.hasPermission(PermissionCatalog.Users_Update)
  );
  readonly hasDeletePermission = computed(() =>
    this.permissionsFacade.hasPermission(PermissionCatalog.Users_Delete)
  );

  displayedColumns: string[] = ['id', 'fullName', 'email', 'role', 'actions'];

  filtersClicked = false;
  private lastFocusedFilter: UserFilterKey = 'fullName';

  searchFullName = new FormControl('');
  searchEmail = new FormControl('');

  searchForm = new FormGroup({
    fullName: this.searchFullName,
    email: this.searchEmail
  });

  request: GetUsersRequest = {
    pageNumber: 1,
    pageSize: 10,
    sortOrder: 'asc',
    orderBy: 'id',
    fullName: null,
    email: null
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
          fullName: '',
          email: ''
        },
        { emitEvent: true }
      );
      return;
    }

    this.focusLastUsedFilter();
  }

  onFilterFocus(filter: UserFilterKey): void {
    this.lastFocusedFilter = filter;
  }

  onCreateClick(): void {
    this.router.navigateByUrl('/users/create');
  }

  onEditClick(user: User): void {
    this.router.navigate(['/users/edit'], {
      queryParams: { userId: user.id }
    });
  }

  onDetailsClick(user: User): void {
    this.router.navigate(['/users/details'], {
      queryParams: { userId: user.id }
    });
  }

  onDeleteClick(user: User): void {
    const dialogRef = this.dialog.open<
      DeleteComponent,
      { user: User },
      DeleteUserDialogResult | undefined
    >(DeleteComponent, {
      data: { user },
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (!result) return;

        if (result.success) {
          this.flashSuccess(this.deleteSuccess);
          this.actionError.set(null);
          return;
        }

        if (result.error) {
          this.flashError(this.actionError, result.error);
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
        this.request.fullName = value.fullName ? value.fullName : null;
        this.request.email = value.email ? value.email : null;
        this.request.pageNumber = 1;
        this.loadPage();
      });
  }

  private focusLastUsedFilter(): void {
    setTimeout(() => {
      this.getFilterInput(this.lastFocusedFilter)?.focus();
    });
  }

  private getFilterInput(filter: UserFilterKey): HTMLInputElement | undefined {
    switch (filter) {
      case 'email':
        return this.emailInput?.nativeElement;
      case 'fullName':
      default:
        return this.fullNameInput?.nativeElement;
    }
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
