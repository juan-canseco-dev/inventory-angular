import { Component, Inject, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Purchase } from '../../models';
import { PurchasesFacade } from '../../store';

export interface DeletePurchaseDialogData {
  purchase: Purchase;
}

export interface DeletePurchaseDialogResult {
  success: boolean;
  error?: string;
}

@Component({
  selector: 'app-delete-purchase',
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
export class DeleteComponent {
  private readonly facade = inject(PurchasesFacade);

  readonly loading = this.facade.deleteLoading;
  readonly error = this.facade.deleteError;

  constructor(
    private readonly dialogRef: MatDialogRef<DeleteComponent, DeletePurchaseDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: DeletePurchaseDialogData
  ) {
    this.facade.resetDeleteState();

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

  onDeleteClick(): void {
    this.facade.deletePurchase(this.data.purchase.id);
  }

  onCancelClick(): void {
    this.facade.resetDeleteState();
    this.dialogRef.close();
  }
}
