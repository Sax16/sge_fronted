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

  get selectClasses(): string[] {
    const classes = [
      'h-11 w-full appearance-none rounded-lg border bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900'
    ];

    if (this.className) {
      classes.push(this.className);
    }

    if (this.disabled) {
      classes.push('cursor-not-allowed opacity-60 bg-gray-100 dark:bg-gray-800 border-gray-200 text-gray-500 dark:text-gray-400 dark:border-gray-700');
      return classes;
    }

    if (this.error) {
      classes.push('text-gray-400 dark:text-white/30 border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800');
    } else if (this.success) {
      classes.push('border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800');
    } else if (this.isPlaceholder) {
      classes.push('border-gray-300 text-gray-400 dark:text-white/30 dark:border-gray-700');
    } else {
      classes.push('border-gray-300 text-gray-800 dark:text-white/90 dark:border-gray-700 dark:focus:border-brand-800');
    }

    return classes;
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
