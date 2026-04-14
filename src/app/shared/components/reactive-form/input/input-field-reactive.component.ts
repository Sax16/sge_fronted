import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-field-reactive',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFieldReactiveComponent),
      multi: true,
    }
  ],
  template: `
    <div class="relative">
      <input
        [type]="type"
        [id]="id"
        [placeholder]="placeholder"
        [value]="value"
        [min]="min"
        [max]="max"
        [step]="step"
        [disabled]="disabled"
        [autocomplete]="autocomplete"
        [value]="value"
        [ngClass]="inputClasses"
        (input)="handleInput($event)"
        (blur)="onTouched()"
      />
      @if (hint) {
        <p class="mt-1.5 text-xs" [ngClass]="hintClass">
          {{ hint }}
        </p>
      }
    </div>
  `,

})
export class InputFieldReactiveComponent implements ControlValueAccessor {

  @Input() type: string = 'text';
  @Input() placeholder?: string = '';
  @Input() min?: string;
  @Input() max?: string;  
  @Input() step?: number;
  @Input() autocomplete: string = 'off';
  @Input() className: string = '';

  @Input() id?: string = '';

  @Input() hint?: string;
  @Input() error = false;
  @Input() success = false;

  value: string | number = '';
  disabled = false;

  onChange = (_: any) => {};
  onTouched = () => {}

  writeValue(value: any): void {
    this.value = value ?? '';
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newValue = this.type === 'number' ? +input.value : input.value;
    this.value = newValue;
    this.onChange(newValue);
  }

  get inputClasses(): string[] {
    const classes = [
      'h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30'
    ];

    if (this.className) {
      classes.push(this.className);
    }

    if (this.disabled) {
      classes.push('text-gray-500 border-gray-300 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 opacity-40');
    } else if (this.error) {
      classes.push('border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800');
    } else if (this.success) {
      classes.push('border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800');
    } else {
      classes.push('bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800');
    }

    return classes;
  }

  get hintClass(): string {
    if (this.error) return 'text-error-500';
    if (this.success) return 'text-success-500';
    return 'text-gray-500';
  }
}
