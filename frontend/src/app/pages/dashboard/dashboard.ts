import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card.component';
import { ToolsTableComponent } from '../../shared/components/tools-table/tools-table.component';
import { ApiService } from '../../core/services/api.service';
import { Analytics, Tool, KpiCard } from '../../core/models/interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent, KpiCardComponent, ToolsTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'dashboard.html', // Indique le chemin vers ton fichier HTML
})
export class DashboardComponent implements OnInit {
  private apiService = inject(ApiService);

  // State signals
  analytics = signal<Analytics | null>(null);
  recentTools = signal<Tool[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Computed KPI Cards from analytics data
  kpiCards = computed<KpiCard[]>(() => {
    const data = this.analytics();
    if (!data) {
      return this.getDefaultKpis();
    }

    const { budget_overview, kpi_trends, cost_analytics } = data;

    return [
      {
        label: 'Monthly Budget',
        value: `€${Math.round(budget_overview.current_month_total).toLocaleString()}`,
        subValue: `€${(budget_overview.monthly_limit / 1000).toFixed(0)}k`,
        trend: budget_overview.trend_percentage,
        trendPositive: !budget_overview.trend_percentage.includes('-'),
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                       d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
               </svg>`,
        iconColor: 'emerald',
        gradientFrom: '#10b981',
        gradientTo: '#059669'
      },
      {
        label: 'Active Tools',
        value: '147',
        trend: kpi_trends.tools_change,
        trendPositive: !kpi_trends.tools_change.includes('-'),
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                       d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
               </svg>`,
        iconColor: 'indigo',
        gradientFrom: '#6366f1',
        gradientTo: '#8b5cf6'
      },
      {
        label: 'Departments',
        value: '8',
        trend: kpi_trends.departments_change,
        trendPositive: !kpi_trends.departments_change.includes('-'),
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                       d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
               </svg>`,
        iconColor: 'orange',
        gradientFrom: '#f97316',
        gradientTo: '#ea580c'
      },
      {
        label: 'Cost / User',
        value: `€${cost_analytics.cost_per_user}`,
        trend: kpi_trends.cost_per_user_change,
        trendPositive: kpi_trends.cost_per_user_change.includes('-'),
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                       d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
               </svg>`,
        iconColor: 'pink',
        gradientFrom: '#ec4899',
        gradientTo: '#db2777'
      }
    ];
  });

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading.set(true);
    
    // Load analytics data
    this.apiService.getAnalytics().subscribe({
      next: (data) => {
        this.analytics.set(data);
      },
      error: (err) => {
        console.error('Failed to load analytics:', err);
      }
    });

    // Load recent tools
    this.apiService.getRecentTools().subscribe({
      next: (tools) => {
        this.recentTools.set(tools);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load tools. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  private getDefaultKpis(): KpiCard[] {
    return [
      {
        label: 'Monthly Budget',
        value: '€28,750',
        subValue: '€30k',
        trend: '+12%',
        trendPositive: false,
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                       d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
               </svg>`,
        iconColor: 'emerald',
        gradientFrom: '#10b981',
        gradientTo: '#059669'
      },
      {
        label: 'Active Tools',
        value: '147',
        trend: '+8',
        trendPositive: true,
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                       d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
               </svg>`,
        iconColor: 'indigo',
        gradientFrom: '#6366f1',
        gradientTo: '#8b5cf6'
      },
      {
        label: 'Departments',
        value: '8',
        trend: '+2',
        trendPositive: true,
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                       d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
               </svg>`,
        iconColor: 'orange',
        gradientFrom: '#f97316',
        gradientTo: '#ea580c'
      },
      {
        label: 'Cost / User',
        value: '€156',
        trend: '-€12',
        trendPositive: true,
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                       d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
               </svg>`,
        iconColor: 'pink',
        gradientFrom: '#ec4899',
        gradientTo: '#db2777'
      }
    ];
  }

  onSearch(query: string): void {
    if (!query.trim()) {
      this.loadDashboardData();
      return;
    }

    this.apiService.searchTools(query).subscribe({
      next: (tools) => {
        this.recentTools.set(tools);
      },
      error: (err) => {
        console.error('Search failed:', err);
      }
    });
  }
}
