import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  emailFromDashboard: string = '';
  poster: string = '';

  constructor(private router: Router) {}

  /**
   * Navigates to the chosen route
   *
   * @param route The route to navigate to
   */
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  setPoster(poster: string): void {
    this.poster = poster;
    localStorage.setItem('poster', poster);
  }

  getPoster(): string {
    if (this.poster) return this.poster;
    return localStorage.getItem('poster') || '';
  }
}
