import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, inject, Injector, OnInit, runInInjectionContext, signal, Signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  ContainerComponent,
  PageItemDirective,
  PageLinkDirective,
  PaginationComponent,
  RowComponent,
  TableDirective,
  TableModule,
  GridModule,
  InputGroupComponent,
  InputGroupTextDirective,
  FormDirective,
  FormControlDirective,
  ToastModule,
} from '@coreui/angular';
import { IconDirective, IconModule } from '@coreui/icons-angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { debounceTime, distinctUntilChanged, filter, map, Observable, of, shareReplay, single } from 'rxjs';
import { Category, GetCategoriesRequest } from '../../core/models/categories';
import { Result } from '../../core/models/result';
import { PagedList } from '../../core/models/shared';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ModalModule } from '@coreui/angular';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddComponent } from './add/add.component';
import { DeleteComponent } from './delete/delete.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { NgxShimmerLoadingModule } from  'ngx-shimmer-loading';


@Component({
  selector: 'app-categories',
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
    PaginationComponent,
    PageItemDirective,
    PageLinkDirective,
    ButtonDirective,
    ToastModule,
    IconDirective,
    FontAwesomeModule,
    RouterLink,
    ButtonDirective,
    GridModule,
    IconModule,
    CommonModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    InputGroupComponent,
    InputGroupTextDirective,
    FormDirective,
    TableModule,
    FormControlDirective,
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
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesComponent implements OnInit, AfterViewInit {

  private service = inject(CategoriesService);
  private destroyRef = inject(DestroyRef);
  injector = inject(Injector);

  private result$: Observable<Result<PagedList<Category>>> = of(Result.empty<PagedList<Category>>());
  loading$: Observable<boolean> = of(false);
  error$: Observable<boolean> = of(false);
  empty$: Observable<boolean> = of(false);

  page$: Observable<PagedList<Category> | null> = of(null);

  dataSource$: Observable<MatTableDataSource<Category>> = of(new MatTableDataSource<Category>([]));

  private addResult$: Observable<Result<number>> = of(Result.empty<number>());
  addError$: Observable<string | null> = of(null);
  addSuccess$: Observable<boolean> = of(false);

  private deleteResult$: Observable<Result<any>> = of(Result.empty<any>());
  deleteError$: Observable<string | null> = of(null);
  deleteSuccess$: Observable<boolean> = of(false);

  displayedColumns: string[] = ['id', 'name', 'actions'];

  filtersClicked: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchControl = new FormControl('');

  private dialog = inject(MatDialog);

  request: GetCategoriesRequest = {
    pageNumber: 1,
    pageSize: 10,
    sortOrder: "asc",
    orderBy: "id",
    name: null
  };

  constructor() {

  }


  ngOnInit(): void {
    this.getAll();
    this.setFiltering();
  }

  ngAfterViewInit(): void {

  }

  onPageChange(e: PageEvent) {
    this.request.pageNumber = e.pageIndex + 1;
    this.request.pageSize = e.pageSize;
    this.getAll();
  }

  onSortChange(sort: Sort) {
    this.request.orderBy = sort.active;
    this.request.sortOrder = sort.direction || 'asc';
    this.getAll();
  }

  setFiltering() {
    this.searchControl.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.request.name = value ? value : null;
      this.request.pageNumber = 1;
      this.getAll();
    });
  }

  getAll(): void {

    this.result$ = this.service.getAll(this.request).pipe(
      shareReplay(1)
    );

    this.loading$ = this.result$.pipe(
      map(result => result.status === 'loading')
    );

    this.error$ = this.result$.pipe(
      map(result => result.status === 'failure')
    );

    this.empty$ = this.result$.pipe(
      map(result => result.status === 'empty')
    );

    // success will always emit a PagedList<Category>
    this.page$ = this.result$.pipe(
      map(result => result.value as PagedList<Category>)
    );

    this.dataSource$ = this.page$.pipe(
      map(page => {
        const ds = new MatTableDataSource<Category>(page?.items ?? []);
        ds.paginator = this.paginator;
        ds.sort = this.sort;
        return ds;
      })
    );
  }

  onFiltersClicked(): void {
    this.filtersClicked = !this.filtersClicked;
    console.log(this.filtersClicked);
  }

  onCreateClick(): void {
    const dialogRef = this.dialog.open(AddComponent, {
      data: {},
      disableClose: true
    });

    this.addResult$ = dialogRef.afterClosed().pipe(
      shareReplay(1)
    );

    this.addError$ = this.addResult$.pipe(
      map(r => r.status === 'failure' ? r.failure.message : null)
    );

    this.addSuccess$ = this.addResult$.pipe(
      filter(r => r.status === 'success'),
      map(result => result.status === 'success'),
      takeUntilDestroyed(this.destroyRef)
    );

    this.addSuccess$.subscribe(_ => this.getAll());
  }

  onDeleteClick(category: Category) {

    const dialogRef = this.dialog.open(DeleteComponent, {
      data: { category: category },
      disableClose: true
    });

    this.deleteResult$ = dialogRef.afterClosed().pipe(
      shareReplay(1)
    );

    this.deleteError$ = this.deleteResult$.pipe(
      map(r => r.status === 'failure' ? r.failure.message : null)
    );

    this.deleteSuccess$ = this.deleteResult$.pipe(
      filter(r => r.status === 'success'),
      map(result => result.status === 'success'),
      takeUntilDestroyed(this.destroyRef)
    );

    this.deleteSuccess$.subscribe(_ => this.getAll());
  }


  onDetailsClick(categoryId: number): void {

  }

  onEditClick(categoryId: number): void {

  }



  onRetryClick() {
    this.getAll();
  }
}
