import { Component, inject, Injector, OnInit, Inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Result } from '../../../core/models/result';
import { filter, map, Observable, of, shareReplay, startWith, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Category } from '../../../core/models/categories';
import { ColComponent, RowComponent } from '@coreui/angular';

export interface DeleteDialogData {
  category: Category
};

@Component({
  selector: 'app-delete',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    NgxSkeletonLoaderModule,
    RowComponent,
    ColComponent
  ],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.scss'
})
export class DeleteComponent {

  private result$: Observable<Result<any>> = of(Result.empty<any>());
  empty$: Observable<Boolean> = of(true);
  loading$: Observable<Boolean> = of(false);
  complete$: Observable<Result<any>> = of(Result.empty<any>());



  constructor(
    public dialogRef: MatDialogRef<DeleteComponent, Result<any>>,
    @Inject(MAT_DIALOG_DATA) public data : DeleteDialogData,
    private service: CategoriesService,
    private destroyRef: DestroyRef
  ) {}

  onDeleteClick() {
    
    this.result$ = this.service.delete(this.data.category.id).pipe(
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
    this.dialogRef.close(Result.empty<any>());
  }

}
