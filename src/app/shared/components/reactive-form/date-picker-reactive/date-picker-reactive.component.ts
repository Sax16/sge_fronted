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

  @ViewChild('dateInput') dateInput?: ElementRef<HTMLInputElement>;

  private flatpickrInstance?: flatpickr.Instance;
  private isDisabled = false;

  private onChange = (_: any) => {};
  private onTouched = () => {};

  ngAfterViewInit() {
    if (!this.dateInput) return;

    this.flatpickrInstance = flatpickr(this.dateInput.nativeElement, {
      dateFormat: 'Y-m-d',
      onChange: (_, dateStr) => {
        this.onChange(dateStr);
      },
      onClose: () => {
        this.onTouched();
      },
    });

    // 🔑 aplicar disabled si Angular lo envió antes
    this.dateInput.nativeElement.disabled = this.isDisabled;
  }

  writeValue(value: string | null): void {
    if (this.flatpickrInstance && value) {
      this.flatpickrInstance.setDate(value, false);
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
}