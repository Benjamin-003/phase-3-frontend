import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ThemeService } from '../../../core/services/themeService';

@Component({
 selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  private themeService = inject(ThemeService);
  
  searchQuery = signal('');
  
  navItems = signal([
    { id: 'dashboard', label: 'Dashboard', href: '#', active: true },
    { id: 'tools', label: 'Tools', href: '#', active: false },
    { id: 'analytics', label: 'Analytics', href: '#', active: false },
    { id: 'settings', label: 'Settings', href: '#', active: false }
  ]);

  // Output event
  search = output<string>();

  // Computed pour détecter le dark mode
  isDark = computed(() => this.themeService.theme() === 'dark');

  onSearch(): void {
    this.search.emit(this.searchQuery());
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}