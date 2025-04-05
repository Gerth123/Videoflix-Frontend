import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ApiService } from '../../shared/services/api-service/api.service';
import { ToastService } from '../../shared/services/toast-service/toast.service';
import { RoutingService } from '../../shared/services/routing-service/routing.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-video-offer',
  imports: [HeaderComponent, FooterComponent, NgFor],
  templateUrl: './video-offer.component.html',
  styleUrl: './video-offer.component.scss',
})
export class VideoOfferComponent {
  genres: any[] = [];
  public API_BASE_URL: string = 'http://127.0.0.1:8000';

  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
    private routingService: RoutingService
  ) {}

  ngOnInit(): void {
    this.checkToken();
    this.loadGenres();
  }

  checkToken() {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      this.routingService.navigateTo('');
      setTimeout(
        () =>
          this.toastService.show('Bitte anmelden oder registrieren', 'info'),
        300
      );
    }
  }

  navigateTo(path: string) {
    this.routingService.navigateTo(path);
  }

  navigateToVideoPlayer(videoUrl: string) {
    const regex = /\/thumbnails\/([^_]+)/;
    const match = videoUrl.match(regex);
  
    console.log(match);
    if (match && match[1]) {
      // Entfernen von '.jpg' am Ende der extrahierten Video-ID
      const videoId = match[1].replace('.jpg', ''); 
      this.routingService.navigateTo(`/video-player/${videoId}`);
    } else {
      console.log('Kein Video ID gefunden');
    }
  }
  
  
  

  scrollLeft(slider: HTMLElement) {
    slider.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight(slider: HTMLElement) {
    slider.scrollBy({ left: 300, behavior: 'smooth' });
  }

  loadGenres() {
    this.apiService.getGenres().subscribe(
      (data) => {
        this.genres = data;
      },
      (error) => {
        console.error('Fehler beim Abrufen der Genres:', error);
        this.toastService.show('Fehler beim Abrufen der Genres', 'error');
      }
    );
  }
}
