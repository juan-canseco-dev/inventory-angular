import { Component, Inject, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Role } from '../../models';
import { RolesFecade } from '../../store';

export interface DeleteRoleDialogData {
  role: Role;
}

export interface DeleteRoleDialogResult {
  success: boolean;
  error?: string;
}

@Component({
  selector: 'app-delete-role',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.scss'
})
export class DeleteComponent {
  private readonly fecade = inject(RolesFecade);
  private readonly dialogRef = inject(MatDialogRef<DeleteComponent, DeleteRoleDialogResult | undefined>);

  readonly loading = this.fecade.deleteLoading;
  readonly deleteSuccess = this.fecade.deleteSuccess;
  readonly deleteError = this.fecade.deleteError;

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: DeleteRoleDialogData
  ) {
    this.fecade.resetDeleteState();

    effect(() => {
      if (this.deleteSuccess()) {
        this.dialogRef.close({ success: true });
      }

      const error = this.deleteError();
      if (error) {
        this.dialogRef.close({
          success: false,
          error: error.message
        });
      }
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onDeleteClick(): void {
    this.fecade.deleteRole(this.data.role.id);
  }

  getName(): string {
    return this.data.role.name;
  }
}
