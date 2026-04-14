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
  AbstractControl,
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
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
import { IconModule } from '@coreui/icons-angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';

import {
  PermissionCatalog,
  PermissionDefinition
} from '../../../../core/permissions';
import { UpdateRoleRequest } from '../../models';
import { RolesFecade } from '../../store';

function atLeastOnePermissionSelectedValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const permissions = (control.value as string[] | null) ?? [];

    return permissions.length > 0
      ? null
      : { atLeastOnePermissionSelected: true };
  };
}

@Component({
  selector: 'app-edit-role',
  standalone: true,
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
    IconModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    NgxShimmerLoadingModule
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditComponent {
  private readonly fb = inject(FormBuilder);
  private readonly fecade = inject(RolesFecade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private readonly roleId = Number(this.route.snapshot.queryParamMap.get('roleId'));

  readonly details = this.fecade.roleDetails;
  readonly detailsLoading = this.fecade.roleDetailsLoading;
  readonly detailsError = this.fecade.roleDetailsError;

  readonly permissionGroups = this.fecade.permissionGroups;
  readonly permissionGroupsLoading = this.fecade.permissionGroupsLoading;
  readonly permissionGroupsError = this.fecade.permissionGroupsError;

  readonly updateLoading = this.fecade.updateLoading;
  readonly updateSuccess = this.fecade.updateSuccess;
  readonly updateError = this.fecade.updateError;

  readonly roleForm = this.fb.nonNullable.group({
    id: [0, Validators.required],
    name: ['', [Validators.required, Validators.maxLength(50)]],
    permissions: this.fb.nonNullable.control<string[]>([], [
      atLeastOnePermissionSelectedValidator()
    ])
  });

  constructor() {
    this.fecade.resetRoleDetailsState();
    this.fecade.resetPermissionGroupsState();
    this.fecade.resetUpdateState();
    this.loadDependencies();

    effect(() => {
      const details = this.details();
      if (!details) return;

      this.roleForm.patchValue({
        id: details.id,
        name: details.name,
        permissions: this.normalizePermissionsByResource(details.permissions ?? [])
      });
    });

    effect(() => {
      const groups = this.permissionGroups();
      if (!groups.length) return;

      const normalized = this.normalizePermissionsByResource(
        this.permissions.value ?? []
      );

      if (!this.areEqual(normalized, this.permissions.value ?? [])) {
        this.permissions.setValue(normalized);
      }
    });

    effect(() => {
      if (this.updateSuccess()) {
        this.fecade.resetUpdateState();
        this.router.navigate(['/roles'], {
          queryParams: { updated: true }
        });
      }
    });

    this.destroyRef.onDestroy(() => {
      this.fecade.resetRoleDetailsState();
      this.fecade.resetPermissionGroupsState();
      this.fecade.resetUpdateState();
    });
  }

  onSaveClick(): void {
    const normalizedPermissions = this.normalizePermissionsByResource(
      this.permissions.value ?? []
    );

    this.permissions.setValue(normalizedPermissions);
    this.permissions.markAsTouched();
    this.permissions.updateValueAndValidity();

    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    this.fecade.updateRole(this.toUpdateRequest());
  }

  onRetryClick(): void {
    this.loadDependencies();
  }


  onPermissionChange(permission: PermissionDefinition, checked: boolean): void {
    const current = new Set(this.permissions.value ?? []);
    const value = this.permissionValue(permission);
    const group = this.permissionGroups().find(group =>
      group.actions.some(action => this.permissionValue(action) === value)
    );

    if (!group) {
      return;
    }

    const requiredPermissions = group.actions
      .filter(action => action.required)
      .map(action => this.permissionValue(action));

    const nonRequiredPermissions = group.actions
      .filter(action => !action.required)
      .map(action => this.permissionValue(action));

    if (checked) {
      current.add(value);

      // If the user selected a non-required permission,
      // auto-add the required permissions of the same group.
      if (!permission.required) {
        requiredPermissions.forEach(requiredPermission => {
          current.add(requiredPermission);
        });
      }
    } else {
      current.delete(value);

      // If the user removed the last non-required permission of the group,
      // remove the required permissions that were auto-added for that group.
      if (!permission.required) {
        const hasAnyNonRequiredLeft = nonRequiredPermissions.some(permission =>
          current.has(permission)
        );

        if (!hasAnyNonRequiredLeft) {
          requiredPermissions.forEach(requiredPermission => {
            current.delete(requiredPermission);
          });
        }
      }
    }

    this.permissions.setValue(
      this.normalizePermissionsByResource(Array.from(current))
    );

    this.permissions.markAsTouched();
    this.permissions.updateValueAndValidity();
  }

  isPermissionSelected(permission: PermissionDefinition): boolean {
    return (this.permissions.value ?? []).includes(this.permissionValue(permission));
  }

  isPermissionDisabled(permission: PermissionDefinition): boolean {
    const value = this.permissionValue(permission);
    const group = this.permissionGroups().find(group =>
      group.actions.some(action => this.permissionValue(action) === value)
    );

    if (!group || !permission.required) {
      return false;
    }

    const selectedPermissions = this.permissions.value ?? [];
    const nonRequiredPermissions = group.actions
      .filter(action => !action.required)
      .map(action => this.permissionValue(action));

    const hasNonRequiredSelected = nonRequiredPermissions.some(permission =>
      selectedPermissions.includes(permission)
    );

    return hasNonRequiredSelected;
  }

  permissionValue(permission: PermissionDefinition): string {
    return PermissionCatalog.permissionOf(permission.resource, permission.action);
  }

  private loadDependencies(): void {
    this.fecade.loadRoleDetails(this.roleId);
    this.fecade.loadPermissionGroups();
  }

  private toUpdateRequest(): UpdateRoleRequest {
    const raw = this.roleForm.getRawValue();

    return {
      roleId: raw.id,
      name: raw.name,
      permissions: this.normalizePermissionsByResource(raw.permissions)
    };
  }

  private normalizePermissionsByResource(permissions: string[]): string[] {
    const selected = new Set(permissions);

    for (const group of this.permissionGroups()) {
      const requiredPermissions = group.actions
        .filter(action => action.required)
        .map(action => this.permissionValue(action));

      const nonRequiredPermissions = group.actions
        .filter(action => !action.required)
        .map(action => this.permissionValue(action));

      const hasNonRequiredSelected = nonRequiredPermissions.some(permission =>
        selected.has(permission)
      );

      // Only auto-add required permissions when there is at least one
      // non-required permission selected in that same group.
      if (hasNonRequiredSelected) {
        requiredPermissions.forEach(requiredPermission => {
          selected.add(requiredPermission);
        });
      }
    }

    return Array.from(selected);
  }

  private areEqual(left: string[], right: string[]): boolean {
    return left.length === right.length && left.every(value => right.includes(value));
  }

  get id() {
    return this.roleForm.get('id') as FormControl;
  }

  get name() {
    return this.roleForm.get('name') as FormControl;
  }

  get permissions() {
    return this.roleForm.get('permissions') as FormControl<string[]>;
  }
}
