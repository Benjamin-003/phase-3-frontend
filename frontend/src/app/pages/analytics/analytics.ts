// ============================================
// 📊 Analytics Page Component - JOUR 8
// ============================================

import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header';
import { ApiService } from '../../core/services/apiService';
import { Tool, Analytics as AnalyticsData } from '../../core/models/interfaces';

// Chart data interfaces
interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

interface LineChartDataPoint {
  month: string;
  cost: number;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analytics.html'
})
export class AnalyticsComponent implements OnInit {
  private apiService = inject(ApiService);

  // State
  analytics = signal<AnalyticsData | null>(null);
  allTools = signal<Tool[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  selectedTimeRange = signal<string>('90d');

  // Time range options
  timeRangeOptions = [
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
    { value: 'all', label: 'All Time' }
  ];

  // Computed - KPI Metrics
  totalMonthlyCost = computed(() => {
    const tools = this.allTools();
    return tools.reduce((sum, t) => sum + t.monthly_cost, 0);
  });

  averageCostPerTool = computed(() => {
    const tools = this.allTools();
    if (tools.length === 0) return 0;
    return Math.round(this.totalMonthlyCost() / tools.length);
  });

  totalActiveUsers = computed(() => {
    return this.analytics()?.cost_analytics.active_users || 0;
  });

  costPerUser = computed(() => {
    return this.analytics()?.cost_analytics.cost_per_user || 0;
  });

  // Computed - Chart Data

  /**
   * Line Chart: Monthly Spend Evolution (simulated data)
   */
  monthlySpendData = computed((): LineChartDataPoint[] => {
    const tools = this.allTools();
    const currentTotal = tools.reduce((sum, t) => sum + t.monthly_cost, 0);
    
    // Simulate historical data (6 months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      cost: Math.round(currentTotal * (0.7 + (index * 0.05)))
    }));
  });

  /**
   * Pie Chart: Department Cost Breakdown
   */
  departmentCostData = computed((): ChartDataPoint[] => {
    const tools = this.allTools();
    const departmentMap = new Map<string, number>();

    tools.forEach(tool => {
      const current = departmentMap.get(tool.owner_department) || 0;
      departmentMap.set(tool.owner_department, current + tool.monthly_cost);
    });

    const colors = ['#6366f1', '#10b981', '#f97316', '#ec4899', '#8b5cf6', '#14b8a6'];
    let colorIndex = 0;

    return Array.from(departmentMap.entries())
      .map(([name, value]) => ({
        name,
        value: Math.round(value),
        color: colors[colorIndex++ % colors.length]
      }))
      .sort((a, b) => b.value - a.value);
  });

  /**
   * Bar Chart: Top 5 Expensive Tools
   */
  topExpensiveToolsData = computed((): ChartDataPoint[] => {
    const tools = [...this.allTools()];
    return tools
      .sort((a, b) => b.monthly_cost - a.monthly_cost)
      .slice(0, 5)
      .map(tool => ({
        name: tool.name,
        value: tool.monthly_cost,
        color: '#6366f1'
      }));
  });

  /**
   * Budget Progress
   */
  budgetProgress = computed(() => {
    const analytics = this.analytics();
    if (!analytics) return { percentage: 0, used: 0, limit: 0 };

    const used = analytics.budget_overview.current_month_total;
    const limit = analytics.budget_overview.monthly_limit;
    const percentage = Math.round((used / limit) * 100);

    return { percentage, used, limit };
  });

  /**
   * Category Distribution
   */
  categoryDistributionData = computed((): ChartDataPoint[] => {
    const tools = this.allTools();
    const categoryMap = new Map<string, number>();

    tools.forEach(tool => {
      const current = categoryMap.get(tool.category) || 0;
      categoryMap.set(tool.category, current + 1);
    });

    const colors = ['#6366f1', '#10b981', '#f97316', '#ec4899', '#8b5cf6'];
    let colorIndex = 0;

    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({
        name,
        value,
        color: colors[colorIndex++ % colors.length]
      }))
      .sort((a, b) => b.value - a.value);
  });

  ngOnInit(): void {
    this.loadAnalyticsData();
  }

  private loadAnalyticsData(): void {
    this.isLoading.set(true);

    // Load analytics
    this.apiService.getAnalytics().subscribe({
      next: (data) => this.analytics.set(data),
      error: (err) => console.error('Analytics error:', err)
    });

    // Load all tools for charts
    this.apiService.getAllTools().subscribe({
      next: (tools: Tool[]) => {
        this.allTools.set(tools);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        this.error.set('Failed to load analytics data');
        this.isLoading.set(false);
        console.error('Error loading tools:', err);
      }
    });
  }

  onSearch(query: string): void {
    // Implement search if needed
    console.log('Search:', query);
  }

  onTimeRangeChange(range: string): void {
    this.selectedTimeRange.set(range);
    // In a real app, reload data based on time range
  }

  /**
   * Get max value for chart scaling
   */
  getMaxValue(data: ChartDataPoint[]): number {
    return Math.max(...data.map(d => d.value));
  }

  /**
   * Calculate percentage for visual representation
   */
  getPercentage(value: number, max: number): number {
    return Math.round((value / max) * 100);
  }

  /**
 * Max value for Monthly Spend chart
 */
maxMonthlySpend = computed(() => {
  const data = this.monthlySpendData();
  if (data.length === 0) return 1;
  return Math.max(...data.map(d => d.cost));
});
}