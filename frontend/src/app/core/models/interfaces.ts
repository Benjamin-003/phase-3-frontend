// ============================================
// 📊 TechCorp Dashboard - TypeScript Interfaces
// ============================================

/**
 * Tool status from JSON Server API
 */
export type ToolStatus = 'active' | 'unused' | 'expiring';

/**
 * Tool interface matching JSON Server response
 */
export interface Tool {
  id: number;
  name: string;
  description: string;
  vendor: string;
  category: string;
  monthly_cost: number;
  previous_month_cost: number;
  owner_department: string;
  status: ToolStatus;
  website_url: string;
  active_users_count: number;
  icon_url: string;
  created_at: string;
  updated_at: string;
}

/**
 * Analytics data from /analytics endpoint
 */
export interface Analytics {
  budget_overview: {
    monthly_limit: number;
    current_month_total: number;
    previous_month_total: number;
    budget_utilization: string;
    trend_percentage: string;
  };
  kpi_trends: {
    budget_change: string;
    tools_change: string;
    departments_change: string;
    cost_per_user_change: string;
  };
  cost_analytics: {
    cost_per_user: number;
    previous_cost_per_user: number;
    active_users: number;
    total_users: number;
  };
}

/**
 * KPI Card configuration for dashboard
 */
export interface KpiCard {
  label: string;
  value: string;
  subValue?: string;
  trend: string;
  trendPositive: boolean;
  icon: string;
  iconColor: string;
  gradientFrom: string;
  gradientTo: string;
}

/**
 * Department interface
 */
export interface Department {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

/**
 * User interface
 */
export interface User {
  id: number;
  name: string;
  email: string;
  department_id: number;
  role: string;
  active: boolean;
  joined_at: string;
}

export interface FilterValues {
  department: string;
  status: string;
  category: string;
  minCost: number;
  maxCost: number;
}