import { Gender } from '../../../shared/models/person.model';
import { StudentStatus } from '../../../shared/constants/student-status.constant';

/**
 * Main Student interface with strict types.
 * Matches backend `StudentRead` schema.
 */
export interface Student {
  readonly id: number;
  paternalSurname: string;
  maternalSurname: string;
  name: string;
  dni: string;
  gender: Gender;
  birthDate?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  level?: string | null;
  grade?: string | null;
  status: StudentStatus;
  economicLevelId: number;
  economicLevelName?: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Data Transfer Object for creating students.
 * Matches backend `StudentCreate` schema.
 */
export interface CreateStudentDto {
  paternalSurname: string;
  maternalSurname: string;
  name: string;
  dni: string;
  gender: Gender;
  birthDate?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  level?: string | null;
  grade?: string | null;
  status: StudentStatus;
  economicLevelId: number;
}

/**
 * Data Transfer Object for updating students.
 * Matches backend `StudentUpdate` schema (all fields are optional).
 */
export interface UpdateStudentDto {
  paternalSurname?: string | null;
  maternalSurname?: string | null;
  name?: string | null;
  dni?: string | null;
  gender?: Gender | null;
  birthDate?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  level?: string | null;
  grade?: string | null;
  status?: StudentStatus | null;
  economicLevelId?: number | null;
}

/**
 * Form data interface for typing the Reactive Form.
 */
export interface StudentFormData {
  paternalSurname: string;
  maternalSurname: string;
  name: string;
  dni: string;
  gender: Gender;
  birthDate?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  level?: string | null;
  grade?: string | null;
  status: StudentStatus;
  economicLevelId: string; // The form select gives a string which we'll convert to number
}
