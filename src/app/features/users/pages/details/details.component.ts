import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  GridModule,
  RowComponent
} from '@coreui/angular';
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
import { RolesFecade } from '../../../roles/store';
import { UsersFacade } from '../../store';

@Component({
  selector: 'app-details-user',
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    CardFooterComponent,
    ButtonDirective,
    GridModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    NgxShimmerLoadingModule
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsComponent {
  private readonly facade = inject(UsersFacade);
  private readonly rolesFacade = inject(RolesFecade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private readonly userId = Number(this.route.snapshot.queryParamMap.get('userId'));

  readonly details = this.facade.userDetails;
  readonly detailsLoading = this.facade.userDetailsLoading;
  readonly detailsError = this.facade.userDetailsError;
  readonly permissionGroups = this.rolesFacade.permissionGroups;
  readonly permissionGroupsLoading = this.rolesFacade.permissionGroupsLoading;
  readonly permissionGroupsError = this.rolesFacade.permissionGroupsError;

  constructor() {
    if (this.userId) {
      this.facade.loadUserDetails(this.userId);
    }

    this.rolesFacade.loadPermissionGroups();

    this.destroyRef.onDestroy(() => {
      this.facade.resetUserDetailsState();
      this.rolesFacade.resetPermissionGroupsState();
    });
  }

  onBackClick(): void {
    this.router.navigate(['/users']);
  }

  onRetryClick(): void {
    if (!this.userId) return;
    this.facade.loadUserDetails(this.userId);
    this.rolesFacade.loadPermissionGroups();
  }

  hasPermission(permission: PermissionDefinition): boolean {
    return (this.details()?.role.permissions ?? []).includes(
      PermissionCatalog.permissionOf(permission.resource, permission.action)
    );
  }
}
