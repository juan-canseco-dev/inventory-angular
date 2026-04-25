import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ColComponent,
  RowComponent
} from '@coreui/angular';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { PurchaseDetails } from '../../models';
import { PurchasesFacade } from '../../store';

@Component({
  selector: 'app-purchase-details',
  imports: [
    RowComponent,
    ColComponent,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    NgxShimmerLoadingModule
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsComponent implements OnInit, OnDestroy {
  private readonly facade = inject(PurchasesFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly purchaseId = Number(this.route.snapshot.queryParamMap.get('purchaseId'));

  readonly details = this.facade.purchaseDetails;
  readonly detailsLoading = this.facade.purchaseDetailsLoading;
  readonly detailsError = this.facade.purchaseDetailsError;

  ngOnInit(): void {
    this.facade.resetPurchaseDetailsState();

    if (this.purchaseId) {
      this.facade.loadPurchaseDetails(this.purchaseId);
    }
  }

  ngOnDestroy(): void {
    this.facade.resetPurchaseDetailsState();
  }

  onBackClick(): void {
    this.router.navigate(['/purchases']);
  }

  onRetryClick(): void {
    if (!this.purchaseId) return;
    this.facade.loadPurchaseDetails(this.purchaseId);
  }

  toDisplayDate(value: string | Date | null): string {
    if (!value) return 'Pending';
    return new Date(value).toLocaleString();
  }

  getTotalQuantity(details: PurchaseDetails): number {
    return details.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}
