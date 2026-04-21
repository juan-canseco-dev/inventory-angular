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
import { OrderDetails } from '../../models';
import { OrdersFacade } from '../../store';

@Component({
  selector: 'app-order-details',
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
  private readonly facade = inject(OrdersFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly orderId = Number(this.route.snapshot.queryParamMap.get('orderId'));

  readonly details = this.facade.orderDetails;
  readonly detailsLoading = this.facade.orderDetailsLoading;
  readonly detailsError = this.facade.orderDetailsError;

  ngOnInit(): void {
    this.facade.resetOrderDetailsState();

    if (this.orderId) {
      this.facade.loadOrderDetails(this.orderId);
    }
  }

  ngOnDestroy(): void {
    this.facade.resetOrderDetailsState();
  }

  onBackClick(): void {
    this.router.navigate(['/orders']);
  }

  onRetryClick(): void {
    if (!this.orderId) return;
    this.facade.loadOrderDetails(this.orderId);
  }

  toDisplayDate(value: string | Date | null): string {
    if (!value) return 'Pending';
    return new Date(value).toLocaleString();
  }

  getTotalQuantity(details: OrderDetails): number {
    return details.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}
