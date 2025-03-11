import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {ButtonDirective, CardBodyComponent, CardComponent, CardFooterComponent, CardHeaderComponent, ColComponent, ContainerComponent, PageItemDirective, PageLinkDirective, PaginationComponent, RowComponent, TableDirective, TableModule} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

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
    ButtonDirective
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  
  faEye = faEye;
  faEdit = faEdit;
  faTrash = faTrash;



  onDetailsClick(categoryId : number) : void {

  }

  onEditClick(categoryId : number) : void {

  }

  onDeleteClick(categoryId : number) {

  }

}
