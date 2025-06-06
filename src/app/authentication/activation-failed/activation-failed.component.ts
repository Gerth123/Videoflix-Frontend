import { Component } from '@angular/core';
import { RoutingService } from '../../shared/services/routing-service/routing.service';

@Component({
  selector: 'app-activation-failed',
  imports: [],
  templateUrl: './activation-failed.component.html',
  styleUrl: './activation-failed.component.scss'
})
export class ActivationFailedComponent {

  constructor(private routingService: RoutingService) { }

  /**
   * Navigates to the specified route using the RoutingService.
   *
   * @param route The route to navigate to.
   */
  navigateTo(route: string): void {
    this.routingService.navigateTo(route);
  }
}
