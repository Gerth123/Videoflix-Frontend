import { ChangeDetectorRef, Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { NgIf } from '@angular/common';
import { RoutingService } from '../../shared/services/routing-service/routing.service';
import { filter, Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-video-description',
  imports: [HeaderComponent, NgIf],
  templateUrl: './video-description.component.html',
  styleUrl: './video-description.component.scss',
})
export class VideoDescriptionComponent {
  public loading: boolean = true;
  public API_BASE_URL: string = 'http://127.0.0.1:8000';
  public bigThumbnailUrl: string = '';
  public bigThumbnailTitle: string = '';
  public bigThumbnailDescription: string = '';

  private routerSub = new Subscription();

  constructor(
    private routingService: RoutingService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedVideo = sessionStorage.getItem('videoData');
    if (storedVideo) {
      const video = JSON.parse(storedVideo);
      this.bigThumbnailUrl = video.thumbnailUrl;
      this.bigThumbnailTitle = video.title;
      this.bigThumbnailDescription = video.description;
      this.loading = false;
    } else {
      console.warn('Keine Video-Daten im SessionStorage gefunden');
    }
  }


  navigateToVideoPlayer(videoUrl: string) {
    const regex = /\/thumbnails\/([^_]+)/;
    const match = videoUrl.match(regex);
    if (match && match[1]) {
      this.routingService.setPoster(this.API_BASE_URL + videoUrl);
      const videoId = match[1].replace('.jpg', '');
      this.routingService.navigateTo(`/video-player/${videoId}`);
    } else {
      console.log('Kein Video ID gefunden');
    }
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }
}
