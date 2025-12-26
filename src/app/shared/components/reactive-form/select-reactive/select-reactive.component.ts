import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface Option {
  value: string;
  label: string;
}

@Component({
  selector: 'app-select-reactive',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectReactiveComponent),
      multi: true,
    },
  ],
  templateUrl: './select-reactive.component.html',
})
export class SelectReactiveComponent implements ControlValueAccessor {

  @Input() options: Option[] = [];
  @Input() placeholder = 'Seleccione una opción';
  @Input() className = '';
  @Input() id: string = '';

  /** estados visuales */
  @Input() error = false;
  @Input() success = false;
  @Input() hint?: string;

  value = '';
  disabled = false;

  private onChange = (_: any) => {};
  private onTouched = () => {};

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  get selectClasses(): string {
    let base = `
      h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-800
      ${this.className}
    `;

    if (this.error) {
      return `${base} border-error-500 text-gray-800 focus:ring-error-500/20`;
    }

    if (this.success) {
      return `${base} border-success-500 text-gray-800 focus:ring-success-500/20`;
    }

    if (this.isPlaceholder) {
      return `${base} text-gray-400 dark:text-white/30`;
    }

    return `${base} text-gray-800 dark:text-white/90`;
}

  get isPlaceholder(): boolean {
    return this.value === null || this.value === '';
  }

  get hintClass(): string {
    if (this.error) return 'text-error-500';
    if (this.success) return 'text-success-500';
    return 'text-gray-500';
  }
}
