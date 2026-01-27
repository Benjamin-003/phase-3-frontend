import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { AnalyticsService } from '../../services/analytics-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  // Injection du service via la fonction inject() (plus moderne que le constructeur)
  private analyticsService = inject(AnalyticsService);

  /**
   * Transformation du flux de données (Observable) en Signal.
   * toSignal permet de gérer automatiquement l'abonnement et le désabonnement.
   */
  private dashboardData = toSignal(this.analyticsService.getDashboardSummary());
  
  /**
   * Signaux dérivés (Computed) : ils se mettent à jour automatiquement
   * dès que dashboardData change. Ils ne recalculent rien si la source n'a pas bougé.
   */
  
  // Résumé global (Total coût, meilleur département, etc.)
  summary = computed(() => this.dashboardData()?.analytics.summary);
  
  // Liste des outils SaaS
  tools = computed(() => this.dashboardData()?.tools || []);
}