import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Level, LevelCreate, LevelUpdate } from '../models/level.model';

/**
 * Level Service
 * Implements Single Responsibility Principle (SRP) - Handles only level data operations
 */
@Injectable({
  providedIn: 'root',
})
export class LevelService {
  private readonly apiUrl = `${environment.apiBaseUrl}/levels`;
  
  constructor(private http: HttpClient) {}

  /**
   * Get all levels
   * @returns Observable of level array
   */
  getAllLevels(): Observable<Level[]> {
    return this.http.get<Level[]>(this.apiUrl);
  }

  /**
   * Get level by ID
   * @param id - Level ID
   * @returns Observable of level
   */
  getLevelById(id: number): Observable<Level> {
    return this.http.get<Level>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new level
   * @param newLevel - Create level data transfer object
   * @returns Observable of created level
   */
  createLevel(newLevel: LevelCreate): Observable<Level> {
    return this.http.post<Level>(this.apiUrl, newLevel);
  }

  /**
   * Update existing level
   * @param id - Level ID
   * @param dto - Update level data transfer object
   * @returns Observable of updated level
   */
  updateLevel(id: number, dto: LevelUpdate): Observable<Level> {
    return this.http.put<Level>(`${this.apiUrl}/${id}`, dto);
  }

  /**
   * Delete level
   * @param id - Level ID
   * @returns Observable of void
   */
  deleteLevel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
