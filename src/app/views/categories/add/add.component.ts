import { Component, inject, Injector, OnInit, runInInjectionContext, signal, Signal, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { Result } from '../../../core/models/result';

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
export class AddComponent implements OnInit, OnDestroy {

  parent !: FormGroup;
  loading: boolean = false;

  private subscriptions$ = new Subscription();


  constructor(
    public dialogRef: MatDialogRef<AddComponent, Result<number>>,
    @Inject(MAT_DIALOG_DATA) public data: AddComponent,
    private categoryService: CategoriesService,
    private fb: FormBuilder
  ) { }

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

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

  onSubmit() {
    if (!this.parent.valid) {
      return;
    }
    const { name } = this.parent.value;
    this.subscriptions$.add(
      this.categoryService.create({ name }).subscribe(result => this.dialogRef.close(result))
    );
  }

  onCancelClick() {
    if (this.loading) {
      return;
    }
    this.dialogRef.close();
  }

  get name() {
    return this.parent.get('name');
  }

}
