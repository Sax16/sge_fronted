/**
 * Utilidades para el formateo de fechas entre el API (ISO 8601) y los inputs del usuario (DD/MM/YYYY)
 */
export class DateFormatUtil {
  /**
   * Convierte de formato de API (yyyy-MM-dd) a formato de input visual (dd/MM/yyyy)
   * @example '1990-05-20' → '20/05/1990'
   */
  static toInputFormat(isoDate: string): string {
    if (!isoDate || isoDate.length < 10) return '';
    const year  = isoDate.substring(0, 4);
    const month = isoDate.substring(5, 7);
    const day   = isoDate.substring(8, 10);
    return `${day}/${month}/${year}`;
  }

  /**
   * Convierte de formato de input visual (dd/MM/yyyy) a formato de API (yyyy-MM-dd)
   * @example '20/05/1990' → '1990-05-20'
   */
  static toApiFormat(displayDate: string): string {
    if (!displayDate || displayDate.length < 10) return '';
    const day   = displayDate.substring(0, 2);
    const month = displayDate.substring(3, 5);
    const year  = displayDate.substring(6, 10);
    return `${year}-${month}-${day}`;
  }
}
