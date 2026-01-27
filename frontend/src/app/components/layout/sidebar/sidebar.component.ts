import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  // Signal pour suivre l'onglet actif
  activeId = signal<string>('dashboard');

  // Configuration du menu
  menuItems = signal([
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-th-large' },
    { id: 'tools', label: 'Outils', icon: 'fas fa-box' },
    { id: 'analytics', label: 'Analyses', icon: 'fas fa-chart-pie' },
    { id: 'settings', label: 'Paramètres', icon: 'fas fa-cog' }
  ]);

  /**
   * Change l'onglet actif
   * @param id Identifiant de l'onglet
   * @param event Événement click pour prévenir le comportement par défaut
   */
  setActive(id: string, event: Event) {
    event.preventDefault();
    this.activeId.set(id);
  }
}