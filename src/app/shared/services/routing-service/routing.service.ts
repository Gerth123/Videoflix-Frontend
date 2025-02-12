import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {


  constructor(private router: Router) { }

   /**
   * Navigates to the chosen route
   * 
   * @param route The route to navigate to
   */
   navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
