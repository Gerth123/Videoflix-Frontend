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
  public API_BASE_URL: string = 'https://videoflix.robin-gerth.de/';
  public bigThumbnailUrl: string = '';
  public bigThumbnailTitle: string = '';
  public bigThumbnailDescription: string = '';

  private routerSub = new Subscription();

  constructor(private routingService: RoutingService, private cdr: ChangeDetectorRef, private router: Router) {}

  /**
   * OnInit lifecycle hook. If video data is stored in session storage, it's loaded and displayed.
   * Otherwise, a warning is logged.
   */
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


  /**
   * Extracts the videoId from the given thumbnail URL and navigates to the video player
   * component, passing the videoId as a parameter. The videoId is extracted by using a regex
   * to find the first group of characters after the last underscore in the thumbnail URL.
   * If no match is found, a log warning is logged.
   *
   * @param videoUrl The thumbnail URL to extract the videoId from.
   */
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

  /**
   * Clean up router subscription when component is destroyed.
   */
  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }
}
