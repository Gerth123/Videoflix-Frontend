import { Component } from '@angular/core';
import { RoutingService } from '../../shared/services/routing-service/routing.service';

@Component({
  selector: 'app-account-confirmed',
  imports: [],
  templateUrl: './account-confirmed.component.html',
  styleUrl: './account-confirmed.component.scss'
})
export class AccountConfirmedComponent {

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
