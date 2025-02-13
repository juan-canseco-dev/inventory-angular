import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgStyle } from '@angular/common';
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
  FormFeedbackComponent,
  AlertComponent,
  SpinnerModule,
  ToastModule
} from '@coreui/angular';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Observable } from 'rxjs';
import { Result} from '../../../core/models/result';
import { JwtResponse } from '../../../core/models/auth';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  imports: [
    CommonModule,
    SpinnerModule,
    ContainerComponent,
    RowComponent, 
    ColComponent,
    AlertComponent,
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
    ToastModule,
    FormFeedbackComponent
  ]
})
export class SignInComponent implements OnInit {

  signInForm!: FormGroup;

  authResult$!: Observable<Result<JwtResponse>>;

  constructor(private formBuilder : FormBuilder, private authService : AuthService) {}
  
  ngOnInit(): void {
    this.signInForm = this.formBuilder.group({
      email: [null, {
        validators: [
          Validators.required,
          Validators.email,
          Validators.maxLength(50)
        ]
      }],
      password: [null, {
        validators: [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30)
        ]
      }]
    });
  }

  get email() {
    return this.signInForm.get('email')!;
  }

  get password() {
    return this.signInForm.get('password')!;
  }

  onSubmit() {
    if (this.signInForm.valid) {
      const { email, password } = this.signInForm.value;
      this.authResult$ = this.authService.signIn({email, password});

    } else {
      this.signInForm.markAllAsTouched();
    }
  }
}
