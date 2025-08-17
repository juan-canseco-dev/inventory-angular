import { Component, OnInit, inject, signal, computed, Signal, Injector, runInInjectionContext} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
import { Observable, of } from 'rxjs';
import { Result} from '../../../core/models/result';
import { JwtResponse, SignInRequest } from '../../../core/models/auth';

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
  
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  injector = inject(Injector);

  private result$: Observable<Result<JwtResponse>> = of(Result.empty<JwtResponse>())
  
  result : Signal<Result<JwtResponse>> = signal(Result.empty());
  isComplete: Signal<boolean> = signal(false);

  completed = computed(() => {
    if (this.isComplete()) {
      console.log("completed success or failure");
    }
    return this.isComplete();
  });

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
      this.result$ = this.authService.signIn({email, password});
      runInInjectionContext(this.injector, () => {
        this.result = toSignal(this.result$, { initialValue: Result.loading<JwtResponse>() });
      });

    } else {
      this.signInForm.markAllAsTouched();
    }
  }
}
