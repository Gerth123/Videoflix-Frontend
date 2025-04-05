import { Component, Input } from '@angular/core';
import { RoutingService } from '../services/routing-service/routing.service';
import { NgClass, NgIf } from '@angular/common';
import { ToastService } from '../services/toast-service/toast.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [NgIf, NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() isLoggedIn: boolean = false;
  @Input() videoOfferRoute: boolean = false;
  @Input() videoPlayerRoute: boolean = false;
  @Input() legalInformationRoute: boolean = false;

  constructor(private routingService: RoutingService, private toastService: ToastService, private location: Location) { }

  navigateTo(route: string): void {
    this.routingService.navigateTo(route);

    if (route === 'log-in') {
      localStorage.clear();
      this.toastService.show('Du wurdest erfolgreich abgemeldet', 'success');
    }
  }

  goBack(): void {
    this.location.back();
  }
}
