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


  private formBuilder = inject(FormBuilder);
  private service = inject(CategoriesService);
  injector = inject(Injector);

  addForm!: FormGroup;
  
  private pageResult$: Observable<Result<PagedList<Category>>> = of(Result.empty<PagedList<Category>>());
  pageResult : Signal<Result<PagedList<Category>>> = signal(Result.empty());

  private addResult$: Observable<Result<number>> = of(Result.empty<number>());
  addResult : Signal<Result<number>> = signal(Result.empty());


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
    this.addForm = this.formBuilder.group({
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

  addSubmit() {
    if(this.addForm.valid) {
      this.addResult$ = this.service.create(this.addForm.value);
      runInInjectionContext(this.injector, () => {
        this.addResult = toSignal(this.addResult$, {initialValue: Result.loading<number>()})
      });
    }
    else {
      this.addForm.markAllAsTouched();
    }
  }
  
  addCancel() {
    this.add_name?.setValue(null);
    this.addForm.markAsPristine();
    this.addForm.markAsUntouched();
  }

  get add_name() {
    return this.addForm.get('name');
  }
}
