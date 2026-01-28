import { Component, ChangeDetectionStrategy, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterValues {
  department: string;
  status: string;
  category: string;
  minCost: number;
  maxCost: number;
}

@Component({
  selector: 'app-tools-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tools-filters.html',
  styles: ``,
})
export class ToolsFiltersComponent {
  // Signals for filter values
  selectedDepartment = signal<string>('');
  selectedStatus = signal<string>('');
  selectedCategory = signal<string>('');
  minCost = signal<number>(0);
  maxCost = signal<number>(10000);

  // Output event
  filtersChanged = output<FilterValues>();

  // Computed
  hasActiveFilters = computed(() => 
    !!this.selectedDepartment() || 
    !!this.selectedStatus() || 
    !!this.selectedCategory() ||
    this.hasCostRange()
  );

  hasCostRange = computed(() => 
    this.minCost() > 0 || this.maxCost() < 10000
  );

  onFilterChange(): void {
    this.filtersChanged.emit({
      department: this.selectedDepartment(),
      status: this.selectedStatus(),
      category: this.selectedCategory(),
      minCost: this.minCost(),
      maxCost: this.maxCost()
    });
  }

  resetFilters(): void {
    this.selectedDepartment.set('');
    this.selectedStatus.set('');
    this.selectedCategory.set('');
    this.minCost.set(0);
    this.maxCost.set(10000);
    this.onFilterChange();
  }

  clearDepartment(): void {
    this.selectedDepartment.set('');
    this.onFilterChange();
  }

  clearStatus(): void {
    this.selectedStatus.set('');
    this.onFilterChange();
  }

  clearCategory(): void {
    this.selectedCategory.set('');
    this.onFilterChange();
  }

  clearCostRange(): void {
    this.minCost.set(0);
    this.maxCost.set(10000);
    this.onFilterChange();
  }
}
