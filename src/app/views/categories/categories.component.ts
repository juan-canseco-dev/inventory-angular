import { Component, inject, Injector, OnInit, runInInjectionContext, signal, Signal } from '@angular/core';
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
  FormFeedbackComponent
} from '@coreui/angular';
import { IconDirective, IconModule } from '@coreui/icons-angular';
import { FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Observable, of, single } from 'rxjs';
import { Category, GetCategoriesRequest } from '../../core/models/categories';
import { Result } from '../../core/models/result';
import { PagedList } from '../../core/models/shared';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ModalModule } from '@coreui/angular';
import { toSignal } from '@angular/core/rxjs-interop';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

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
    MatButtonModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {


  private formBuilder = inject(FormBuilder);
  private service = inject(CategoriesService);
  injector = inject(Injector);
  
  private pageResult$: Observable<Result<PagedList<Category>>> = of(Result.empty<PagedList<Category>>());
  pageResult : Signal<Result<PagedList<Category>>> = signal(Result.empty());
  
  private request : GetCategoriesRequest = {
    pageNumber: 1,
    pageSize: 10,
    sortOrder: null,
    orderBy: null,
    name: null
  };
  
  faEye = faEye;
  faEdit = faEdit;
  faTrash = faTrash;


  ngOnInit(): void {
    this.getAll();
  }
  
  
  getAll() : void {
    this.pageResult$ = this.service.getAll(this.request);
    runInInjectionContext(this.injector, () => {
      this.pageResult = toSignal(this.pageResult$, {initialValue: Result.loading<PagedList<Category>>()})
    });
  }
  
  onDetailsClick(categoryId : number) : void {

  }

  onEditClick(categoryId : number) : void {

  }

  onDeleteClick(categoryId : number) {

  }

  onRetryClick() {
    this.getAll();
  }
}
