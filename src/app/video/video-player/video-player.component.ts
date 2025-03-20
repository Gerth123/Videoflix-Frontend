import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { ApiService } from '../../shared/services/api-service/api.service';
import { ToastService } from '../../shared/services/toast-service/toast.service';
import { RoutingService } from '../../shared/services/routing-service/routing.service';

@Component({
  selector: 'app-video-player',
  imports: [HeaderComponent],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
})
export class VideoPlayerComponent {
  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
    private routingService: RoutingService
  ) {}

  ngOnInit(): void {
    this.checkToken();
  }

  checkToken() {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      this.routingService.navigateTo('');
      setTimeout(() => this.toastService.show('Bitte anmelden oder registrieren', 'info'), 300);
    }
  }
}
