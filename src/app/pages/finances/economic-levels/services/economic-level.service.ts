import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { EconomicLevel, EconomicLevelCreate, EconomicLevelUpdate } from '../models/economic-level.model';

@Injectable({
  providedIn: 'root'
})
export class EconomicLevelService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/economic-levels`;

  getEconomicLevels(): Observable<EconomicLevel[]> {
    return this.http.get<EconomicLevel[]>(this.apiUrl);
  }

  getEconomicLevel(id: number): Observable<EconomicLevel> {
    return this.http.get<EconomicLevel>(`${this.apiUrl}/${id}`);
  }

  createEconomicLevel(data: EconomicLevelCreate): Observable<EconomicLevel> {
    return this.http.post<EconomicLevel>(this.apiUrl, data);
  }

  updateEconomicLevel(id: number, data: EconomicLevelUpdate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  deleteEconomicLevel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
