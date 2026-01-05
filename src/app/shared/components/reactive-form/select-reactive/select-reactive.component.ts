import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

export interface Option {
  value: string | boolean;
  label: string;
}

@Component({
  selector: 'app-select-reactive',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  value: any = null;
  disabled = false;

  private onChange = (_: any) => {};
  private onTouched = () => {};

  writeValue(value: any): void {
    this.value = value ?? null;
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

  // Manejar el cambio de selección
  handleChange(event: Event): void {
    const rawValue = (event.target as HTMLSelectElement).value;
    
    // Convertir el valor string a su tipo original
    let parsedValue: any = rawValue;
    
    // Buscar la opción correspondiente para obtener el valor real
    const option = this.options.find(opt => String(opt.value) === rawValue);
    if (option) {
      parsedValue = option.value;
    }
    
    this.value = parsedValue;
    this.onChange(parsedValue);
    this.onTouched();
  }

  onModelChange(value: any): void {
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
    return this.value === null || this.value === '' || this.value === undefined;
  }

  get hintClass(): string {
    if (this.error) return 'text-error-500';
    if (this.success) return 'text-success-500';
    return 'text-gray-500';
  }
}
