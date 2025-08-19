import { Component, inject, Injector, OnInit, runInInjectionContext, signal, Signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  FormFeedbackComponent,
  CardModule
} from '@coreui/angular';
import { IconDirective, IconModule } from '@coreui/icons-angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEdit, faTrash, faL } from '@fortawesome/free-solid-svg-icons';
import { map, Observable, of, shareReplay, single } from 'rxjs';
import { Category, GetCategoriesRequest } from '../../core/models/categories';
import { Result } from '../../core/models/result';
import { PagedList } from '../../core/models/shared';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ModalModule } from '@coreui/angular';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { AddComponent } from './add/add.component';


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
    IconDirective,
    FontAwesomeModule,
    RouterLink,
    ButtonDirective,
    GridModule,
    IconModule,
    CommonModule,
    NgxSkeletonLoaderModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    InputGroupComponent,
    InputGroupTextDirective,
    FormDirective,
    FormControlDirective,
    FormFeedbackComponent,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {

  private service = inject(CategoriesService);
  injector = inject(Injector);

  private result$: Observable<Result<PagedList<Category>>> = of(Result.empty<PagedList<Category> >());
  loading$ : Observable<boolean> = of(false);
  error$: Observable<boolean> = of(false);
  empty$: Observable<boolean> = of(false);
  page$: Observable<PagedList<Category> | null> = of(null);
  dataSource$ : Observable<MatTableDataSource<Category>> = of(new MatTableDataSource<Category>([]));

  displayedColumns: string[] = ['id', 'name', 'actions'];

  filtersClicked : boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator
  
  
  private dialog  = inject(MatDialog);

  private request: GetCategoriesRequest = {
    pageNumber: 1,
    pageSize: 10,
    sortOrder: null,
    orderBy: null,
    name: null
  };

  faEye = faEye;
  faEdit = faEdit;
  faTrash = faTrash;



  constructor () {
    
  }


  ngOnInit(): void {
    this.getAll();
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
      map(page => new MatTableDataSource<Category>(page?.items ?? []))
    );
  }

  onFiltersClicked() : void {
    this.filtersClicked = !this.filtersClicked;
    console.log(this.filtersClicked);
  }

  onCreateClick() : void {
    const dialogRef = this.dialog.open(AddComponent, {
      data: {},
      disableClose: true
    });
  }

  onDetailsClick(categoryId: number): void {

  }

  onEditClick(categoryId: number): void {

  }

  onDeleteClick(categoryId: number) {

  }

  onRetryClick() {
    this.getAll();
  }
}
