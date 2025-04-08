import { Component, OnInit } from '@angular/core';
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
import { Observable } from 'rxjs';
import { Category, GetCategoriesRequest } from '../../core/models/categories';
import { Result } from '../../core/models/result';
import { PagedList } from '../../core/models/shared';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ModalModule } from '@coreui/angular';

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
    FormFeedbackComponent
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  

  addCategoryForm!: FormGroup;
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

  constructor(private formBuilder: FormBuilder, private service : CategoriesService) {}


  ngOnInit(): void {
    this.addCategoryForm = this.formBuilder.group({
      name: [null,{
        validators: [
          Validators.required,
          Validators.maxLength(50)
        ]
      }]
    });
    this.getAll();
  }
  
  
  getAll() : void {
    this.pageResult$ = this.service.getAll(this.request);
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

  addCategorySubmit() {
    if(this.addCategoryForm.valid) {
      console.log('valid');
    }
    else {
      this.addCategoryForm.markAllAsTouched();
    }
  }

  addCategoryCancel() {
    this.add_name?.setValue(null);
    this.addCategoryForm.markAsPristine();
    this.addCategoryForm.markAsUntouched();
  }

  get add_name() {
    return this.addCategoryForm.get('name');
  }
}
