import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
  OnInit,
  inject,
  signal,
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
import { GetRolesRequest, Role } from '../../models';
import { RolesFecade } from '../../store';
import {
  DeleteComponent,
  DeleteRoleDialogResult
} from '../../components/delete';

@Component({
  selector: 'app-roles',
  standalone: true,
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
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesComponent implements OnInit {

  private readonly fecade = inject(RolesFecade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  readonly page = this.fecade.page;
  readonly roles = this.fecade.roles;
  readonly loading = this.fecade.loading;
  readonly error = this.fecade.loadError;
  readonly empty = this.fecade.empty;

  readonly addSuccess = signal(false);
  readonly updateSuccess = signal(false);
  readonly deleteSuccess = signal(false);
  readonly actionError = signal<string | null>(null);

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;


  displayedColumns: string[] = ['id', 'name', 'createdAt', 'updatedAt', 'actions'];

  filtersClicked = false;
  searchName = new FormControl('');
  searchForm = new FormGroup({
    name: this.searchName
  });

  request: GetRolesRequest = {
    pageNumber: 1,
    pageSize: 10,
    sortOrder: 'asc',
    orderBy: 'id',
    name: null
  };

  constructor() {
    effect(() => {
      const isLoading = this.loading;
      const hasLoadError = this.error;
      const isEmpty = this.empty;

      if (this.filtersClicked && !isLoading && !hasLoadError) {
        this.focusSearchInput();
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
          name: ''
        },
        { emitEvent: true }
      );
      return;
    }

    this.focusSearchInput();
  }

  onCreateClick(): void {
    this.router.navigateByUrl('/roles/create');
  }

  onEditClick(role: Role): void {
    this.router.navigate(['/roles/edit'], {
      queryParams: { roleId: role.id }
    });
  }

  onDetailsClick(role: Role): void {
    this.router.navigate(['/roles/details'], {
      queryParams: { roleId: role.id }
    });
  }

  onDeleteClick(role: Role): void {
    const dialogRef = this.dialog.open<
      DeleteComponent,
      { role: Role },
      DeleteRoleDialogResult | undefined
    >(DeleteComponent, {
      data: { role },
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
    this.fecade.loadPage({ ...this.request });
  }

  private focusSearchInput(): void {
    setTimeout(() => {
      this.searchInput?.nativeElement.focus();
    });
  }

  private setFiltering(): void {
    this.searchForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.request.name = value.name ? value.name : null;
        this.request.pageNumber = 1;
        this.loadPage();
      });
  }
}
