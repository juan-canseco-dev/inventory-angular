import { Component, DestroyRef, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoriesFacade } from '../../store';
import { CategoryDialogResult } from '../../models/category-dialog-result';

@Component({
  selector: 'app-categories-add',
  templateUrl: './add.component.html',
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
    CategoriesFacade
  ],
  styleUrl: './add.component.scss'
})
export class AddComponent {
  private readonly facade = inject(CategoriesFacade);
  private readonly fb = inject(FormBuilder);

  readonly loading = this.facade.createLoading;
  readonly error = this.facade.createError;

  readonly parent = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(50)]]
  });

  constructor(
    public dialogRef: MatDialogRef<AddComponent, CategoryDialogResult>
  ) {
    this.facade.resetCreateState();

    effect(() => {
      if (this.facade.createSuccess()) {
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

    const { name } = this.parent.getRawValue();
    this.facade.createCategory({ name });
  }

  onCancelClick(): void {
    this.facade.resetCreateState();
    this.dialogRef.close();
  }

  get name() {
    return this.parent.controls.name;
  }
}
