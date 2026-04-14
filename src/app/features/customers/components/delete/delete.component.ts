import { Component, Inject, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Customer } from '../../models';
import { CustomersFacade } from '../../store';

export interface DeleteCustomerDialogData {
  customer: Customer;
}

export interface DeleteCustomerDialogResult {
  success: boolean;
  error?: string;
}

@Component({
  selector: 'app-delete-customer',
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
export class DeleteCustomerComponent {
  private readonly facade = inject(CustomersFacade);

  readonly loading = this.facade.deleteLoading;
  readonly error = this.facade.deleteError;

  constructor(
    private readonly dialogRef: MatDialogRef<DeleteCustomerComponent, DeleteCustomerDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteCustomerDialogData
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
    this.facade.deleteCustomer(this.data.customer.id);
  }

  onCancelClick(): void {
    this.facade.resetDeleteState();
    this.dialogRef.close();
  }
}
