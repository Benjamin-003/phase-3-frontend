import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, catchError, of, tap } from 'rxjs';
import { AnalyticsResponse, Tool } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'https://tt-jsonserver-01.alt-tools.tech/api';

  // Signals pour suivre l'état interne (idéal pour afficher un spinner ou une date de refresh)
  isLoading = signal<boolean>(false);
  lastUpdated = signal<Date | null>(null);

  /**
   * Récupère les statistiques d'analytics par département.
   * Utilisation de 'tap' pour mettre à jour l'horodatage.
   */
  getAnalytics(): Observable<AnalyticsResponse> {
    return this.http.get<AnalyticsResponse>(`${this.apiUrl}/analytics/department-costs`).pipe(
      tap(() => this.lastUpdated.set(new Date())),
      catchError(error => {
        console.error('Erreur Analytics:', error);
        return of({ 
          data: [], 
          summary: { total_company_cost: 0, departments_count: 0, most_expensive_department: 'N/A' } 
        });
      })
    );
  }

  /**
   * Récupère les outils récents.
   * 'tap' est utilisé ici pour loguer le nombre d'outils reçus avant le filtrage.
   */
  getRecentTools(): Observable<Tool[]> {
    return this.http.get<Tool[]>(`${this.apiUrl}/tools`).pipe(
      tap(tools => console.log(`[API] ${tools.length} outils recuperes.`)),
      // On clone le tableau avant de faire un slice/reverse pour ne pas muter la source
      map(tools => [...tools].slice(-5).reverse()),
      catchError(error => {
        console.error('Erreur Tools:', error);
        return of([]);
      })
    );
  }

  /**
   * Agrégation pour le Dashboard.
   * On utilise 'tap' pour gérer l'indicateur de chargement global.
   */
  getDashboardSummary(): Observable<{ analytics: AnalyticsResponse; tools: Tool[] }> {
    this.isLoading.set(true); 

    return forkJoin({
      analytics: this.getAnalytics(),
      tools: this.getRecentTools()
    }).pipe(
      tap({
        next: () => console.log('SUCCESS: Dashboard synchronise avec succes.'),
        error: (err) => console.error('ERROR: Echec de synchronisation:', err),
        finalize: () => this.isLoading.set(false) 
      })
    );
  }
}