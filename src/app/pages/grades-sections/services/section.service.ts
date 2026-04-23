import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Section, SectionCreate, SectionUpdate } from '../models/section.model';

/**
 * Section Service
 * Implements Single Responsibility Principle (SRP) - Handles only section data operations
 */
@Injectable({
  providedIn: 'root',
})
export class SectionService {
  private readonly apiUrl = `${environment.apiBaseUrl}/sections`;
  
  constructor(private http: HttpClient) {}

  /**
   * Get all sections
   * @returns Observable of section array
   */
  getAllSections(): Observable<Section[]> {
    return this.http.get<Section[]>(this.apiUrl);
  }

  /**
   * Get section by ID
   * @param id - Section ID
   * @returns Observable of section
   */
  getSectionById(id: string): Observable<Section> {
    return this.http.get<Section>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new section
   * @param newSection - Create section data transfer object
   * @returns Observable of created section
   */
  createSection(newSection: SectionCreate): Observable<Section> {
    return this.http.post<Section>(this.apiUrl, newSection);
  }

  /**
   * Update existing section
   * @param id - Section ID
   * @param dto - Update section data transfer object
   * @returns Observable of updated section
   */
  updateSection(id: string, dto: SectionUpdate): Observable<Section> {
    return this.http.put<Section>(`${this.apiUrl}/${id}`, dto);
  }

  /**
   * Delete section
   * @param id - Section ID
   * @returns Observable of void
   */
  deleteSection(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
