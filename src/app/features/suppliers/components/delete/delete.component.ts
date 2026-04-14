import { Component, Inject, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Supplier } from '../../models';
import { SuppliersFecade } from '../../store';

export interface DeleteSupplierDialogData {
  supplier: Supplier;
}

export interface DeleteSupplierDialogResult {
  success: boolean;
  error?: string;
}

@Component({
  selector: 'app-suppliers-delete',
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
  private readonly facade = inject(SuppliersFecade);

  readonly loading = this.facade.deleteLoading;
  readonly error = this.facade.deleteError;

  constructor(
    private readonly dialogRef: MatDialogRef<DeleteComponent, DeleteSupplierDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteSupplierDialogData
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
    this.facade.deleteSupplier(this.data.supplier.id);
  }

  onCancelClick(): void {
    this.facade.resetDeleteState();
    this.dialogRef.close();
  }

  getCompanyName(): string {
    return (this.data.supplier as any).companyName ?? this.data.supplier.companyName ?? '';
  }
}
