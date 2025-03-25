import { Component, ElementRef, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
