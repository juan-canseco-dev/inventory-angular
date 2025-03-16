import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {ButtonDirective, CardBodyComponent, CardComponent, CardFooterComponent, CardHeaderComponent, ColComponent, ContainerComponent, PageItemDirective, PageLinkDirective, PaginationComponent, RowComponent, TableDirective, TableModule, GridModule} from '@coreui/angular';
import { IconDirective, IconModule } from '@coreui/icons-angular';
import { FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { Category, GetCategoriesRequest } from '../../core/models/categories';
import { Result } from '../../core/models/result';
import { PagedList } from '../../core/models/shared';
import { CategoriesService } from '../../core/services/categories/categories.service';

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
    CommonModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  

  pageResult$!: Observable<Result<PagedList<Category>>>;

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

  constructor(private service : CategoriesService) {}

  ngOnInit(): void {
    this.pageResult$ = this.service.getAll(this.request);
  }
  

  onDetailsClick(categoryId : number) : void {

  }

  onEditClick(categoryId : number) : void {

  }

  onDeleteClick(categoryId : number) {

  }

}
