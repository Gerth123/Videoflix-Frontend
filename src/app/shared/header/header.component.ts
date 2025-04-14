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

  constructor(private routingService: RoutingService, private toastService: ToastService, private location: Location, private breakpointObserver: BreakpointObserver) {}

  /**
   * ngOnInit is called when the component is initialized. It subscribes to the
   * BreakpointObserver and checks whether the user is on a mobile device or not.
   * If so, it sets the 'isMobile' flag to true.
   */
  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile = result.matches;
    });
  }

  /**
   * ngOnChanges is called when the component's inputs are changed. It checks if
   * the 'isMobileDevice' input has changed and if so, updates the 'isMobile' flag
   * accordingly.
   * @param changes - The changed inputs.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isMobileDevice']) {
      const prev = changes['isMobileDevice'].previousValue;
      const curr = changes['isMobileDevice'].currentValue;
      if (prev !== curr) {
        this.isMobile = curr;
      }
    }
  }

  /**
   * Navigates to the specified route using the RoutingService. If the route is
   * 'log-in', it will also clear the localStorage and show a toast message.
   * @param route The route to navigate to.
   */
  navigateTo(route: string): void {
    this.routingService.navigateTo(route);

    if (route === 'log-in') {
      localStorage.clear();
      this.toastService.show('Du wurdest erfolgreich abgemeldet', 'success');
    }
  }

  /**
   * Goes back to the previous page by calling the 'back' method on the
   * Location service.
   */
  goBack(): void {
    this.location.back();
  }
}
