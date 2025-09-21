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
  ToastModule
} from '@coreui/angular';
import { IconDirective, IconModule } from '@coreui/icons-angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { debounceTime, distinctUntilChanged, filter, map, Observable, of, shareReplay, single } from 'rxjs';
import { Supplier, GetSuppliersRequest } from 'src/app/core/models/supplier';
import { Result } from '../../core/models/result';
import { PagedList } from '../../core/models/shared';
import { SuppliersService } from 'src/app/core/services/suppliers/suppliers.service';
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';

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
export class SuppliersComponent implements OnInit, AfterViewInit {

  private service = inject(SuppliersService);
  private destroyRef = inject(DestroyRef);
  injector = inject(Injector);
  private result$: Observable<Result<PagedList<Supplier>>> = of(Result.empty<PagedList<Supplier>>());
  loading$: Observable<boolean> = of(false);
  error$: Observable<boolean> = of(false);
  empty$: Observable<boolean> = of(false);

  page$: Observable<PagedList<Supplier> | null> = of(null);

  dataSource$: Observable<MatTableDataSource<Supplier>> = of(new MatTableDataSource<Supplier>([]));

  private addResult$: Observable<Result<number>> = of(Result.empty<number>());
  addError$: Observable<string | null> = of(null);
  addSuccess$: Observable<boolean> = of(false);

  private editResult$: Observable<Result<any>> = of(Result.empty<any>());
  editError$: Observable<string | null> = of(null);
  editSuccess$: Observable<boolean> = of(false);

  private deleteResult$: Observable<Result<any>> = of(Result.empty<any>());
  deleteError$: Observable<string | null> = of(null);
  deleteSuccess$: Observable<boolean> = of(false);

  displayedColumns: string[] = ['id', 'contactName', 'companyName', 'contactPhone', 'actions'];

  filtersClicked: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchCompany = new FormControl('');
  searchName = new FormControl('');
  searchPhone = new FormControl('');


  searchForm = new FormGroup({
    company: this.searchCompany,
    name: this.searchName,
    phone: this.searchPhone
  });

  private dialog = inject(MatDialog);

  request: GetSuppliersRequest = {
    pageNumber: 1,
    pageSize: 10,
    sortOrder: "asc",
    orderBy: "id",
    compayName: null,
    contactPhone: null,
    contactName: null
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

    this.searchForm.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      console.log(value);
      this.request.compayName = value.company ? value.company : null;
      this.request.contactName = value.name ? value.name : null;
      this.request.contactPhone = value.phone ? value.phone : null;
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

    this.page$ = this.result$.pipe(
      map(result => result.value as PagedList<Supplier>)
    );

    this.dataSource$ = this.page$.pipe(
      map(page => {
        const ds = new MatTableDataSource<Supplier>(page?.items ?? []);
        ds.paginator = this.paginator;
        ds.sort = this.sort;
        return ds;
      })
    );
  }

  onFiltersClicked(): void {
    this.filtersClicked = !this.filtersClicked;
    if (!this.filtersClicked) {
      this.searchForm.patchValue({name: '', company: '', phone: ''});
    }
  }

  onCreateClick(): void {
    /*
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
    */
  }

  onDeleteClick(supplier: Supplier) {

    /*

    const dialogRef = this.dialog.open(DeleteComponent, {
      data: { supplier: supplier },
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
    */

  }

  onEditClick(supplier: Supplier): void {

    /*
    const dialogRef = this.dialog.open(EditComponent, {
      data: { supplier: supplier },
      disableClose: true
    });

    this.editResult$ = dialogRef.afterClosed().pipe(
      shareReplay(1)
    );

    this.editError$ = this.editResult$.pipe(
      map(r => r.status === 'failure' ? r.failure.message : null)
    );

    this.editSuccess$ = this.editResult$.pipe(
      filter(r => r.status === 'success'),
      map(result => result.status === 'success'),
      takeUntilDestroyed(this.destroyRef)
    );

    this.editSuccess$.subscribe(_ => this.getAll());
    */
  }

  onRetryClick() {
    this.getAll();
  }

}
