import { Component, computed, input, signal, output } from '@angular/core';
import { Tool } from '../../../core/models/interfaces';

@Component({
  selector: 'app-tools-table',
  imports: [],
  templateUrl: './tool-table.html',
  styleUrl: './tool-table.scss',
})
export class ToolsTableComponent {
  tools = input.required<Tool[]>();
  
  // Outputs for actions
  editTool = output<Tool>();
  deleteTool = output<number>();
  
  currentPage = signal(1);
  itemsPerPage = signal(10);
  sortColumn = signal<keyof Tool>('updated_at');
  sortDirection = signal<'asc' | 'desc'>('desc');

  sortedTools = computed(() => {
    const tools = [...this.tools()];
    const column = this.sortColumn();
    const direction = this.sortDirection();

    return tools.sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      return 0;
    });
  });

  totalPages = computed(() => Math.ceil(this.sortedTools().length / this.itemsPerPage()));
  startIndex = computed(() => (this.currentPage() - 1) * this.itemsPerPage());
  endIndex = computed(() => Math.min(this.startIndex() + this.itemsPerPage(), this.sortedTools().length));
  paginatedTools = computed(() => this.sortedTools().slice(this.startIndex(), this.endIndex()));
  pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  sortBy(column: keyof Tool): void {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  /**
   * Emit edit event
   */
  onEdit(tool: Tool): void {
    this.editTool.emit(tool);
  }

  /**
   * Emit delete event
   */
  onDelete(toolId: number): void {
    this.deleteTool.emit(toolId);
  }

  /**
   * Retourne l'URL de l'image du tool
   * Priorité: icon_url de l'API > Clearbit > Emoji fallback
   */
  getToolImageUrl(tool: Tool): string {
    // Si l'API fournit déjà une URL
    if (tool.icon_url) {
      return tool.icon_url;
    }

    // Sinon, mapping manuel vers Clearbit
    const clearbitMap: Record<string, string> = {
      'Slack': 'https://logo.clearbit.com/slack.com',
      'Figma': 'https://logo.clearbit.com/figma.com',
      'GitHub': 'https://logo.clearbit.com/github.com',
      'Notion': 'https://logo.clearbit.com/notion.so',
      'Adobe CC': 'https://logo.clearbit.com/adobe.com',
      'Adobe Creative Cloud': 'https://logo.clearbit.com/adobe.com',
      'Zoom': 'https://logo.clearbit.com/zoom.us',
      'Jira': 'https://logo.clearbit.com/atlassian.com',
      'Salesforce': 'https://logo.clearbit.com/salesforce.com',
      'Microsoft Teams': 'https://logo.clearbit.com/microsoft.com',
      'Asana': 'https://logo.clearbit.com/asana.com',
      'Trello': 'https://logo.clearbit.com/trello.com'
    };

    return clearbitMap[tool.name] || '';
  }

  /**
   * Status badge COMME LE MOCKUP
   */
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-emerald-500 text-white';
      case 'expiring':
        return 'bg-orange-500 text-white';
      case 'unused':
        return 'bg-rose-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  }

  /**
   * Gère les erreurs de chargement d'image
   */
  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Remplace par une image placeholder générique
    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="2"%3E%3Cpath d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/%3E%3C/svg%3E';
  }
}