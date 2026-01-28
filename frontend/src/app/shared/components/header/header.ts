import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ThemeService } from '../../../core/services/themeService';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
 selector: 'app-header',
  standalone: true,
 imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
  styles: [`
    .nav-link {
      @apply text-sm font-medium transition-colors relative pb-1 cursor-pointer;
      @apply text-gray-500 dark:text-gray-400;
      @apply hover:text-gray-900 dark:hover:text-white;
    }

    .nav-link.active {
      @apply text-gray-900 dark:text-white;
    }

    .nav-link.active::after {
      content: '';
      @apply absolute bottom-0 left-0 right-0 h-0.5 rounded-full;
      background: linear-gradient(to right, #6366f1, #8b5cf6);
    }

    .nav-link.inactive {
      @apply opacity-50 cursor-not-allowed;
    }
  `]
})
export class HeaderComponent {
  private themeService = inject(ThemeService);
  private router = inject(Router);
  
  searchQuery = signal('');
  
  // Output event
  search = output<string>();

  // Computed
  isDark = computed(() => this.themeService.theme() === 'dark');

  /**
   * Placeholder adaptatif selon la page
   */
  getSearchPlaceholder(): string {
    const url = this.router.url;
    if (url.includes('/tools')) {
      return 'Search in tools catalog...';
    } else if (url.includes('/analytics')) {
      return 'Search metrics, insights...';
    }
    return 'Search tools...';
  }

  onSearch(): void {
    this.search.emit(this.searchQuery());
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
