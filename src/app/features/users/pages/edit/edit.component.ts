import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ButtonDirective,
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
  ChangeUserRoleRequest,
  UpdateUserRequest,
  UserWithDetails
} from '../../models';
import { UsersFacade } from '../../store';

@Component({
  selector: 'app-edit-user',
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    CardFooterComponent,
    ToastModule,
    ButtonDirective,
    FontAwesomeModule,
    GridModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    NgxShimmerLoadingModule
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditComponent {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(UsersFacade);
  private readonly autocompleteFacade = inject(AutocompleteFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private readonly userId = Number(this.route.snapshot.queryParamMap.get('userId'));
  private pendingRoleChangeRequest: ChangeUserRoleRequest | null = null;

  readonly details = this.facade.userDetails;
  readonly detailsLoading = this.facade.userDetailsLoading;
  readonly detailsError = this.facade.userDetailsError;

  readonly updateLoading = this.facade.updateLoading;
  readonly updateSuccess = this.facade.updateSuccess;
  readonly updateError = this.facade.updateError;

  readonly changeRoleLoading = this.facade.changeRoleLoading;
  readonly changeRoleSuccess = this.facade.changeRoleSuccess;
  readonly changeRoleError = this.facade.changeRoleError;

  readonly roleOptions = this.autocompleteFacade.roleOptions;
  readonly roleOptionsLoading = this.autocompleteFacade.roleOptionsLoading;
  readonly roleOptionsError = this.autocompleteFacade.roleOptionsError;

  readonly userForm = this.fb.group({
    id: this.fb.control<number | null>({ value: null, disabled: true }, [Validators.required]),
    fullName: this.fb.control<string | null>(null, [Validators.required, Validators.maxLength(50)]),
    email: this.fb.control<string | null>({ value: null, disabled: true }, [Validators.required, Validators.email, Validators.maxLength(100)]),
    roleId: this.fb.control<number | null>(null, [Validators.required])
  });

  readonly roleSearch = new FormControl<string | LookupOption>('', { nonNullable: true });

  constructor() {
    this.facade.resetUserDetailsState();
    this.facade.resetUpdateState();
    this.facade.resetChangeRoleState();
    this.autocompleteFacade.clearRoleOptions();
    this.loadDependencies();
    this.setRoleAutocomplete();

    effect(() => {
      const details = this.details();
      if (!details) return;

      this.patchForm(details);
    });

    effect(() => {
      if (!this.updateSuccess()) return;

      this.facade.resetUpdateState();

      if (this.pendingRoleChangeRequest) {
        const request = this.pendingRoleChangeRequest;
        this.pendingRoleChangeRequest = null;
        this.facade.changeUserRole(request);
        return;
      }

      this.navigateToList();
    });

    effect(() => {
      if (!this.changeRoleSuccess()) return;

      this.facade.resetChangeRoleState();
      this.navigateToList();
    });

    this.destroyRef.onDestroy(() => {
      this.facade.resetUserDetailsState();
      this.facade.resetUpdateState();
      this.facade.resetChangeRoleState();
      this.autocompleteFacade.clearRoleOptions();
    });
  }

  onSaveClick(): void {
    const details = this.details();
    if (!details) return;

    this.roleId.markAsTouched();

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const updateRequest = this.toUpdateRequest();
    const roleRequest = this.toRoleRequest();

    const hasNameChange = updateRequest.fullName !== details.fullName;
    const hasRoleChange = roleRequest.roleId !== details.role.id;

    if (!hasNameChange && !hasRoleChange) {
      this.navigateToList();
      return;
    }

    this.pendingRoleChangeRequest = hasNameChange && hasRoleChange ? roleRequest : null;

    if (hasNameChange) {
      this.facade.updateUser(updateRequest);
      return;
    }

    if (hasRoleChange) {
      this.facade.changeUserRole(roleRequest);
    }
  }

  onRetryClick(): void {
    this.loadDependencies();
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
  }

  displayLookupOption(value: string | LookupOption | null): string {
    if (!value) return '';
    return typeof value === 'string' ? value : value.label;
  }

  private loadDependencies(): void {
    if (!this.userId) return;

    this.facade.loadUserDetails(this.userId);
    this.autocompleteFacade.loadRoleOptions('');
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
        this.autocompleteFacade.searchRoles(value);
      });
  }

  private patchForm(details: UserWithDetails): void {
    this.userForm.patchValue({
      id: details.id,
      fullName: details.fullName,
      email: details.email,
      roleId: details.role.id
    });

    this.roleSearch.setValue({
      value: details.role.id,
      label: details.role.name
    }, { emitEvent: false });
  }

  private toUpdateRequest(): UpdateUserRequest {
    const raw = this.userForm.getRawValue();

    return {
      userId: raw.id!,
      fullName: raw.fullName!
    };
  }

  private toRoleRequest(): ChangeUserRoleRequest {
    const raw = this.userForm.getRawValue();

    return {
      userId: raw.id!,
      roleId: raw.roleId!
    };
  }

  private navigateToList(): void {
    this.router.navigate(['/users'], {
      queryParams: { updated: true }
    });
  }

  get id() {
    return this.userForm.get('id') as FormControl;
  }

  get fullName() {
    return this.userForm.get('fullName') as FormControl;
  }

  get email() {
    return this.userForm.get('email') as FormControl;
  }

  get roleId() {
    return this.userForm.get('roleId') as FormControl;
  }
}
