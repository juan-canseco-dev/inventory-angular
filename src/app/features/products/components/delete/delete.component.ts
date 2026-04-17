import { Component, Inject, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Product } from '../../models';
import { ProductsFacade } from '../../store';

export interface DeleteProductDialogData {
  product: Product;
}

export interface DeleteProductDialogResult {
  success: boolean;
  error?: string;
}

@Component({
  selector: 'app-delete-product',
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
  private readonly facade = inject(ProductsFacade);

  readonly loading = this.facade.deleteLoading;
  readonly error = this.facade.deleteError;

  constructor(
    private readonly dialogRef: MatDialogRef<DeleteComponent, DeleteProductDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteProductDialogData
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
    this.facade.deleteProduct(this.data.product.id);
  }

  onCancelClick(): void {
    this.facade.resetDeleteState();
    this.dialogRef.close();
  }
}
