import { Component, Inject, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ColComponent, RowComponent } from '@coreui/angular';
import { Category } from '../../models'
import { CategoriesFacade } from '../../store';
import { CategoryDialogResult } from '../../models/category-dialog-result';

export interface DeleteDialogData {
  category: Category;
}

@Component({
  selector: 'app-delete',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    RowComponent,
    ColComponent
  ],
  providers: [
    CategoriesFacade
  ],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.scss'
})
export class DeleteComponent {
  private readonly facade = inject(CategoriesFacade);

  readonly loading = this.facade.deleteLoading;
  readonly error = this.facade.deleteError;

  constructor(
    public dialogRef: MatDialogRef<DeleteComponent, CategoryDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData
  ) {
    this.facade.resetDeleteState();

    effect(() => {
      if (this.facade.deleteSuccess()) {
        this.dialogRef.close({ success: true });
        return;
      }

      const error = this.error();
      if (error) {
        this.dialogRef.close({
          success: false,
          error: error.message
        });
      }
    });
  }

  onDeleteClick(): void {
    this.facade.deleteCategory(this.data.category.id);
  }

  onCancelClick(): void {
    this.facade.resetDeleteState();
    this.dialogRef.close();
  }
}
