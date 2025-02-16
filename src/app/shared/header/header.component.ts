import { Component } from '@angular/core';
import { RoutingService } from '../services/routing-service/routing.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private routingService: RoutingService) { }

  navigateTo(route: string): void {
    this.routingService.navigateTo(route);
  }
}
