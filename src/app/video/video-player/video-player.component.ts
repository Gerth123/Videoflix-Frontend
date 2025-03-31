import { Component, ElementRef, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NetworkService } from '../../shared/services/network-service/network.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../shared/services/api-service/api.service';

@Component({
  selector: 'app-video-player',
  imports: [HeaderComponent, NgIf, FormsModule],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
})
export class VideoPlayerComponent {
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef;
  isPlaying = false;
  showControls = false;
  duration = 0;
  currentTime = 0;
  videoQuality: string = 'auto';
  videoSrc: string = '';
  videoId: string = '';

  constructor(
    private networkService: NetworkService,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.videoQuality = this.networkService.getNetworkSpeed();
    this.videoId = this.route.snapshot.paramMap.get('videoName') || '';
    this.setVideoSrc();
  }

  setVideoSrc() {
    const videoBaseUrl = 'videos/';
    const videoDetail = videoBaseUrl + this.videoId;
    const actualVideoQuality = 'video_' + this.videoQuality;
    this.apiService.getData(videoDetail).subscribe(
      (response) => {
        const videoData = Array.isArray(response) ? response[0] : response;
        if (actualVideoQuality in videoData) {
          this.videoSrc = videoData[actualVideoQuality];
          setTimeout(() => {
            const videoElement: HTMLVideoElement | null =
              document.querySelector('.video-element');
            if (videoElement) {
              videoElement.load();
            }
          }, 100);
        } else {
          console.error('Gewählte Auflösung nicht verfügbar.');
          this.videoSrc = '';
        }
      },
      (error) => {
        console.error('Fehler beim Abrufen der Video-Details:', error);
      }
    );
  }

  togglePlayPause() {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    if (video.paused) {
      video.play();
      this.isPlaying = true;
    } else {
      video.pause();
      this.isPlaying = false;
    }
  }

  updateTime() {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    this.currentTime = video.currentTime;
  }

  setDuration() {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    this.duration = video.duration;
  }

  seekVideo() {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    video.currentTime = this.currentTime;
  }

  rewind() {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    video.currentTime -= 10; // 10 Sekunden zurück
  }

  fastForward() {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    video.currentTime += 10; // 10 Sekunden vor
  }

  toggleFullscreen() {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  }
}
