/**
 * Interface pour les statistiques par département
 * Source: /api/analytics/department-costs
 */
export interface DepartmentStat {
  department: string;
  total_cost: number;
  tools_count: number;
  total_users: number;
  average_cost_per_tool: number;
  cost_percentage: number;
}

/**
 * Résumé global de l'entreprise
 */
export interface AnalyticsSummary {
  total_company_cost: number;
  departments_count: number;
  most_expensive_department: string;
}

/**
 * Réponse complète de l'endpoint Analytics
 */
export interface AnalyticsResponse {
  data: DepartmentStat[];
  summary: AnalyticsSummary;
}

/**
 * Interface pour un outil SaaS
 * Source: /api/tools
 */
export interface Tool {
  id: number;
  name: string;
  vendor: string;
  owner_department: string;
  monthly_cost: number;
  status: 'active' | 'unused' | 'deprecated';
  active_users_count: number;
  category_id: number;
  categories?: {
    id: number;
    name: string;
  };
}