import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  effect,
  inject
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartData, ChartOptions } from 'chart.js';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  RowComponent,
  TableDirective,
  TextColorDirective
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { PermissionCatalog } from '../../core/permissions';
import { PermissionsFacade } from '../../core/auth/store';
import { DashboardRequest, MonthlySalesPoint } from './models';
import { DashboardFacade, initialDashboardRequest } from './store';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    RowComponent,
    ColComponent,
    ButtonDirective,
    TableDirective,
    ChartjsComponent,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    NgxShimmerLoadingModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnDestroy {
  private readonly facade = inject(DashboardFacade);
  private readonly permissionsFacade = inject(PermissionsFacade);
  private updatesConnected = false;

  readonly data = this.facade.data;
  readonly error = this.facade.loadError;
  readonly showInitialLoading = this.facade.showInitialLoading;
  readonly isRefreshing = this.facade.isRefreshing;
  readonly showInitialError = this.facade.showInitialError;
  readonly showRefreshError = this.facade.showRefreshError;
  readonly lastUpdatedAt = this.facade.lastUpdatedAt;

  readonly hasViewPermission = computed(() =>
    this.permissionsFacade.hasPermission(PermissionCatalog.Dashboard_View)
  );

  readonly startDate = new FormControl<Date | null>(this.cloneDate(initialDashboardRequest.startDate));
  readonly endDate = new FormControl<Date | null>(this.cloneDate(initialDashboardRequest.endDate));
  readonly filtersForm = new FormGroup({
    startDate: this.startDate,
    endDate: this.endDate
  });

  readonly summarySkeletonItems = [1, 2, 3, 4, 5];
  readonly tableSkeletonRows = [1, 2, 3, 4, 5];

  readonly chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  readonly monthlySalesChart = computed<ChartData<'line'>>(() => {
    const points = [...(this.data()?.monthlySalesSeries ?? [])]
      .sort((left, right) => this.toMonthIndex(left) - this.toMonthIndex(right));

    return {
      labels: points.map((point) => this.formatMonthLabel(point)),
      datasets: [
        {
          label: 'Sales',
          data: points.map((point) => point.totalValue),
          borderColor: '#2f80ed',
          backgroundColor: 'rgba(47, 128, 237, 0.14)',
          fill: true,
          tension: 0.35
        }
      ]
    };
  });

  readonly productsByCategoryChart = computed<ChartData<'bar'>>(() => {
    const categories = this.data()?.productsCountByCategory ?? [];

    return {
      labels: categories.map((category) => category.categoryName),
      datasets: [
        {
          label: 'Products',
          data: categories.map((category) => category.productCount),
          backgroundColor: '#39a275'
        }
      ]
    };
  });

  readonly periodLabel = computed(() => {
    const request = this.facade.request();
    if (!request.startDate || !request.endDate) {
      return 'All time';
    }

    return `${request.startDate.toLocaleDateString()} - ${request.endDate.toLocaleDateString()}`;
  });

  constructor() {
    effect(() => {
      if (this.hasViewPermission()) {
        if (!this.updatesConnected) {
          this.updatesConnected = true;
          this.loadDashboard();
          //this.facade.connectUpdates();
        }
        return;
      }

      if (this.updatesConnected) {
        this.updatesConnected = false;
        //this.facade.disconnectUpdates();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.updatesConnected) {
      this.facade.disconnectUpdates();
    }
  }

  onApplyFilters(): void {
    this.loadDashboard();
  }

  onResetFilters(): void {
    this.filtersForm.setValue({
      startDate: this.cloneDate(initialDashboardRequest.startDate),
      endDate: this.cloneDate(initialDashboardRequest.endDate)
    });
    this.loadDashboard();
  }

  onRetryClick(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.facade.loadDashboard(this.getRequest());
  }

  private getRequest(): DashboardRequest {
    return {
      ...initialDashboardRequest,
      startDate: this.startDate.value,
      endDate: this.endDate.value
    };
  }

  private cloneDate(value: Date | null): Date | null {
    return value ? new Date(value) : null;
  }

  private toMonthIndex(point: MonthlySalesPoint): number {
    return point.year * 12 + point.month;
  }

  private formatMonthLabel(point: MonthlySalesPoint): string {
    return new Date(point.year, point.month - 1, 1).toLocaleDateString(undefined, {
      month: 'short',
      year: 'numeric'
    });
  }
}
