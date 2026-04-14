import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  GridModule,
  RowComponent,
  ButtonDirective
} from '@coreui/angular';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';

import {
  PermissionCatalog,
  PermissionDefinition
} from '../../../../core/permissions';
import { RolesFecade } from '../../store';

@Component({
  selector: 'app-role-details',
  standalone: true,
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
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    NgxShimmerLoadingModule
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsComponent {
  private readonly fecade = inject(RolesFecade);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private readonly roleId = Number(this.route.snapshot.queryParamMap.get('roleId'));

  readonly details = this.fecade.roleDetails;
  readonly detailsLoading = this.fecade.roleDetailsLoading;
  readonly detailsError = this.fecade.roleDetailsError;

  readonly permissionGroups = this.fecade.permissionGroups;
  readonly permissionGroupsLoading = this.fecade.permissionGroupsLoading;
  readonly permissionGroupsError = this.fecade.permissionGroupsError;

  constructor() {
    this.loadDependencies();

    this.destroyRef.onDestroy(() => {
      this.fecade.resetRoleDetailsState();
      this.fecade.resetPermissionGroupsState();
    });
  }

  onRetryClick(): void {
    this.loadDependencies();
  }

  hasPermission(permission: PermissionDefinition): boolean {
    return (this.details()?.permissions ?? []).includes(
      PermissionCatalog.permissionOf(permission.resource, permission.action)
    );
  }

  private loadDependencies(): void {
    this.fecade.loadRoleDetails(this.roleId);
    this.fecade.loadPermissionGroups();
  }
}
