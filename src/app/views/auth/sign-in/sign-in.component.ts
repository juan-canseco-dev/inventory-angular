import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { 
  ContainerComponent, 
  RowComponent, 
  ColComponent, 
  CardGroupComponent, 
  TextColorDirective, 
  CardComponent, 
  CardBodyComponent, 
  FormDirective, 
  InputGroupComponent, 
  InputGroupTextDirective, 
  FormControlDirective, 
  ButtonDirective,
  FormFeedbackComponent
} from '@coreui/angular';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  imports: [
    ContainerComponent,
    RowComponent, 
    ColComponent, 
    CardGroupComponent, 
    TextColorDirective, 
    CardComponent, 
    CardBodyComponent, 
    FormDirective, 
    InputGroupComponent, 
    InputGroupTextDirective, 
    IconDirective, 
    FormControlDirective, 
    ButtonDirective, 
    NgStyle,
    ReactiveFormsModule,
    FormsModule,
    FormFeedbackComponent
  ]
})
export class SignInComponent {

  customStylesValidated : boolean = true

  onSubmit() {

  }

}
