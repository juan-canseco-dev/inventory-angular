import { selectAuthError, selectAuthIsLoading } from '../../../../core/auth/store/auth.selector';
import { Component, OnInit, inject, computed} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../../core/auth/store';

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
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    FormFeedbackComponent
  ]
})
export class SignInComponent implements OnInit {

  signInForm!: FormGroup;

  private formBuilder = inject(FormBuilder);
  private store = inject(Store);

  readonly loading = this.store.selectSignal(selectAuthIsLoading);
  readonly error = this.store.selectSignal(selectAuthError);

  readonly showError = computed(() => !!this.error());


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
      this.store.dispatch(AuthActions.signIn({request: { email, password}}));
    } else {
      this.signInForm.markAllAsTouched();
    }
  }
}
