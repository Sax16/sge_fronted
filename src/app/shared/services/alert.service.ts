import { Injectable, signal } from '@angular/core';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

export interface AppAlert {
  variant: AlertVariant;
  title: string;
  message: string;
}

/**
 * Service for managing global application alerts.
 */
@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private _alert = signal<AppAlert | null>(null);
  
  // Exponer el signal como readonly para consumo de componentes
  readonly alert = this._alert.asReadonly();
  
  private timeoutId?: any;

  /**
   * Muestra una alerta, opcionalmente eliminándola de forma automática
   */
  showAlert(variant: AlertVariant, title: string, message: string, autoDismissTimeout = 4000) {
    this._alert.set({ variant, title, message });
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    if (variant === 'success' || variant === 'info') {
      this.timeoutId = setTimeout(() => {
        this.clearAlert();
      }, autoDismissTimeout);
    }
  }

  /**
   * Cierra manual o automáticamente la alerta en curso
   */
  clearAlert() {
    this._alert.set(null);
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
