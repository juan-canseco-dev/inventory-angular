import { Component, inject, Injector, OnInit, runInInjectionContext, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from '@coreui/angular';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CategoriesService } from 'src/app/core/services/categories/categories.service';
import { IconDirective, IconModule } from '@coreui/icons-angular';
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


@Component({
  selector: 'app-categories-add',
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
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent {
  
  private formBuilder = inject(FormBuilder);
  private service = inject(CategoriesService);
  injector = inject(Injector);

  
  

}
