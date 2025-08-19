import { Component, inject, Injector, OnInit, runInInjectionContext, signal, Signal, Inject, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Result } from '../../../core/models/result';
import { Observable, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

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
  styleUrl: './add.component.scss'
})
export class AddComponent implements OnInit {
  
  private result$: Observable<Result<number>> = of(Result.empty<number>());
  result: Signal<Result<number>> = signal(Result.empty());
  parent !: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddComponent, Result<number>>,
    @Inject(MAT_DIALOG_DATA) public data: AddComponent,
    private categoryService: CategoriesService,
    private fb: FormBuilder,
    private injector:  Injector
  ) { }

  status = computed(() => {
    const current = this.result();
    if (current.status === 'success' || current.status === 'failure') {
      this.dialogRef.close(current);
    }
    return current.status;
  });

  ngOnInit(): void {
    this.parent = this.fb.group({
      name: [null, {
        validators: [
          Validators.required,
          Validators.maxLength(50)
        ]
      }]
    })
  }

  

  onSubmit() {
    if (!this.parent.valid) {
      return;
    }
    const { name } = this.parent.value;
    this.result$ = this.categoryService.create({name});
    runInInjectionContext(this.injector, () => {
      this.result = toSignal(this.result$, {initialValue: Result.loading<number>()});
    });
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  get name() {
    return this.parent.get('name');
  }

}
