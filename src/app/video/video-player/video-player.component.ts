import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NetworkService } from '../../shared/services/network-service/network.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../shared/services/api-service/api.service';
import { ToastService } from '../../shared/services/toast-service/toast.service';
import { RoutingService } from '../../shared/services/routing-service/routing.service';

@Component({
  selector: 'app-video-player',
  imports: [HeaderComponent, FormsModule, NgIf],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
})
export class VideoPlayerComponent {
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef;
  @ViewChild('videoContainer') videoContainer!: ElementRef;

  isPlaying = false;
  title: string = '';
  duration: number = 0;
  currentTime: number = 0;
  videoQuality: string = 'auto';
  videoSrc: string = '';
  videoId: string = '';
  isMuted = false;
  volume: number = 1;
  videoSpeed: number = 1;
  dropdownVisible: boolean = false;
  private connectionListener: any;
  loading: boolean = true;
  poster = 'http://127.0.0.1:8000/media/thumbnails/19.jpg';
  isFullscreen: boolean = false;
  isControlsVisible: boolean = true;
  timeout: any;
  fullscreenChangeHandler: any;

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
      this.fullscreenChangeHandler = this.onFullscreenChange.bind(this);
      document.addEventListener(
        'fullscreenchange',
        this.fullscreenChangeHandler
      );
      document.addEventListener(
        'webkitfullscreenchange',
        this.fullscreenChangeHandler
      );
      document.addEventListener(
        'mozfullscreenchange',
        this.fullscreenChangeHandler
      );
    }
  }

  ngAfterViewInit() {
    const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;

    const updateProgress = () => {
      this.currentTime = Math.floor(videoElement.currentTime);
      this.duration = Math.floor(videoElement.duration);
      if (!videoElement.paused && !videoElement.ended) {
        requestAnimationFrame(updateProgress);
      }
    };

    videoElement.addEventListener('play', () => {
      this.isPlaying = true;
      requestAnimationFrame(updateProgress);
    });

    videoElement.addEventListener('pause', () => {
      this.isPlaying = false;
    });

    videoElement.addEventListener('ended', () => {
      this.currentTime = this.duration;
      this.isPlaying = false;
      this.showControls();
      this.showMouse();
    });

    videoElement.addEventListener('loadedmetadata', () => {
      this.duration = Math.floor(videoElement.duration);
    });
  }

  ngOnDestroy(): void {
    if (this.connectionListener && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.removeEventListener('change', this.connectionListener);
    }
    document.removeEventListener(
      'fullscreenchange',
      this.fullscreenChangeHandler
    );
    document.removeEventListener(
      'webkitfullscreenchange',
      this.fullscreenChangeHandler
    );
    document.removeEventListener(
      'mozfullscreenchange',
      this.fullscreenChangeHandler
    );
  }

  onFullscreenChange() {
    this.isFullscreen = !!document.fullscreenElement;
    this.adjustDropdownPosition();
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
        this.title = videoData.title;
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

          this.cdr.detectChanges();

          setTimeout(() => {
            const videoElement: HTMLVideoElement | null =
              this.videoPlayer.nativeElement;
            if (videoElement) {
              videoElement.load();
            }
          }, 100);
          this.loading = false;
        } else {
          console.error('Keine verfügbare Auflösung für dieses Video.');
          this.videoSrc = '';
          this.loading = false;
        }
      },
      (error) => {
        console.error('Fehler beim Abrufen der Video-Details:', error);
        this.loading = false;
      }
    );
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.showControls();
    this.showMouse();
    clearTimeout(this.timeout);
    if (this.isPlaying) {
      this.timeout = setTimeout(() => {
        this.hideControls();
        this.hideMouse();
      }, 3000);
    }
  }

  showControls() {
    this.isControlsVisible = true;
    const header = document.querySelector('app-header');
    const controls = document.querySelector('.controls-overlay');

    if (header) header.classList.remove('hidden');
    if (controls) controls.classList.remove('hidden');
  }

  hideControls() {
    this.isControlsVisible = false;
    const header = document.querySelector('app-header');
    const controls = document.querySelector('.controls-overlay');

    if (header) header.classList.add('hidden');
    if (controls) controls.classList.add('hidden');
  }

  showMouse() {
    if (this.videoContainer) {
      this.videoContainer.nativeElement.style.cursor = 'default';
    }
  }

  hideMouse() {
    if (this.videoContainer) {
      this.videoContainer.nativeElement.style.cursor = 'none';
    }
  }

  togglePlayPause() {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    if (this.loading) {
      console.log('Das Video wird noch geladen');
      return;
    }
    if (Math.floor(video.currentTime) >= Math.floor(video.duration)) {
      video.currentTime = 0;
    }
    if (video.paused) video.play();
    else video.pause();

    this.isPlaying = !video.paused;
  }

  updateTime() {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    this.currentTime = video.currentTime;
  }

  setDuration() {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    this.duration = video.duration;
  }

  onMetadataLoaded() {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    this.duration = video.duration;
  }

  onTimeUpdate() {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    this.currentTime = video.currentTime;
  }

  seekVideo(event: Event) {
    const input = event.target as HTMLInputElement;
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    video.currentTime = Number(input.value);
  }

  rewind() {
    const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
    if (videoElement) {
      videoElement.currentTime -= 10;
    }
  }

  fastForward() {
    const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
    if (videoElement) {
      videoElement.currentTime += 10;
    }
  }

  setVolume() {
    const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
    videoElement.volume = this.volume;
  }

  setSpeed(speed: number) {
    const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
    videoElement.playbackRate = speed;
    this.videoSpeed = speed;
    this.dropdownVisible = false;
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  toggleFullscreen() {
    const container: HTMLElement = this.videoContainer.nativeElement;

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if ((container as any).mozRequestFullScreen) {
        (container as any).mozRequestFullScreen();
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      }
    } else {
      if (document.fullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        }
      }
    }
  }

  adjustDropdownPosition() {
    const dropdown = document.querySelector('.dropdown') as HTMLElement;
    if (dropdown) {
      if (this.isFullscreen) {
        dropdown.style.bottom = '60px';
      } else {
        dropdown.style.bottom = '40px';
      }
    }
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds) || seconds === undefined) {
      return '00:00';
    }
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const paddedSecs = secs < 10 ? '0' + secs : secs;
    const paddedMins = minutes < 10 ? '0' + minutes : minutes;
    return `${paddedMins}:${paddedSecs}`;
  }
}
