import { Component, Input } from '@angular/core';
import { RoutingService } from '../services/routing-service/routing.service';
import { NgIf } from '@angular/common';
import { ToastService } from '../services/toast-service/toast.service';

@Component({
  selector: 'app-header',
  imports: [NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() isLoggedIn: boolean = false;
  @Input() videoOfferRoute: boolean = false;

  constructor(private routingService: RoutingService, private toastService: ToastService) { }

  navigateTo(route: string): void {
    this.routingService.navigateTo(route);

    if (route === '') {
      localStorage.clear();
      this.toastService.show('Du wurdest erfolgreich abgemeldet', 'success');
    }
  }
}
