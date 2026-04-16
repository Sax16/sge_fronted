import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SelectOption } from '../../../../shared/models/select-option.model';

/**
 * Payment record interface
 * TODO: Replace with API model when payment endpoint is available
 */
interface PaymentRecord {
  id: number;
  date: string;
  description: string;
  remuneration: number;
  deduction: number;
  bonus: number;
}

/**
 * Employee Payment History Component
 * Displays payment history table for a given employee.
 *
 * SRP: This component is solely responsible for displaying payment history.
 *
 * TODO: Connect to payment service when API is ready.
 *       Replace mockPayments with a service call using employeeId as param.
 */
@Component({
  selector: 'app-employee-payment-history',
  imports: [CommonModule],
  templateUrl: './employee-payment-history.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeePaymentHistoryComponent {
  @Input({ required: true }) employeeId!: number;

  // TODO: Replace with dynamic year range from service when API is ready
  readonly yearOptions: SelectOption[] = Array.from({ length: 6 }, (_, i) => {
    const year = (new Date().getFullYear() - i).toString();
    return { value: year, label: year };
  });

  // MOCK DATA — To be replaced by service call using this.employeeId
  readonly mockPayments: PaymentRecord[] = [
    {
      id: 1,
      date: '2025-07-18',
      description: 'UI Kits',
      remuneration: 300.20,
      deduction: 20.50,
      bonus: 109,
    },
  ];

  selectedYear = '0000';

  handleYearChange(event: Event): void {
    this.selectedYear = (event.target as HTMLSelectElement).value;
    // TODO: Implement year filtering logic when service is connected
  }

  handleDownloadHistory(): void {
    // TODO: Implement download/export logic when service is connected
  }

  calculateTotal(payment: PaymentRecord): number {
    return payment.remuneration - payment.deduction + payment.bonus;
  }
}
