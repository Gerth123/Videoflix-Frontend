import { Component, ElementRef, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { ApiService } from '../../shared/services/api-service/api.service';
import { ToastService } from '../../shared/services/toast-service/toast.service';
import { RoutingService } from '../../shared/services/routing-service/routing.service';
import Hls from 'hls.js';

@Component({
  selector: 'app-video-player',
  imports: [HeaderComponent],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
})
export class VideoPlayerComponent {
  @ViewChild('videoPlayer') videoPlayerRef: ElementRef | undefined;

  private hls: Hls | undefined;

  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
    private routingService: RoutingService
  ) {}

  ngOnInit(): void {
    this.checkToken();

    if (Hls.isSupported()) {
      this.hls = new Hls();
      this.hls.loadSource('https://path-to-your-hls-stream.m3u8');
      this.hls.attachMedia(this.videoPlayerRef?.nativeElement);
      
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS stream loaded successfully');
      });
    } else if (this.videoPlayerRef?.nativeElement.canPlayType('application/vnd.apple.mpegurl')) {
      this.videoPlayerRef.nativeElement.src = 'https://path-to-your-hls-stream.m3u8';
    }
  }

  checkToken() {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      this.routingService.navigateTo('');
      setTimeout(() => this.toastService.show('Bitte anmelden oder registrieren', 'info'), 300);
    }
  }

  ngOnDestroy(): void {
    if (this.hls) {
      this.hls.destroy();
    }
  }
}
