import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Signal pour le theme actuel
  private currentTheme = signal<Theme>('dark');

  // Getter public
  theme = this.currentTheme.asReadonly();

  constructor() {
    // Charger le theme depuis localStorage au démarrage
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      this.currentTheme.set(savedTheme);
    } else {
      // Détecter la préférence système
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme.set(prefersDark ? 'dark' : 'light');
    }

    // Effect pour appliquer le theme au DOM
    effect(() => {
      const theme = this.currentTheme();
      this.applyTheme(theme);
    });
  }

  /**
   * Toggle entre dark et light
   */
  toggleTheme(): void {
    const newTheme = this.currentTheme() === 'dark' ? 'light' : 'dark';
    this.currentTheme.set(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  /**
   * Setter direct du theme
   */
  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    localStorage.setItem('theme', theme);
  }

  /**
   * Applique le theme au DOM
   */
  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }

  /**
   * Retourne true si le theme actuel est dark
   */
  isDark(): boolean {
    return this.currentTheme() === 'dark';
  }
}
