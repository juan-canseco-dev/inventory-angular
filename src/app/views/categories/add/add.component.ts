import { Component, inject, Injector, OnInit, Inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Result } from '../../../core/models/result';
import { filter, map, Observable, of, shareReplay, startWith, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    MatInputModule,
    NgxSkeletonLoaderModule
  ],
  styleUrl: './add.component.scss'
})
export class AddComponent implements OnInit {
  
  private result$: Observable<Result<number>> = of(Result.empty<number>());
  empty$: Observable<Boolean> = of(true);
  loading$: Observable<boolean> = of(false);
  complete$: Observable<Result<number>> = of(Result.empty<number>());

  parent !: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddComponent, Result<number>>,
    @Inject(MAT_DIALOG_DATA) public data: AddComponent,
    private categoryService: CategoriesService,
    private fb: FormBuilder,
    private injector:  Injector,
    private destroyRef: DestroyRef
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
    
    const { name } = this.parent.value;

    this.result$ = this.categoryService.create({name}).pipe(
      shareReplay(1)
    );

    this.empty$ = this.result$.pipe(
      map(r => r.status === 'empty')
    );

    this.loading$ = this.result$.pipe(
      map(r => r.status === 'loading')
    );

    this.complete$ = this.result$.pipe(
      filter(r => r.status === 'success' || r.status === 'failure'),
      takeUntilDestroyed(this.destroyRef)
    );

    this.complete$.subscribe(r => this.dialogRef.close(r));
  }

  onCancelClick() {
    this.dialogRef.close(Result.empty<number>());
  }

  get name() {
    return this.parent.get('name');
  }

}
