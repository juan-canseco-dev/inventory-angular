import { Component, OnInit, inject, Injector, runInInjectionContext} from '@angular/core';
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
import { map, Observable, of, shareReplay, startWith } from 'rxjs';
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

  private result$: Observable<Result<JwtResponse>> = of(Result.empty<JwtResponse>());
  loading$: Observable<boolean> = of(false);
  error$: Observable<string | null> = of(null);

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

      this.result$ = this.authService.signIn({email, password}).pipe(
        shareReplay(1)
      );

      this.loading$ = this.result$.pipe(
        map(r => r.status === 'loading'),
        startWith(false)
      );

      this.error$ = this.result$.pipe(
        map(r => r.status === 'failure' ? r.failure.message  : null)
      );

    } else {
      this.signInForm.markAllAsTouched();
    }
  }
}
