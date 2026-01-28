// ============================================
// 🔧 Tools Page Component - COMPLET JOUR 7
// ============================================

import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header';
import { ToolsTableComponent } from '../../shared/components/tool-table/tool-table';
import { ToolsFiltersComponent, FilterValues } from './components/tools-filters/tools-filters';
import { ToolModalComponent } from './components/tool-modal/tool-modal';
import { ApiService } from '../../core/services/apiService';
import { Tool } from '../../core/models/interfaces';

@Component({
  selector: 'app-tools',
  standalone: true,
  imports: [
    CommonModule, 
    HeaderComponent, 
    ToolsTableComponent, 
    ToolsFiltersComponent,
    ToolModalComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tools.html',
  styleUrl: './tools.scss'
})
export class ToolsComponent implements OnInit {
  private apiService = inject(ApiService);

  // State
  allTools = signal<Tool[]>([]);
  searchQuery = signal<string>('');
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  filterValues = signal<FilterValues>({
    department: '',
    status: '',
    category: '',
    minCost: 0,
    maxCost: 10000
  });

  // Modal state
  isModalOpen = signal<boolean>(false);
  editingTool = signal<Tool | null>(null);

  // Bulk selection
  selectedToolIds = signal<Set<number>>(new Set());

  // Computed - Filtered tools
  filteredTools = computed(() => {
    let tools = this.allTools();
    const query = this.searchQuery().toLowerCase();
    const filters = this.filterValues();

    // Search filter
    if (query) {
      tools = tools.filter(tool => 
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query) ||
        tool.owner_department.toLowerCase().includes(query)
      );
    }

    // Department filter
    if (filters.department) {
      tools = tools.filter(tool => tool.owner_department === filters.department);
    }

    // Status filter
    if (filters.status) {
      tools = tools.filter(tool => tool.status === filters.status);
    }

    // Category filter
    if (filters.category) {
      tools = tools.filter(tool => tool.category === filters.category);
    }

    // Cost range filter
    tools = tools.filter(tool => 
      tool.monthly_cost >= filters.minCost && 
      tool.monthly_cost <= filters.maxCost
    );

    return tools;
  });

  // Computed - Statistics
  activeToolsCount = computed(() => 
    this.allTools().filter(t => t.status === 'active').length
  );

 totalMonthlyCost = computed(() => {
  const total = this.allTools().reduce((sum, t) => sum + (t.monthly_cost || 0), 0);
  return total.toLocaleString();
});

  ngOnInit(): void {
    this.loadAllTools();
  }

  /**
   * Load all tools from API
   */
  private loadAllTools(): void {
    this.isLoading.set(true);
    
    this.apiService.getAllTools().subscribe({
      next: (tools: Tool[]) => {
        this.allTools.set(tools);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        this.error.set('Failed to load tools catalog. Please try again.');
        this.isLoading.set(false);
        console.error('Error loading tools:', err);
      }
    });
  }

  /**
   * Search handler
   */
  onSearch(query: string): void {
    this.searchQuery.set(query);
  }

  /**
   * Filters changed handler
   */
  onFiltersChanged(filters: FilterValues): void {
    this.filterValues.set(filters);
  }

  /**
   * Open modal for adding new tool
   */
  openAddModal(): void {
    this.editingTool.set(null);
    this.isModalOpen.set(true);
  }

  /**
   * Open modal for editing tool
   */
  openEditModal(tool: Tool): void {
    this.editingTool.set(tool);
    this.isModalOpen.set(true);
  }

  /**
   * Close modal
   */
  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingTool.set(null);
  }

  /**
   * Save tool (create or update)
   */
  onSaveTool(toolData: Partial<Tool>): void {
    const editingId = this.editingTool()?.id;

    if (editingId) {
      // Update existing tool
      this.apiService.updateTool(editingId, toolData).subscribe({
        next: (updatedTool) => {
          // Update local state
          this.allTools.update(tools => 
            tools.map(t => t.id === editingId ? updatedTool : t)
          );
          this.closeModal();
          console.log('Tool updated successfully');
        },
        error: (err) => {
          console.error('Error updating tool:', err);
          alert('Failed to update tool. Please try again.');
        }
      });
    } else {
      // Create new tool
      this.apiService.createTool(toolData).subscribe({
        next: (newTool) => {
          // Add to local state
          this.allTools.update(tools => [...tools, newTool]);
          this.closeModal();
          console.log('Tool created successfully');
        },
        error: (err) => {
          console.error('Error creating tool:', err);
          alert('Failed to create tool. Please try again.');
        }
      });
    }
  }

  /**
   * Delete tool
   */
  onDeleteTool(toolId: number): void {
    if (!confirm('Are you sure you want to delete this tool?')) {
      return;
    }

    this.apiService.deleteTool(toolId).subscribe({
      next: () => {
        // Remove from local state
        this.allTools.update(tools => tools.filter(t => t.id !== toolId));
        console.log('Tool deleted successfully');
      },
      error: (err) => {
        console.error('Error deleting tool:', err);
        alert('Failed to delete tool. Please try again.');
      }
    });
  }

  /**
   * Toggle tool selection for bulk operations
   */
  toggleToolSelection(toolId: number): void {
    this.selectedToolIds.update(selected => {
      const newSet = new Set(selected);
      if (newSet.has(toolId)) {
        newSet.delete(toolId);
      } else {
        newSet.add(toolId);
      }
      return newSet;
    });
  }

  /**
   * Select all filtered tools
   */
  selectAll(): void {
    const allIds = this.filteredTools().map(t => t.id);
    this.selectedToolIds.set(new Set(allIds));
  }

  /**
   * Deselect all tools
   */
  deselectAll(): void {
    this.selectedToolIds.set(new Set());
  }

  /**
   * Delete selected tools (bulk operation)
   */
  deleteSelected(): void {
    const selectedIds = Array.from(this.selectedToolIds());
    
    if (selectedIds.length === 0) {
      alert('No tools selected');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedIds.length} tool(s)?`)) {
      return;
    }

    // Delete all selected tools
    const deletePromises = selectedIds.map(id => 
      this.apiService.deleteTool(id).toPromise()
    );

    Promise.all(deletePromises)
      .then(() => {
        // Remove deleted tools from local state
        this.allTools.update(tools => 
          tools.filter(t => !selectedIds.includes(t.id))
        );
        this.deselectAll();
        console.log('Tools deleted successfully');
      })
      .catch((err) => {
        console.error('Error deleting tools:', err);
        alert('Failed to delete some tools. Please try again.');
      });
  }
}