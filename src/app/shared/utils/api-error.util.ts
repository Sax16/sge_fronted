/**
 * Utility function to parse API errors.
 * The backend currently sends validation or operational errors in a `{ detail: "..." }` format.
 * This extracts the detail message, or returns a fallback message if it's unavailable.
 */
export function parseApiError(err: any, fallbackMessage: string): string {
  if (err?.error?.detail && typeof err.error.detail === 'string') {
    return err.error.detail;
  }
  return fallbackMessage;
}
