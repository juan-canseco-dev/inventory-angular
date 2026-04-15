import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  GridModule,
  RowComponent,
  ToastModule
} from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent
} from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AutocompleteFacade, LookupOption } from '../../../../shared/autocomplete';
import {
  PermissionCatalog,
  PermissionDefinition
} from '../../../../core/permissions';
import { RolesFecade } from '../../../roles/store';
import { CreateUserRequest } from '../../models';
import { UsersFacade } from '../../store';

@Component({
  selector: 'app-add-user',
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    CardFooterComponent,
    ToastModule,
    FontAwesomeModule,
    GridModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    NgxShimmerLoadingModule
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddComponent {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(UsersFacade);
  private readonly autocompleteFacade = inject(AutocompleteFacade);
  private readonly rolesFacade = inject(RolesFecade);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly createLoading = this.facade.createLoading;
  readonly createSuccess = this.facade.createSuccess;
  readonly createError = this.facade.createError;

  readonly roleOptions = this.autocompleteFacade.roleOptions;
  readonly roleOptionsLoading = this.autocompleteFacade.roleOptionsLoading;
  readonly roleOptionsError = this.autocompleteFacade.roleOptionsError;
  readonly permissionGroups = this.rolesFacade.permissionGroups;
  readonly permissionGroupsLoading = this.rolesFacade.permissionGroupsLoading;
  readonly permissionGroupsError = this.rolesFacade.permissionGroupsError;
  readonly roleDetails = this.rolesFacade.roleDetails;
  readonly roleDetailsLoading = this.rolesFacade.roleDetailsLoading;
  readonly roleDetailsError = this.rolesFacade.roleDetailsError;
  readonly hidePassword = new FormControl(true, { nonNullable: true });

  readonly userForm = this.fb.group({
    fullName: this.fb.control<string | null>(null, [Validators.required, Validators.maxLength(50)]),
    email: this.fb.control<string | null>(null, [Validators.required, Validators.email, Validators.maxLength(100)]),
    password: this.fb.control<string | null>(null, [Validators.required, Validators.minLength(6), Validators.maxLength(100)]),
    roleId: this.fb.control<number | null>(null, [Validators.required])
  });

  readonly roleSearch = new FormControl<string | LookupOption>('', { nonNullable: true });

  constructor() {
    this.facade.resetCreateState();
    this.autocompleteFacade.clearRoleOptions();
    this.rolesFacade.resetRoleDetailsState();
    this.rolesFacade.resetPermissionGroupsState();
    this.autocompleteFacade.loadRoleOptions('');
    this.rolesFacade.loadPermissionGroups();
    this.setRoleAutocomplete();

    effect(() => {
      if (this.createSuccess()) {
        this.facade.resetCreateState();
        this.router.navigate(['/users'], {
          queryParams: { added: true }
        });
      }
    });

    this.destroyRef.onDestroy(() => {
      this.facade.resetCreateState();
      this.autocompleteFacade.clearRoleOptions();
      this.rolesFacade.resetRoleDetailsState();
      this.rolesFacade.resetPermissionGroupsState();
    });
  }

  onSaveClick(): void {
    this.roleId.markAsTouched();

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.facade.createUser(this.toCreateRequest());
  }

  onRoleFocus(): void {
    const query = typeof this.roleSearch.value === 'string'
      ? this.roleSearch.value
      : this.roleSearch.value?.label ?? '';

    this.autocompleteFacade.loadRoleOptions(query);
  }

  onRoleSelected(event: MatAutocompleteSelectedEvent): void {
    const option = event.option.value as LookupOption;
    this.roleId.setValue(option.value);
    this.roleSearch.setValue(option, { emitEvent: false });
    this.roleId.markAsTouched();
    this.rolesFacade.loadRoleDetails(option.value);
  }

  retryRolePermissions(): void {
    this.rolesFacade.loadPermissionGroups();

    if (this.roleId.value) {
      this.rolesFacade.loadRoleDetails(this.roleId.value);
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword.setValue(!this.hidePassword.value);
  }

  displayLookupOption(value: string | LookupOption | null): string {
    if (!value) return '';
    return typeof value === 'string' ? value : value.label;
  }

  private setRoleAutocomplete(): void {
    this.roleSearch.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(value => {
        if (typeof value !== 'string') {
          return;
        }

        this.roleId.setValue(null);
        this.rolesFacade.resetRoleDetailsState();
        this.autocompleteFacade.searchRoles(value);
      });
  }

  private toCreateRequest(): CreateUserRequest {
    const raw = this.userForm.getRawValue();

    return {
      fullName: raw.fullName!,
      email: raw.email!,
      password: raw.password!,
      roleId: raw.roleId!
    };
  }

  get fullName() {
    return this.userForm.get('fullName') as FormControl;
  }

  get email() {
    return this.userForm.get('email') as FormControl;
  }

  get password() {
    return this.userForm.get('password') as FormControl;
  }

  get roleId() {
    return this.userForm.get('roleId') as FormControl;
  }

  hasPermission(permission: PermissionDefinition): boolean {
    return (this.roleDetails()?.permissions ?? []).includes(
      PermissionCatalog.permissionOf(permission.resource, permission.action)
    );
  }
}
