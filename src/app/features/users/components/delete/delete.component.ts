import { Component, Inject, OnDestroy, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { User } from '../../models';
import { UsersFacade } from '../../store';

export interface DeleteUserDialogData {
  user: User;
}

export interface DeleteUserDialogResult {
  success: boolean;
  error?: string;
}

@Component({
  selector: 'app-delete-user',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.scss'
})
export class DeleteComponent implements OnDestroy {
  private readonly facade = inject(UsersFacade);

  readonly loading = this.facade.deleteLoading;
  readonly error = this.facade.deleteError;

  constructor(
    private readonly dialogRef: MatDialogRef<DeleteComponent, DeleteUserDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteUserDialogData
  ) {
    effect(() => {
      if (this.facade.deleteSuccess()) {
        this.facade.resetDeleteState();
        this.dialogRef.close({ success: true });
        return;
      }

      const error = this.error();
      if (error) {
        this.facade.resetDeleteState();
        this.dialogRef.close({
          success: false,
          error: error.message
        });
      }
    });
  }
  ngOnDestroy(): void {
    this.facade.resetDeleteState();
  }

  onDeleteClick(): void {
    this.facade.deleteUser(this.data.user.id);
  }

  onCancelClick(): void {
    this.facade.resetDeleteState();
    this.dialogRef.close();
  }
}
