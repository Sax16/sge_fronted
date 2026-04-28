import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Grade, GradeCreate, GradeUpdate } from '../models/grade.model';

/**
 * Grade Service
 * Implements Single Responsibility Principle (SRP) - Handles only grade data operations
 */
@Injectable({
  providedIn: 'root',
})
export class GradeService {
  private readonly apiUrl = `${environment.apiBaseUrl}/grades`;
  private readonly http = inject(HttpClient);

  /**
   * Get all grades
   * @returns Observable of grade array
   */
  getAllGrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(this.apiUrl);
  }

  /**
   * Get grade by ID
   * @param id - Grade ID
   * @returns Observable of grade
   */
  getGradeById(id: number): Observable<Grade> {
    return this.http.get<Grade>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new grade
   * @param newGrade - Create grade data transfer object
   * @returns Observable of created grade
   */
  createGrade(newGrade: GradeCreate): Observable<Grade> {
    return this.http.post<Grade>(this.apiUrl, newGrade);
  }

  /**
   * Update existing grade
   * @param id - Grade ID
   * @param dto - Update grade data transfer object
   * @returns Observable of updated grade
   */
  updateGrade(id: number, dto: GradeUpdate): Observable<Grade> {
    return this.http.put<Grade>(`${this.apiUrl}/${id}`, dto);
  }

  /**
   * Delete grade
   * @param id - Grade ID
   * @returns Observable of void
   */
  deleteGrade(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
