import { SelectOption } from '../../../shared/models/select-option.model';

/**
 * Single source of truth for school management types.
 * Values MUST match the backend enum: app/core/enums.py → ManagementType
 */
export const ManagementType = {
  PRIVADA: 'Privada',
  PUBLICA: 'Pública',
} as const;

/** Union type derived from ManagementType values: 'Privada' | 'Pública' */
export type Management = (typeof ManagementType)[keyof typeof ManagementType];

/** Management options for select/dropdown components */
export const MANAGEMENT_OPTIONS: SelectOption[] = Object.values(
  ManagementType,
).map((value) => ({ value, label: value }));

/**
 * Single source of truth for UGEL values.
 * Values MUST match the backend enum: app/core/enums.py → Ugel
 */
export const UgelType = {
  SATIPO: 'Satipo',
  RIO_NEGRO: 'Río Negro',
  MAZAMARI: 'Mazamari',
  PANGOA: 'Pangoa',
  PICHANAKI: 'Pichanaki',
  RIO_TAMBO: 'Río Tambo',
  LA_MERCED: 'La Merced',
  CONCEPCION: 'Concepción',
  JAUJA: 'Jauja',
  HUANCAYO: 'Huancayo',
  OTRO: 'Otro',
} as const;

/** Union type derived from UgelType values */
export type Ugel = (typeof UgelType)[keyof typeof UgelType];

/** UGEL options for select/dropdown components (with "UGEL - " prefix) */
export const UGEL_OPTIONS: SelectOption[] = Object.values(UgelType).map(
  (value) => ({ value, label: `UGEL - ${value}` }),
);
