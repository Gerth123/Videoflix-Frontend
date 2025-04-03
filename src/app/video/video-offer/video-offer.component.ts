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
  genres = [
    {
      name: 'New on Videoflix',
      movies: [
        {
          thumbnailUrl: 'http://127.0.0.1:8000/media/thumbnails/21_m1qlC1Q.jpg',
        },
        {
          thumbnailUrl: 'http://127.0.0.1:8000/media/thumbnails/21_m1qlC1Q.jpg',
        },
        {
          thumbnailUrl: 'http://127.0.0.1:8000/media/thumbnails/21_m1qlC1Q.jpg',
        },
        {
          thumbnailUrl: 'http://127.0.0.1:8000/media/thumbnails/21_m1qlC1Q.jpg',
        },
      ],
    },
    {
      name: 'Action',
      movies: [
        {
          thumbnailUrl: 'http://127.0.0.1:8000/media/thumbnails/21_m1qlC1Q.jpg',
        },
        {
          thumbnailUrl: 'http://127.0.0.1:8000/media/thumbnails/21_m1qlC1Q.jpg',
        },
        {
          thumbnailUrl: 'http://127.0.0.1:8000/media/thumbnails/21_m1qlC1Q.jpg',
        },
        {
          thumbnailUrl: 'http://127.0.0.1:8000/media/thumbnails/21_m1qlC1Q.jpg',
        },
      ],
    },
    {
      name: 'Comedy',
      movies: [
        {
          thumbnailUrl: 'http://127.0.0.1:8000/media/thumbnails/21_m1qlC1Q.jpg',
        },
        {
          thumbnailUrl: 'http://127.0.0.1:8000/media/thumbnails/21_m1qlC1Q.jpg',
        },
        {
          thumbnailUrl: 'http://127.0.0.1:8000/media/thumbnails/21_m1qlC1Q.jpg',
        },
        {
          thumbnailUrl: 'http://127.0.0.1:8000/media/thumbnails/21_m1qlC1Q.jpg',
        },
      ],
    },
    {
      name: 'Documentary',
      movies: [
        {
          thumbnailUrl: 'http://127.0.0.1:8000/media/thumbnails/21_m1qlC1Q.jpg',
        },
        {
          thumbnailUrl: 'http://127.0.0.1:8000/media/thumbnails/21_m1qlC1Q.jpg',
        },
        {
          thumbnailUrl: 'http://127.0.0.1:8000/media/thumbnails/21_m1qlC1Q.jpg',
        },
        {
          thumbnailUrl: 'http://127.0.0.1:8000/media/thumbnails/21_m1qlC1Q.jpg',
        },
      ],
    },
  ];

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

  scrollLeft(slider: HTMLElement) {
    slider.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight(slider: HTMLElement) {
    slider.scrollBy({ left: 300, behavior: 'smooth' });
  }
}
