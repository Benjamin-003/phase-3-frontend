import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, map, of } from 'rxjs';
import { Tool, Analytics, Department, User } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'https://tt-jsonserver-01.alt-tools.tech';

  // Signals pour tracking du state
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  /**
   * 📊 GET /analytics - Dashboard metrics & KPIs
   */
  getAnalytics(): Observable<Analytics> {
    this.isLoading.set(true);
    return this.http.get<Analytics>(`${this.API_URL}/analytics`).pipe(
      tap(() => this.isLoading.set(false)),
      catchError(this.handleError<Analytics>('getAnalytics'))
    );
  }

  /**
   * 🔧 GET /tools - All tools (with optional filters)
   */
  getTools(params?: {
    status?: string;
    _sort?: string;
    _order?: 'asc' | 'desc';
    _limit?: number;
  }): Observable<Tool[]> {
    return this.http.get<Tool[]>(`${this.API_URL}/tools`, { params }).pipe(
      catchError(this.handleError<Tool[]>('getTools', []))
    );
  }

  /**
   * 📅 GET /tools?_sort=updated_at&_order=desc&_limit=8
   * Recent tools for dashboard table
   */
  getRecentTools(): Observable<Tool[]> {
    return this.getTools({
      _sort: 'updated_at',
      _order: 'desc',
      _limit: 8
    });
  }

  /**
   * 🏢 GET /departments
   */
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.API_URL}/departments`).pipe(
      catchError(this.handleError<Department[]>('getDepartments', []))
    );
  }

  /**
   * 👥 GET /users
   */
  getUsers(params?: { active?: boolean; department_id?: number }): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/users`, { params }).pipe(
      catchError(this.handleError<User[]>('getUsers', []))
    );
  }

  /**
   * 🔍 GET /tools?name_like=search
   * Search tools by name
   */
  searchTools(query: string): Observable<Tool[]> {
    return this.http.get<Tool[]>(`${this.API_URL}/tools`, {
      params: { name_like: query }
    }).pipe(
      catchError(this.handleError<Tool[]>('searchTools', []))
    );
  }

  /**
   * ❌ Centralized error handler
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      this.error.set(`Error: ${error.message}`);
      this.isLoading.set(false);
      return of(result as T);
    };
  }
}
