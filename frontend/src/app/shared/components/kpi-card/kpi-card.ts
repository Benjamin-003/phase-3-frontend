import { Component, input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  imports: [],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.scss',
})
export class KpiCardComponent {
  // Inputs
  label = input.required<string>();
  value = input.required<string>();
  subValue = input<string>();
  trend = input.required<string>();
  trendPositive = input<boolean>(true);
  icon = input.required<string>();
  iconColor = input<string>('indigo');
  gradientFrom = input<string>('#6366f1');
  gradientTo = input<string>('#a855f7');

  /**
   * Background PLEIN pour l'icon badge (comme dans le mockup)
   */
  getIconBgClass(): string {
    const colorMap: Record<string, string> = {
      'emerald': 'bg-emerald-500',
      'indigo': 'bg-indigo-600',
      'orange': 'bg-orange-500',
      'pink': 'bg-pink-500',
      'red': 'bg-red-500',
      'purple': 'bg-purple-600',
      'blue': 'bg-blue-500',
      'green': 'bg-green-500'
    };
    return colorMap[this.iconColor()] || 'bg-gray-500';
  }

  /**
   * Background PLEIN pour le trend badge
   */
  getTrendBgClass(): string {
    if (this.trendPositive()) {
      return 'bg-emerald-500';
    } else {
      return 'bg-pink-500'; // ou rose-500 selon mockup
    }
  }
}