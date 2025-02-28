import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private API_BASE_URL = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) {}

  // Authentifizierungsdaten speichern
  setAuthCredentials(token: string, userId: string, username: string) {
    localStorage.setItem('auth-token', token);
    localStorage.setItem('auth-user', username);
    localStorage.setItem('auth-user-id', userId);
  }

  // Authentifizierungsdaten entfernen
  removeAuthCredentials() {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
    localStorage.removeItem('auth-user-id');
  }

  // Authentifizierungsdaten abrufen
  getAuthToken(): string | null {
    return localStorage.getItem('auth-token');
  }

  getAuthUser(): string | null {
    return localStorage.getItem('auth-user');
  }

  getAuthUserId(): string | null {
    return localStorage.getItem('auth-user-id');
  }

  // Header erstellen
  private createHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = this.getAuthToken();
    if (token) {
      headers = headers.set('Authorization', `Token ${token}`);
    }
    return headers;
  }

  // GET-Anfrage
  getData(endpoint: string): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}${endpoint}`, { headers: this.createHeaders() });
  }

  // POST-Anfrage (FormData)
  postData(endpoint: string, data: FormData): Observable<any> {
    return this.http.post(`${this.API_BASE_URL}${endpoint}`, data, { headers: this.createHeaders() });
  }

  // POST-Anfrage (JSON)
  postDataWJSON(endpoint: string, data: any): Observable<any> {
    const headers = this.createHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${this.API_BASE_URL}${endpoint}`, JSON.stringify(data), { headers });
  }

  // PATCH-Anfrage (JSON)
  patchDataWoFiles(endpoint: string, data: any): Observable<any> {
    const headers = this.createHeaders().set('Content-Type', 'application/json');
    return this.http.patch(`${this.API_BASE_URL}${endpoint}`, JSON.stringify(data), { headers });
  }

  // PATCH-Anfrage (FormData)
  patchData(endpoint: string, formData: FormData): Observable<any> {
    return this.http.patch(`${this.API_BASE_URL}${endpoint}`, formData, { headers: this.createHeaders() });
  }

  // DELETE-Anfrage
  deleteData(endpoint: string): Observable<any> {
    return this.http.delete(`${this.API_BASE_URL}${endpoint}`, { headers: this.createHeaders() });
  }
}
