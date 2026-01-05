import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import flatpickr from 'flatpickr';
import { LabelComponent } from '../../form/label/label.component'

@Component({
  selector: 'app-date-picker-reactive',
  standalone: true,
  imports: [CommonModule, LabelComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerReactiveComponent),
      multi: true
    }
  ],
  templateUrl: './date-picker-reactive.component.html',
})
export class DatePickerReactiveComponent
  implements ControlValueAccessor, AfterViewInit, OnDestroy {

  @Input() id!: string;
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() hint?: string;
  @Input() error = false;

  @ViewChild('dateInput') dateInput?: ElementRef<HTMLInputElement>;

  private flatpickrInstance?: flatpickr.Instance;
  private isDisabled = false;
  private initialValue: string | null = null;

  private onChange = (_: any) => {};
  private onTouched = () => {};

  ngAfterViewInit() {
    if (!this.dateInput) return;

    this.flatpickrInstance = flatpickr(this.dateInput.nativeElement, {
      dateFormat: 'd/m/Y',
      onChange: (_, dateStr) => {
        this.onChange(dateStr);
      },
      onClose: () => {
        this.onTouched();
      },
    });

    // Aplicar valor inicial si existe
    if (this.initialValue) {
      this.flatpickrInstance.setDate(this.initialValue, false);
      this.initialValue = null;
    }

    // 🔑 aplicar disabled si Angular lo envió antes
    this.dateInput.nativeElement.disabled = this.isDisabled;
  }

  writeValue(value: string | null): void {
    if (this.flatpickrInstance && value) {
      this.flatpickrInstance.setDate(value, false);
    } else if (value) {
      // Guardar el valor para aplicarlo después de la inicialización
      this.initialValue = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;

    // 🔒 puede que el input aún no exista
    if (this.dateInput) {
      this.dateInput.nativeElement.disabled = isDisabled;
    }
  }

  ngOnDestroy() {
    this.flatpickrInstance?.destroy();
  }

  get hintClass(): string {
    if (this.error) return 'text-error-500';
    return 'text-gray-500';
  }
}