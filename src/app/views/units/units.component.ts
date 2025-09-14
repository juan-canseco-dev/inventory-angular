import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, inject, Injector, OnInit, runInInjectionContext, signal, Signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
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
  ToastModule,
} from '@coreui/angular';
import { IconDirective, IconModule } from '@coreui/icons-angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { debounceTime, distinctUntilChanged, filter, map, Observable, of, shareReplay, single } from 'rxjs';
import { Unit, GetUnitsRequest } from '../../core/models/units';
import { Result } from '../../core/models/result';
import { PagedList } from '../../core/models/shared';
import { UnitsService } from 'src/app/core/services/units/units.service';
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
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { EditComponent } from './edit/edit.component';


@Component({
  selector: 'app-units',
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
  templateUrl: './units.component.html',
  styleUrl: './units.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnitsComponent implements OnInit, AfterViewInit {
  private service = inject(UnitsService);
  private destroyRef = inject(DestroyRef);
  injector = inject(Injector);

  private result$: Observable<Result<PagedList<Unit>>> = of(Result.empty<PagedList<Unit>>());
  loading$: Observable<boolean> = of(false);
  error$: Observable<boolean> = of(false);
  empty$: Observable<boolean> = of(false);

  page$: Observable<PagedList<Unit> | null> = of(null);

  dataSource$: Observable<MatTableDataSource<Unit>> = of(new MatTableDataSource<Unit>([]));

  private addResult$: Observable<Result<number>> = of(Result.empty<number>());
  addError$: Observable<string | null> = of(null);
  addSuccess$: Observable<boolean> = of(false);

  private editResult$: Observable<Result<any>> = of(Result.empty<any>());
  editError$: Observable<string | null> = of(null);
  editSuccess$: Observable<boolean> = of(false);

  private deleteResult$: Observable<Result<any>> = of(Result.empty<any>());
  deleteError$: Observable<string | null> = of(null);
  deleteSuccess$: Observable<boolean> = of(false);

  displayedColumns: string[] = ['id', 'name', 'actions'];

  filtersClicked: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchControl = new FormControl('');

  private dialog = inject(MatDialog);

  request: GetUnitsRequest = {
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
      map(result => result.value as PagedList<Unit>)
    );

    this.dataSource$ = this.page$.pipe(
      map(page => {
        const ds = new MatTableDataSource<Unit>(page?.items ?? []);
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

  onDeleteClick(unit: Unit) {

    const dialogRef = this.dialog.open(DeleteComponent, {
      data: { unit: unit },
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

  onEditClick(unit: Unit): void {
    
    const dialogRef = this.dialog.open(EditComponent, {
      data: { unit: unit },
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
  }

  onRetryClick() {
    this.getAll();
  }
}
