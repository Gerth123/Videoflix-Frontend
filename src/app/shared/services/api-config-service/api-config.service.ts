import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiConfigService {
  readonly API_BASE_URL = 'http://127.0.0.1:8000/api/';
  readonly STATIC_BASE_URL = 'http://127.0.0.1:8000/';
  readonly LOGIN_URL = 'login/';
  readonly REGISTER_URL = 'registration/';
  readonly PROFILE_URL = 'profile/';
  readonly PROFILES_URL = 'profiles/';

  readonly PAGE_SIZE = 6;

  constructor() {}


  /**
   * Returns the full URL for the given API endpoint
   * @param endpoint The relative endpoint URL
   * @returns The full URL
   */
  getFullUrl(endpoint: string): string {
    return `${this.API_BASE_URL}${endpoint}`;
  }
}
