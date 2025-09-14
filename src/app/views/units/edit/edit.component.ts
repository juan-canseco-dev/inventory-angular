import { Component, OnInit, Inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UnitsService } from 'src/app/core/services/units/units.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Result } from '../../../core/models/result';
import { filter, map, min, Observable, of, shareReplay, startWith, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Unit } from 'src/app/core/models/units';

export interface EditDialogData {
  unit: Unit;
};

@Component({
  selector: 'app-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {
  private result$: Observable<Result<any>> = of(Result.empty<any>());
  empty$: Observable<Boolean> = of(true);
  loading$: Observable<boolean> = of(false);
  complete$: Observable<Result<any>> = of(Result.empty<any>());

  parent !: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditComponent, Result<number>>,
    @Inject(MAT_DIALOG_DATA) public data: EditDialogData,
    private service: UnitsService,
    private fb: FormBuilder,
    private destroyRef: DestroyRef
  ) { }

  ngOnInit(): void {
    this.parent = this.fb.group({
      id: [this.data.unit.id, {}],
      name: [this.data.unit.name, {
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

    const { id, name } = this.parent.value;

    this.result$ = this.service.update({unitOfMeasurementId: id, name }).pipe(
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
