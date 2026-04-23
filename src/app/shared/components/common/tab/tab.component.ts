
import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, input, model } from '@angular/core';

export interface TabOption {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-tab',
  imports: [CommonModule],
  templateUrl: './tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent {
  readonly options = input.required<TabOption[]>();
  readonly selectedValue = model<string | number>();

  setSelected(value: string | number) {
    this.selectedValue.set(value);
  }

  getButtonClass(value: string | number): string {
    return this.selectedValue() === value
      ? 'shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800'
      : 'text-gray-500 dark:text-gray-400';
  }
}