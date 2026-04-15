/**
 * Utilidades de saneamiento de strings para formularios.
 * Reutilizable en cualquier componente de formulario de la aplicación.
 */
export class StringSanitizeUtil {
  /**
   * Retorna el valor con trim() o null si es vacío
   */
  static toStringOrNull(value: string | null | undefined): string | null {
    return value && value.trim().length > 0 ? value.trim() : null;
  }
}
