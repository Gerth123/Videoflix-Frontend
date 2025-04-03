import { Component, Input } from '@angular/core';
import { RoutingService } from '../services/routing-service/routing.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [NgClass],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  @Input() videoOfferRoute: boolean = false;

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
