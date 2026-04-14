import { Component, Inject, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UnitsFacade } from '../../store';
import { UnitDialogResult, Unit } from '../../models';

export interface EditDialogData {
  unit: Unit;
}

@Component({
  selector: 'app-units-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    UnitsFacade
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  private readonly facade = inject(UnitsFacade);
  private readonly fb = inject(FormBuilder);

  readonly loading = this.facade.updateLoading;
  readonly error = this.facade.updateError;

  readonly parent = this.fb.nonNullable.group({
    id: [this.data.unit.id],
    name: [this.data.unit.name, [Validators.required, Validators.maxLength(50)]]
  });

  constructor(
    public dialogRef: MatDialogRef<EditComponent, UnitDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: EditDialogData
  ) {
    this.facade.resetUpdateState();

    effect(() => {
      if (this.facade.updateSuccess()) {
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

  onSubmit(): void {
    if (this.parent.invalid) {
      this.parent.markAllAsTouched();
      return;
    }

    const { id, name } = this.parent.getRawValue();
    this.facade.updateUnit({ unitOfMeasurementId: id, name });
  }

  onCancelClick(): void {
    this.facade.resetUpdateState();
    this.dialogRef.close();
  }

  get name() {
    return this.parent.controls.name;
  }
}
