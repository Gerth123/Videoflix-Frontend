import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  emailFromDashboard: string = '';
  poster: string = '';
  bigThumbnailUrl: string = '';
  bigThumbnailTitle: string = '';
  bigThumbnailDescription: string = '';

  constructor(private router: Router) {}

  /**
   * Navigates to the chosen route
   *
   * @param route The route to navigate to
   */
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  /**
   * Sets the poster property and stores it in localStorage.
   *
   * @param poster The poster value to be set and stored.
   */
  setPoster(poster: string): void {
    this.poster = poster;
    localStorage.setItem('poster', poster);
  }

  /**
   * Sets the bigThumbnail properties based on the given video object for the mobile player.
   *
   * @param video The video object to set the properties from.
   */
  setMobilePoster(video: any): void {
    this.bigThumbnailDescription = video.description;
    this.bigThumbnailTitle = video.title;
    this.bigThumbnailUrl = video.thumbnailUrl;
  }

  /**
   * Retrieves the current poster value.
   *
   * @returns The poster value from memory if available;
   * otherwise, retrieves it from localStorage. Returns an empty string if neither is set.
   */
  getPoster(): string {
    if (this.poster) return this.poster;
    return localStorage.getItem('poster') || '';
  }
}
