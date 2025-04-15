import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NetworkService } from '../../shared/services/network-service/network.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../shared/services/api-service/api.service';
import { ToastService } from '../../shared/services/toast-service/toast.service';
import { RoutingService } from '../../shared/services/routing-service/routing.service';

@Component({
  selector: 'app-video-player',
  imports: [HeaderComponent, FormsModule, NgIf, NgFor],
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
  chosenQuality: string = 'auto';
  videoSrc: string = '';
  videoId: string = '';
  isMuted = false;
  volume: number = 1;
  videoSpeed: number = 1;
  dropdownVisible: boolean = false;
  availableQualities: string[] = [];
  qualityDropdownVisible: boolean = false;
  private connectionListener: any;
  loading: boolean = true;
  poster = 'http://127.0.0.1:8000/media/thumbnails/19.jpg';
  isFullscreen: boolean = false;
  isControlsVisible: boolean = true;
  timeout: any;
  fullscreenChangeHandler: any;
  isMobilePlayer: boolean = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  videoData: any = {};

  constructor(
    private networkService: NetworkService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toastService: ToastService,
    private routingService: RoutingService,
    private cdr: ChangeDetectorRef,
  ) {}

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   *
   * Retrieves the video ID from the URL parameter, sets the video quality based on the network speed
   * and sets the video source with the retrieved ID and quality.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.poster = this.routingService.getPoster();
    this.videoQuality = this.networkService.getNetworkSpeed();
    this.videoId = this.route.snapshot.paramMap.get('videoId') || '';
    this.setVideoSrc();
    this.setupNetworkAndFullscreenListeners();
  }

  /**
   * Sets up event listeners for network speed changes and fullscreen changes.
   *
   * Listens for changes to the network speed using the `connection` object and
   * updates the video quality accordingly.
   *
   * Listens for changes to the fullscreen state of the document and updates the
   * component's `isFullscreen` property accordingly.
   *
   * @returns {void}
   */
  private setupNetworkAndFullscreenListeners(): void {
    if (!('connection' in navigator)) return;
    const connection = (navigator as any).connection;
    this.connectionListener = () => {
      const newQuality = this.networkService.getNetworkSpeed();
      if (this.videoQuality !== newQuality) {
        this.videoQuality = newQuality;
        this.toastService.show(`Netzwerkqualität geändert: ${newQuality}`, 'info');
        if (this.chosenQuality === 'auto') this.setVideoSrc();
      }
    };
    connection.addEventListener('change', this.connectionListener);
    this.fullscreenChangeHandler = this.onFullscreenChange.bind(this);
    document.addEventListener('fullscreenchange', this.fullscreenChangeHandler);
    document.addEventListener('webkitfullscreenchange', this.fullscreenChangeHandler);
    document.addEventListener('mozfullscreenchange', this.fullscreenChangeHandler);
  }

  /**
   * Lifecycle hook that is called after the component's view has been fully initialized.
   *
   * Retrieves the native video element and initializes event listeners for video playback
   * and fullscreen changes. Updates the current time and duration of the video during playback,
   * and continuously updates these values using requestAnimationFrame as long as the video is playing.
   * Sets up event listeners for play, pause, and ended states of the video.
   */
  ngAfterViewInit() {
    const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
    const updateProgress = () => {
      this.currentTime = Math.floor(videoElement.currentTime);
      this.duration = Math.floor(videoElement.duration);
      if (!videoElement.paused && !videoElement.ended) {
        requestAnimationFrame(updateProgress);
      }
    };
    this.setEvenlistenersVideo(videoElement, updateProgress);
    this.setEventlistenerFullscreen(videoElement);
  }

  /**
   * Sets up event listeners for the video element to keep track of the playback state.
   *
   * Listeners are set up for the 'play', 'pause', and 'ended' states. When the video is
   * playing, the current time is updated continuously using requestAnimationFrame. When
   * the video has ended, the current time is set to the duration and the controls and
   * mouse are shown.
   *
   * @param videoElement The video element to set up the event listeners for.
   * @param updateProgress The function to call to update the current time of the video.
   */
  setEvenlistenersVideo(videoElement: HTMLVideoElement, updateProgress: () => void) {
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
  }

  /**
   * Sets up event listeners for the video element to set up the video player on mobile.
   *
   * Listeners are set up for the 'loadedmetadata' event to set the duration of the video
   * when it is available. After a short delay, the video player is set to full screen and
   * landscape orientation if it is a mobile player.
   *
   * @param videoElement The video element to set up the event listeners for.
   */
  setEventlistenerFullscreen(videoElement: HTMLVideoElement) {
    videoElement.addEventListener('loadedmetadata', () => {
      this.duration = Math.floor(videoElement.duration);
    });
    if (this.isMobilePlayer) {
      setTimeout(() => {
        this.requestFullscreenAndLandscape();
      }, 500);
    }
  }

  /**
   * Detects if the device is a mobile device.
   *
   * This is done by testing the user agent string of the navigator object for
   * the presence of any of the following strings: 'iPhone', 'iPad', 'iPod',
   * 'Android'. If any of these strings are present, the method returns true,
   * otherwise it returns false.
   *
   * @returns true if the device is a mobile device, false otherwise.
   */
  detectMobileDevice(): boolean {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  /**
   * Requests the video container to go into full screen mode and, if available,
   * locks the screen orientation to landscape.
   *
   * This method is called on mobile devices after a short delay to ensure that the
   * video player is fully loaded and ready to go into full screen mode.
   */
  requestFullscreenAndLandscape() {
    const container: HTMLElement = this.videoContainer.nativeElement;
    if (container.requestFullscreen) {
      container
        .requestFullscreen()
        .then(() => {
          if ((screen.orientation as any).lock) {
            (screen.orientation as any).lock('landscape').catch((err: any) => {
              console.warn('Konnte Bildschirm nicht drehen:', err);
            });
          }
        })
        .catch((err) => {
          console.warn('Fullscreen-Fehler:', err);
        });
    }
  }

  /**
   * Clean up event listeners when component is destroyed.
   *
   * Removes the event listener for the 'change' event on the 'connection' object
   * and the event listeners for the 'fullscreenchange' event on the document if
   * it was set up.
   */
  ngOnDestroy(): void {
    if (this.connectionListener && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.removeEventListener('change', this.connectionListener);
    }
    document.removeEventListener('fullscreenchange', this.fullscreenChangeHandler);
    document.removeEventListener('webkitfullscreenchange', this.fullscreenChangeHandler);
    document.removeEventListener('mozfullscreenchange', this.fullscreenChangeHandler);
  }

  /**
   * Event handler for the 'fullscreenchange' event on the document.
   *
   * Sets the 'isFullscreen' flag to true if the document is in full screen mode
   * and false otherwise. Also adjusts the position of the dropdown menu to
   * ensure that it is always visible.
   */
  onFullscreenChange() {
    this.isFullscreen = !!document.fullscreenElement;
    this.adjustDropdownPosition();
  }

  /**
   * Sets the video source based on the video ID and quality.
   *
   * Constructs the video detail URL using the `videoId`, fetches the video data,
   * and updates the component's title and video source. If the selected quality
   * is available in the video data, it applies the video source; otherwise, it
   * handles the missing quality scenario. Handles API errors if the data retrieval
   * fails.
   */
  setVideoSrc() {
    const videoBaseUrl = 'videos/';
    const videoDetail = videoBaseUrl + this.videoId;
    this.apiService.getData(videoDetail).subscribe(
      (response) => {
        this.videoData = Array.isArray(response) ? response[0] : response;
        this.extractAvailableQualities(this.videoData);
        this.title = this.videoData.title;
        const selectedQuality = this.getAvailableQuality(this.videoData);
        if (selectedQuality && this.videoData[selectedQuality]) {
          this.applyVideoSource(this.videoData[selectedQuality]);
        } else {
          this.handleMissingQuality();
        }
      },
      (error) => this.handleApiError(error),
    );
  }

  /**
   * Extracts and sorts the available video qualities from the given video object.
   *
   * The method identifies keys in the video object that match the pattern `video_<quality>p`
   * and have a truthy value, where `<quality>` is a number representing the video resolution.
   * It then extracts the resolution part, sorts the list of resolutions in ascending order,
   * and assigns it to `availableQualities`.
   *
   * @param video An object containing video data with potential quality-specific keys.
   */

  extractAvailableQualities(video: any) {
    const keys = Object.keys(video);
    const qualityRegex = /^video_(\d+p)$/;
    this.availableQualities = keys
      .filter((key) => qualityRegex.test(key) && video[key])
      .map((key) => key.match(qualityRegex)![1])
      .sort((a, b) => parseInt(a) - parseInt(b));
  }

  /**
   * Sets the video quality based on the given quality and updates the video source.
   *
   * If the given quality is 'auto', it sets the video quality based on the network
   * speed, fetches the video data, and updates the video source. If the given quality
   * is not 'auto', it tries to find the video URL in the video data and updates the
   * video source if it exists. In both cases, it reloads the video element and sets
   * the playback state to paused.
   *
   * @param quality The desired video quality, either a valid video quality string
   * (e.g. 1080p, 720p, 480p, 360p, 240p, 144p) or 'auto' to set the video quality
   * based on the network speed.
   */
  setQuality(quality: string) {
    this.qualityDropdownVisible = false;
    if (quality === this.videoQuality) return;
    const videoElement: HTMLVideoElement = document.getElementById('my-video') as HTMLVideoElement;
    if (quality === 'auto') {
      this.videoQuality = this.networkService.getNetworkSpeed();
      this.setVideoSrc();
    } else {
      const videoUrl = this.videoData[`video_${quality}`];
      if (videoUrl) {
        this.videoSrc = videoUrl;
      }
    }
    this.chosenQuality = quality;
    if (videoElement) videoElement.load();
    this.isPlaying = false;
  }

  /**
   * Determines the best available video quality for the given video data.
   *
   * Attempts to match the current video quality preference by checking if the
   * specified quality is available in the video data. If the preferred quality
   * is not available, it iterates over a predefined list of qualities in
   * descending order to find an alternative.
   *
   * Logs a warning if the preferred quality is not available and an alternative
   * is being sought.
   *
   * @param videoData - The data object containing different video quality sources.
   * @returns The key of the available video quality, or an empty string if no
   * quality is available.
   */
  private getAvailableQuality(videoData: any): string {
    const actualVideoQuality = 'video_' + this.videoQuality;
    const qualities = ['1080p', '720p', '480p', '360p', '240p', '144p'];
    if (videoData[actualVideoQuality]) return actualVideoQuality;
    console.warn(`Gewählte Auflösung ${this.videoQuality} nicht verfügbar. Suche nach Alternativen.`);
    for (let quality of qualities) {
      const key = 'video_' + quality;
      if (videoData[key]) return key;
    }
    return '';
  }

  /**
   * Applies the given video source to the video player component.
   *
   * Updates the `videoSrc` property of the component with the given source URL.
   * Calls `detectChanges` to trigger a change detection cycle and updates the
   * UI. Waits for 100ms to ensure that the video element has been rendered
   * before calling `load` on it to trigger video loading.
   *
   * @param source - The video source URL to apply to the video player.
   */
  private applyVideoSource(source: string): void {
    this.videoSrc = source;
    this.cdr.detectChanges();
    setTimeout(() => {
      const videoElement: HTMLVideoElement | null = this.videoPlayer.nativeElement;
      videoElement?.load();
    }, 100);
    this.loading = false;
  }

  /**
   * Handles the case when no video quality is available for the given video.
   *
   * Logs an error message and resets the `videoSrc` property to an empty string.
   * Sets the `loading` property to `false` to indicate that the loading process
   * has finished. This is necessary to prevent the loading screen from being
   * displayed indefinitely.
   */
  private handleMissingQuality(): void {
    console.error('Keine verfügbare Auflösung für dieses Video.');
    this.videoSrc = '';
    this.loading = false;
  }

  /**
   * Handles the case when the API returns an error response.
   *
   * Logs the error message to the console and resets the `loading` property to
   * `false` to indicate that the loading process has finished. This is necessary
   * to prevent the loading screen from being displayed indefinitely.
   * @param error The error returned by the API.
   */
  private handleApiError(error: any): void {
    console.error('Fehler beim Abrufen der Video-Details:', error);
    this.loading = false;
  }

  /**
   * Handles mouse move events in the component.
   *
   * When the user moves the mouse, this function is called. It shows the video
   * controls and mouse cursor, and if the video is playing, it sets a timeout
   * to hide the controls and mouse cursor after 3 seconds of inactivity.
   * If the video is not playing, the timeout is cleared to prevent the controls
   * and mouse cursor from being hidden.
   * @param event The MouseEvent object describing the mouse move event.
   */
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

  /**
   * Shows the video controls, header and middle controls.
   *
   * Sets the `isControlsVisible` property to `true` and removes the `hidden`
   * class from the header, controls and middle controls elements if they exist.
   * This is necessary to show the controls and header when the video is playing
   * and the user interacts with the video (e.g. by moving the mouse or clicking
   * on the video). The controls and header are hidden by default to prevent
   * them from overlapping with the video and to improve the user experience.
   * @returns {void}
   */
  showControls() {
    this.isControlsVisible = true;
    const header = document.querySelector('app-header');
    const controls = document.querySelector('.controls-overlay');
    const middlecontrols = document.querySelector('.controls-container-mobile');
    if (header) header.classList.remove('hidden');
    if (controls) controls.classList.remove('hidden');
    if (middlecontrols) middlecontrols.classList.remove('hidden');
  }

  /**
   * Hides the video controls, header and middle controls.
   *
   * Sets the `isControlsVisible` property to `false` and adds the `hidden` class
   * to the header, controls and middle controls elements if they exist. This is
   * necessary to hide the controls and header when the video is playing and the
   * user stops interacting with the video (e.g. by not moving the mouse or
   * clicking on the video for a certain amount of time). The controls and header
   * are shown by default to improve the user experience.
   * @returns {void}
   */
  hideControls() {
    this.isControlsVisible = false;
    const header = document.querySelector('app-header');
    const controls = document.querySelector('.controls-overlay');
    const middlecontrols = document.querySelector('.controls-container-mobile');
    if (header) header.classList.add('hidden');
    if (controls) controls.classList.add('hidden');
    if (middlecontrols) middlecontrols.classList.add('hidden');
  }

  /**
   * Shows the mouse cursor on the video container element.
   *
   * @returns {void}
   */
  showMouse() {
    if (this.videoContainer) {
      this.videoContainer.nativeElement.style.cursor = 'default';
    }
  }

  /**
   * Hides the mouse cursor on the video container element.
   *
   * Sets the cursor style to 'none' on the video container's native element,
   * making the mouse cursor invisible when it's over the video container.
   *
   * @returns {void}
   */
  hideMouse() {
    if (this.videoContainer) {
      this.videoContainer.nativeElement.style.cursor = 'none';
    }
  }

  /**
   * Toggles the play and pause state of the video player.
   *
   * If the video is currently loading, logs a message and exits the function.
   * For mobile players, shows or hides controls based on the video's current
   * play state. If the video has reached the end, it resets the current time
   * to the start. Toggles between playing and pausing the video, and updates
   * the `isPlaying` property to reflect the current play state.
   *
   * @returns {void}
   */
  togglePlayPause() {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    if (this.loading) {
      console.log('Das Video wird noch geladen');
      return;
    }
    if (this.isMobilePlayer && !video.paused) this.showControls();
    else if (this.isMobilePlayer && video.paused) this.hideControls();
    if (Math.floor(video.currentTime) >= Math.floor(video.duration)) video.currentTime = 0;
    if (video.paused) video.play();
    else video.pause();
    this.isPlaying = !video.paused;
  }

  /**
   * Toggles the play and pause state of the video player, and shows or hides controls if on mobile.
   *
   * If the video is currently loading, logs a message and exits the function.
   * For mobile players, shows or hides controls based on the video's current play state.
   * Calls the `togglePlayPause` function to actually toggle the play state.
   *
   * @returns {void}
   */
  togglePlayPauseVideo() {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    if (this.loading) {
      console.log('Das Video wird noch geladen');
      return;
    }
    if (this.isMobilePlayer && !video.paused) {
      this.showControls();
      return;
    } else if (this.isMobilePlayer && video.paused) this.hideControls();
    this.togglePlayPause();
  }

  /**
   * Updates the current time of the video player.
   *
   * Retrieves the current playback time from the native video element
   * and updates the `currentTime` property with this value.
   */
  updateTime() {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    this.currentTime = video.currentTime;
  }

  /**
   * Sets the duration of the video player.
   *
   * Retrieves the duration from the native video element and updates the
   * `duration` property with this value.
   */
  setDuration() {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    this.duration = video.duration;
  }

  /**
   * Called when the video player's metadata has loaded.
   *
   * Retrieves the duration from the native video element and updates the
   * `duration` property with this value.
   */
  onMetadataLoaded() {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    this.duration = video.duration;
  }

  /**
   * Called when the video player's time has changed.
   *
   * Retrieves the current playback time from the native video element
   * and updates the `currentTime` property with this value.
   */
  onTimeUpdate() {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    this.currentTime = video.currentTime;
  }

  /**
   * Seeks the video to the specified time.
   *
   * Updates the current playback time of the video to the time specified by
   * the input element's value. This allows the user to jump to different
   * parts of the video.
   *
   * @param event The input event containing the target element with the new
   * playback time value.
   */
  seekVideo(event: Event) {
    const input = event.target as HTMLInputElement;
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    video.currentTime = Number(input.value);
  }

  /**
   * Rewinds the video player 10 seconds.
   *
   * @returns {void}
   */
  rewind() {
    const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
    if (videoElement) {
      videoElement.currentTime -= 10;
    }
  }

  /**
   * Fast forwards the video player by 10 seconds.
   *
   * @returns {void}
   */

  fastForward() {
    const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
    if (videoElement) {
      videoElement.currentTime += 10;
    }
  }

  /**
   * Sets the volume of the video player to the value specified by the input field.
   *
   * @returns {void}
   */
  setVolume() {
    const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
    videoElement.volume = this.volume;
  }

  /**
   * Sets the playback speed of the video player to the specified value.
   *
   * Sets the `playbackRate` property of the native video element to the specified value.
   * Additionally, sets the `videoSpeed` property to the specified value and hides the
   * dropdown menu.
   *
   * @param speed The playback speed to set the video player to.
   * @returns {void}
   */
  setSpeed(speed: number) {
    const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
    videoElement.playbackRate = speed;
    this.videoSpeed = speed;
    this.dropdownVisible = false;
  }

  /**
   * Toggles the visibility of the dropdown menu for the playback speed.
   *
   * @returns {void}
   */
  toggleDropdown(dropdown: string) {
    if (dropdown === 'quality') this.qualityDropdownVisible = !this.qualityDropdownVisible;
    if (dropdown === 'speed') this.dropdownVisible = !this.dropdownVisible;
  }

  /**
   * Toggles the full screen mode for the video container.
   *
   * If the document is not currently in full screen mode, it requests full screen
   * for the video container using the appropriate method for the browser.
   * If the document is currently in full screen mode, it exits full screen using
   * the appropriate method for the browser.
   *
   * Supports standard, Mozilla, and WebKit full screen APIs.
   */
  toggleFullscreen() {
    const container: HTMLElement = this.videoContainer.nativeElement;
    if (!document.fullscreenElement)
      if (container.requestFullscreen) container.requestFullscreen();
      else if ((container as any).mozRequestFullScreen) (container as any).mozRequestFullScreen();
      else if ((container as any).webkitRequestFullscreen) (container as any).webkitRequestFullscreen();
      else if (document.fullscreenElement)
        if (document.exitFullscreen) document.exitFullscreen();
        else if ((document as any).mozCancelFullScreen) (document as any).mozCancelFullScreen();
        else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen();
  }

  /**
   * Adjusts the position of the dropdown menu for the video player.
   *
   * This is necessary because the video controls are positioned at the bottom of
   * the screen in full screen mode, and the dropdown menu would be hidden behind
   * them if not adjusted.
   * @returns {void}
   */
  adjustDropdownPosition() {
    const dropdown = document.querySelector('.dropdown') as HTMLElement;
    if (dropdown) {
      if (this.isFullscreen) dropdown.style.bottom = '60px';
      else dropdown.style.bottom = '40px';
    }
  }

  /**
   * Converts a given number of seconds into a string in the format MM:SS.
   *
   * If the given number of seconds is undefined or NaN, it returns '00:00'.
   * Otherwise, it calculates the minutes and seconds from the given number of seconds
   * and returns a string in the format MM:SS, padding with leading zeros if necessary.
   * @param seconds The number of seconds to be converted.
   * @returns A string in the format MM:SS.
   */
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
