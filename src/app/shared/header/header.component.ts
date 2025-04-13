import { Component, Input, SimpleChanges } from '@angular/core';
import { RoutingService } from '../services/routing-service/routing.service';
import { NgClass, NgIf } from '@angular/common';
import { ToastService } from '../services/toast-service/toast.service';
import { Location } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-header',
  imports: [NgIf, NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() isLoggedIn: boolean = false;
  @Input() videoOfferRoute: boolean = false;
  @Input() videoPlayerRoute: boolean = false;
  @Input() legalInformationRoute: boolean = false;
  @Input() videoTitle: string = 'Eruption at sunset';
  isMobilePlayer: boolean = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  public isMobile: boolean = false;

  constructor(
    private routingService: RoutingService,
    private toastService: ToastService,
    private location: Location,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isMobileDevice']) {
      const prev = changes['isMobileDevice'].previousValue;
      const curr = changes['isMobileDevice'].currentValue;
      console.log('isMobileDevice changed from', prev, 'to', curr);
  
      // Hier kannst du reagieren (z. B. Logo tauschen, UI anpassen, etc.)
    }
  }
  

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
