import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public API_BASE_URL = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) {}

  /**
   * Stores the given authentication credentials in local storage.
   *
   * @param token - The authentication token.
   * @param userId - The user ID.
   * @param email - The user's email address.
   * @param rememberMe - If true, the user has checked "Remember me" and the credentials should be stored permanently.
   */
  setAuthCredentials(token: string, userId: string, email: string, rememberMe: boolean) {
    localStorage.setItem('auth-token', token);
    localStorage.setItem('auth-user-id', userId);
    localStorage.setItem('auth-user', email);
    localStorage.setItem('remember-me', rememberMe.toString());
  }

  /**
   * Removes authentication credentials from local storage.
   *
   * This method clears the authentication token, user ID, and user email
   * from local storage, effectively logging the user out.
   */
  removeAuthCredentials() {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
    localStorage.removeItem('auth-user-id');
  }

  /**
   * Retrieves the authentication token from local storage.
   *
   * @returns The authentication token if it exists, otherwise null.
   */
  getAuthToken(): string | null {
    return localStorage.getItem('auth-token');
  }

  /**
   * Retrieves the user email from local storage.
   *
   * @returns The user email if it exists, otherwise null.
   */
  getAuthUser(): string | null {
    return localStorage.getItem('auth-user');
  }

  /**
   * Retrieves the user ID from local storage.
   *
   * @returns The user ID if it exists, otherwise null.
   */
  getAuthUserId(): string | null {
    return localStorage.getItem('auth-user-id');
  }

  /**
   * Creates an HttpHeaders object with the authentication token if it exists.
   *
   * The `Authorization` header is set to `Token <token>` if the token is not null.
   * Otherwise, the `Authorization` header is not set.
   *
   * @returns The HttpHeaders object.
   */
  private createHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = this.getAuthToken();
    if (token) {
      headers = headers.set('Authorization', `Token ${token}`);
    }
    return headers;
  }

  /**
   * Performs a GET request to the specified endpoint with authentication headers.
   *
   * @param endpoint - The relative endpoint URL to send the GET request to.
   * @returns An Observable containing the response data from the API.
   */
  getData(endpoint: string): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}${endpoint}`, {
      headers: this.createHeaders(),
    });
  }

  /**
   * Performs a GET request to the specified endpoint without authentication headers.
   *
   * This method does not include the authentication token in the request headers.
   * It is used for endpoints that do not require authentication, such as the login
   * and registration endpoints.
   *
   * @param endpoint - The relative endpoint URL to send the GET request to.
   * @returns A Promise containing the response data from the API.
   */
  getDataWithoutToken(endpoint: string): Promise<any> {
    return firstValueFrom(this.http.get(`${this.API_BASE_URL}${endpoint}`));
  }

  /**
   * Performs a POST request to the specified endpoint with authentication headers.
   *
   * This method sends a FormData object to the provided endpoint URL, including the authentication token
   * in the request headers if it exists.
   *
   * @param endpoint - The relative endpoint URL to send the POST request to.
   * @param data - The FormData object to be sent in the POST request.
   * @returns An Observable containing the response data from the API.
   */
  postData(endpoint: string, data: FormData): Observable<any> {
    return this.http.post(`${this.API_BASE_URL}${endpoint}`, data, {
      headers: this.createHeaders(),
    });
  }

  /**
   * Performs a POST request to the specified endpoint without authentication headers.
   *
   * This method does not include the authentication token in the request headers.
   * It is used for endpoints that do not require authentication, such as the login
   * and registration endpoints.
   *
   * @param endpoint - The relative endpoint URL to send the POST request to.
   * @param data - The data to be sent in the POST request.
   * @returns An Observable containing the response data from the API.
   */
  postDataWithoutToken(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${this.API_BASE_URL}${endpoint}`, data);
  }

  /**
   * Performs a POST request to the specified endpoint with authentication headers and JSON content type.
   *
   * This method sends a JSON object to the provided endpoint URL, including the authentication token
   * in the request headers if it exists.
   *
   * @param endpoint - The relative endpoint URL to send the POST request to.
   * @param data - The data to be sent in the POST request.
   * @returns An Observable containing the response data from the API.
   */
  postDataWJSON(endpoint: string, data: any): Observable<any> {
    const headers = this.createHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${this.API_BASE_URL}${endpoint}`, JSON.stringify(data), { headers });
  }

  /**
   * Performs a PATCH request to the specified endpoint with authentication headers and JSON content type.
   *
   * This method sends a JSON object to the provided endpoint URL, including the authentication token
   * in the request headers if it exists.
   *
   * @param endpoint - The relative endpoint URL to send the PATCH request to.
   * @param data - The data to be sent in the PATCH request.
   * @returns An Observable containing the response data from the API.
   */
  patchDataWoFiles(endpoint: string, data: any): Observable<any> {
    const headers = this.createHeaders().set('Content-Type', 'application/json');
    return this.http.patch(`${this.API_BASE_URL}${endpoint}`, JSON.stringify(data), { headers });
  }

  /**
   * Performs a PATCH request to the specified endpoint with authentication headers.
   *
   * This method sends a FormData object to the provided endpoint URL, including the authentication token
   * in the request headers if it exists.
   *
   * @param endpoint - The relative endpoint URL to send the PATCH request to.
   * @param formData - The FormData object to be sent in the PATCH request.
   * @returns An Observable containing the response data from the API.
   */
  patchData(endpoint: string, formData: FormData): Observable<any> {
    return this.http.patch(`${this.API_BASE_URL}${endpoint}`, formData, {
      headers: this.createHeaders(),
    });
  }

  /**
   * Performs a DELETE request to the specified endpoint with authentication headers.
   *
   * @param endpoint - The relative endpoint URL to send the DELETE request to.
   * @returns An Observable containing the response data from the API.
   */
  deleteData(endpoint: string): Observable<any> {
    return this.http.delete(`${this.API_BASE_URL}${endpoint}`, {
      headers: this.createHeaders(),
    });
  }

  /**
   * Checks if the given email address already exists in the database.
   *
   * Performs a GET request to the profiles endpoint and checks if the given email exists in the response.
   * If the request fails, it returns false.
   *
   * @param email - The email address to check for existence.
   * @returns A promise that resolves to true if the email exists, false otherwise.
   */
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const response = await this.getDataWithoutToken(`profiles/`);
      const emailExists = response.some((user: any) => user.email === email);
      return emailExists;
    } catch (error) {
      console.error('Fehler beim Überprüfen der E-Mail:', error);
      return false;
    }
  }

  /**
   * Gets a list of available genres from the API.
   *
   * Performs a GET request to the genres endpoint and returns the response as an Observable.
   * The response is expected to be an array of objects with the following structure:
   * - id: number
   * - name: string
   * - description: string
   *
   * @returns An Observable containing the response data from the API.
   */
  getGenres(): Observable<any> {
    return this.getData('genres/');
  }
}
