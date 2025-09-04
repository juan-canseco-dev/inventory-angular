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
  selector: 'app-delete',
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
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.scss'
})
export class DeleteComponent {

  private result$: Observable<Result<any>> = of(Result.empty<any>());
  empty$: Observable<Boolean> = of(true);
  loading$: Observable<Boolean> = of(false);
}
