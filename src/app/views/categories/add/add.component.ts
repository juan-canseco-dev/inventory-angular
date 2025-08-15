import { Component, inject, Injector, OnInit, runInInjectionContext, signal, Signal, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoriesService } from 'src/app/core/services/categories/categories.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-categories-add',
  templateUrl: './add.component.html',
  imports: [
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
  
  parent !: FormGroup;
  loading : boolean = false;

  constructor(
    public dialogRef : MatDialogRef<AddComponent>,
    @Inject(MAT_DIALOG_DATA) public data : AddComponent,
    private categoryService : CategoriesService,
    private fb : FormBuilder
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

  onSubmit() {
    if (!this.parent.valid) {
      return;
    }

  }

  createCategory() {

  }

  onCancelClick() {
  }
  
  get name() {
    return this.parent.get('name');
  }

}
