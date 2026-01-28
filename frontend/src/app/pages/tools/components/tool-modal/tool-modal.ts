import { Component, ChangeDetectionStrategy, input, output, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tool } from '../../../../core/models/interfaces';

@Component({
  selector: 'app-tool-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tool-modal.html',
  styles: ``,
})
export class ToolModalComponent {
  // Inputs
  isOpen = input.required<boolean>();
  editingTool = input<Tool | null>(null);

  // Outputs
  close = output<void>();
  save = output<Partial<Tool>>();

  // Form data
  formData = signal<Partial<Tool>>({
    name: '',
    description: '',
    category: '',
    owner_department: '',
    monthly_cost: 0,
    active_users_count: 0,
    status: 'active',
    icon_url: ''
  });

  // Load tool data when editing
  constructor() {
    effect(() => {
      const tool = this.editingTool();
      if (tool) {
        this.formData.set({ ...tool });
      } else {
        this.resetForm();
      }
    });
  }

  // Validation
  isFormValid = computed(() => {
    const data = this.formData();
    return !!(
      data.name?.trim() &&
      data.category &&
      data.owner_department &&
      data.status &&
      (data.monthly_cost ?? 0) >= 0
    );
  });

  submitForm(): void {
    if (this.isFormValid()) {
      this.save.emit(this.formData());
    }
  }

  closeModal(): void {
    this.close.emit();
    this.resetForm();
  }

  resetForm(): void {
    this.formData.set({
      name: '',
      description: '',
      category: '',
      owner_department: '',
      monthly_cost: 0,
      active_users_count: 0,
      status: 'active',
      icon_url: ''
    });
  }
}
