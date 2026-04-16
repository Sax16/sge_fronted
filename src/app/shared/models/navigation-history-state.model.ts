import { AlertVariant } from '../services/alert.service';

/**
 * Shape of the navigation state passed via Router navigate({ state: ... }).
 * Used by page-level components (employees, users, etc.) to pass alerts
 * and reload signals between route navigations.
 * All fields are optional since history.state can carry anything.
 */
export interface NavigationHistoryState {
  alert?: {
    variant: AlertVariant;
    title: string;
    message: string;
  };
  reloadData?: boolean;
}
