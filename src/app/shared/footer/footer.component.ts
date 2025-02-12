import { Component } from '@angular/core';
import { RoutingService } from '../services/routing-service/routing.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  constructor(private routingService: RoutingService) { }

  /**
   * Navigates to the chosen route
   * 
   * @param route The route to navigate to
   */
  navigateTo(route: string): void {
    this.routingService.navigateTo(route);
  }
}
