import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NetworkService } from '../../shared/services/network-service/network.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../shared/services/api-service/api.service';
import { ToastService } from '../../shared/services/toast-service/toast.service';
import videojs from 'video.js';
import { RoutingService } from '../../shared/services/routing-service/routing.service';

@Component({
  selector: 'app-video-player',
  imports: [HeaderComponent, FormsModule],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
})
export class VideoPlayerComponent {
  @ViewChild('videoPlayer', { static: false }) videoElementRef!: ElementRef;
  isPlaying = false;
  showControls = false;
  duration = 0;
  currentTime = 0;
  videoQuality: string = 'auto';
  videoSrc: string = '';
  videoId: string = '';
  private connectionListener: any;
  preload: string = 'auto';
  poster = 'http://127.0.0.1:8000/media/thumbnails/19.jpg';

  constructor(
    private networkService: NetworkService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toastService: ToastService,
    private routingService: RoutingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.poster = this.routingService.getPoster();
    this.videoQuality = this.networkService.getNetworkSpeed();
    this.videoId = this.route.snapshot.paramMap.get('videoId') || '';
    this.setVideoSrc();
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.connectionListener = () => {
        const newQuality = this.networkService.getNetworkSpeed();
        if (this.videoQuality !== newQuality) {
          this.videoQuality = newQuality;
          const qualityMessage = `Netzwerkqualität geändert: ${newQuality}`;
          this.toastService.show(qualityMessage, 'info');
          this.setVideoSrc();
        }
      };
      connection.addEventListener('change', this.connectionListener);
    }
  }

  ngAfterViewInit() {
    const videoElement = this.videoElementRef.nativeElement;
    videoElement.onplay = () => {
      this.isPlaying = true;
    };
    videoElement.onpause = () => {
      this.isPlaying = false;
    };
    videoElement.ontimeupdate = () => {
      this.currentTime = videoElement.currentTime;
      this.duration = videoElement.duration;
    };
  }

  ngOnDestroy(): void {
    if (this.connectionListener && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.removeEventListener('change', this.connectionListener);
    }
  }

  setVideoSrc() {
    const videoBaseUrl = 'videos/';
    const videoDetail = videoBaseUrl + this.videoId;
    const actualVideoQuality = 'video_' + this.videoQuality;
    const availableQualities = [
      '1080p',
      '720p',
      '480p',
      '360p',
      '240p',
      '144p',
    ];

    this.apiService.getData(videoDetail).subscribe(
      (response) => {
        const videoData = Array.isArray(response) ? response[0] : response;
        let selectedQuality = actualVideoQuality;
        if (videoData[selectedQuality] === null) {
          console.warn(
            `Gewählte Auflösung ${this.videoQuality} nicht verfügbar. Suche nach nächster verfügbaren Qualität.`
          );
          for (let quality of availableQualities) {
            const qualityKey = 'video_' + quality;
            if (qualityKey in videoData && videoData[qualityKey] !== null) {
              selectedQuality = qualityKey;
              break;
            }
          }
        }

        if (
          selectedQuality in videoData &&
          videoData[selectedQuality] !== null
        ) {
          this.videoSrc = videoData[selectedQuality];
          console.log(this.videoSrc);

          // Erzwinge eine View-Update durch Angular
          this.cdr.detectChanges();

          setTimeout(() => {
            const videoElement: HTMLVideoElement | null =
              this.videoElementRef.nativeElement;
            if (videoElement) {
              videoElement.load(); // Lade das Video neu
            }
          }, 100);
        } else {
          console.error('Keine verfügbare Auflösung für dieses Video.');
          this.videoSrc = '';
        }
      },
      (error) => {
        console.error('Fehler beim Abrufen der Video-Details:', error);
      }
    );
  }

  // togglePlayPause() {
  //   const video: HTMLVideoElement = this.videoPlayer.nativeElement;
  //   if (video.paused) {
  //     video.play();
  //     this.isPlaying = true;
  //   } else {
  //     video.pause();
  //     this.isPlaying = false;
  //   }
  // }

  // updateTime() {
  //   const video: HTMLVideoElement = this.videoPlayer.nativeElement;
  //   this.currentTime = video.currentTime;
  // }

  // setDuration() {
  //   const video: HTMLVideoElement = this.videoPlayer.nativeElement;
  //   this.duration = video.duration;
  // }

  // seekVideo() {
  //   const video: HTMLVideoElement = this.videoPlayer.nativeElement;
  //   video.currentTime = this.currentTime;
  // }

  rewind() {
    const videoElement: HTMLVideoElement = this.videoElementRef.nativeElement;
    if (videoElement) {
      videoElement.currentTime -= 10;
    }
  }

  fastForward() {
    const videoElement: HTMLVideoElement = this.videoElementRef.nativeElement;
    if (videoElement) {
      videoElement.currentTime += 10;
    }
  }

  // toggleFullscreen() {
  //   const video: HTMLVideoElement = this.videoPlayer.nativeElement;
  //   if (video.requestFullscreen) {
  //     video.requestFullscreen();
  //   }
  // }
}
