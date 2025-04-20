import { ChangeDetectorRef, Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ApiService } from '../../shared/services/api-service/api.service';
import { ToastService } from '../../shared/services/toast-service/toast.service';
import { RoutingService } from '../../shared/services/routing-service/routing.service';
import { NgFor, NgIf } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-video-offer',
  imports: [HeaderComponent, FooterComponent, NgFor, NgIf],
  templateUrl: './video-offer.component.html',
  styleUrl: './video-offer.component.scss',
})
export class VideoOfferComponent {
  @ViewChildren('slider') sliders!: QueryList<ElementRef>;
  showArrowsList: boolean[] = [];
  showLeftArrowList: boolean[] = [];
  showRightArrowList: boolean[] = [];
  genres: any[] = [];
  loading: number = 0;
  bigThumbnailUrl: string = '/api/big-thumbnail';
  bigThumbnailTitle: string = '';
  bigThumbnailDescription: string = '';
  isMobile: boolean = false;
  public API_BASE_URL: string = 'https://videoflix.robin-gerth.de/';

  constructor(
    public apiService: ApiService,
    private toastService: ToastService,
    private routingService: RoutingService,
    private cdr: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
  ) {}

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   *
   * Checks if the user is logged in and if so, loads the genres and the big thumbnail.
   *
   * @returns A promise that resolves when the user has been logged in and the genres and big thumbnail have been loaded.
   */
  async ngOnInit(): Promise<void> {
    const tokenValid = await this.checkToken();
    if (!tokenValid) return;
    const savedGenres = sessionStorage.getItem('genres');
    if (savedGenres) {
      this.genres = JSON.parse(savedGenres);
      this.loading += 1;
    } else {
      this.loading = 0;
      await this.loadGenres();
    }
    await this.loadBigThumbnail();
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile = result.matches;
    });
  }

/**
 * Lifecycle hook that is called after the component's view has been fully initialized.
 *
 * Iterates over each slider element to check its scroll width and arrow visibility,
 * then triggers change detection to update the view accordingly.
 */
  ngAfterViewInit() {
    setTimeout(() => {
      this.sliders.toArray().forEach((slider, index) => {
        this.checkScrollWidth(slider.nativeElement, index);
        this.checkArrowVisibility(slider.nativeElement, index);
      });
      this.cdr.detectChanges();
    }, 0);
  }

  /**
   * Lifecycle hook that is called after the component's view has been checked for changes.
   *
   * Iterates over each slider element to check its scroll width and arrow visibility,
   * then triggers change detection to update the view accordingly.
   */
  ngAfterViewChecked() {
    this.sliders.toArray().forEach((slider, index) => {
      this.checkScrollWidth(slider.nativeElement, index);
      this.checkArrowVisibility(slider.nativeElement, index);
    });
    this.cdr.detectChanges();
  }
  
  /**
   * Listens for the window resize event and updates the slider widths accordingly.
   * 
   * @param event The window resize event.
   */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.sliders.toArray().forEach((slider, index) => {
      this.checkScrollWidth(slider.nativeElement, index);
    });
  }

  /**
   * Checks if the authentication token exists in local storage.
   *
   * If the token does not exist, navigates to the home page and shows an information toast notification with a delay of 300 milliseconds.
   *
   * @returns {boolean} true if the token exists, false otherwise.
   */
  checkToken() {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      this.routingService.navigateTo('');
      setTimeout(() => this.toastService.show('Bitte anmelden oder registrieren', 'info'), 300);
      return false;
    }
    return true;
  }

  /**
   * Loads the big thumbnail from the API and updates the component properties accordingly.
   *
   * Subscribes to the observable returned by `ApiService.getData` with the argument 'big-thumbnail'.
   * If the observable is undefined, logs an error to the console.
   *
   * @returns {void}
   */
  loadBigThumbnail() {
    const data$ = this.apiService.getData('big-thumbnail');
    if (data$) {
      data$.subscribe((data) => {
        this.bigThumbnailUrl = data.thumbnail;
        this.bigThumbnailTitle = data.title;
        this.bigThumbnailDescription = data.description;
        this.loading += 1;
      });
    } else {
      console.error('Das Observable von getData ist undefined.');
    }
  }

/**
 * Checks the scroll width of a slider element and updates the arrow visibility lists.
 *
 * Determines if the content of the slider overflows its container, and updates the 
 * `showArrowsList`, `showLeftArrowList`, and `showRightArrowList` arrays based on
 * the overflow status and the current scroll position.
 *
 * @param sliderElement The HTML element representing the slider.
 * @param index The index of the slider in the list of sliders.
 */
  checkScrollWidth(sliderElement: HTMLElement, index: number) {
    const containerWidth = sliderElement.offsetWidth;
    const contentWidth = sliderElement.scrollWidth;
    const hasOverflow = contentWidth > containerWidth;
    const scrollLeft = sliderElement.scrollLeft;
    const atStart = scrollLeft === 0;
    const atEnd = scrollLeft + containerWidth >= contentWidth;
    this.showArrowsList[index] = hasOverflow;
    this.showLeftArrowList[index] = !atStart && hasOverflow;
    this.showRightArrowList[index] = !atEnd && hasOverflow;
  }

/**
 * Updates the visibility status of the left and right arrows for a slider.
 *
 * Determines whether the left or right navigation arrows should be visible based on
 * the current scroll position of the slider element. If the slider is scrolled to the start,
 * the left arrow is hidden. If the slider is scrolled to the end, the right arrow is hidden.
 *
 * @param sliderElement The HTML element representing the slider.
 * @param index The index of the slider in the list of sliders.
 */
  checkArrowVisibility(sliderElement: HTMLElement, index: number) {
    const containerWidth = sliderElement.offsetWidth;
    const contentWidth = sliderElement.scrollWidth;
    const scrollLeft = sliderElement.scrollLeft;
    const atStart = scrollLeft === 0;
    const atEnd = scrollLeft + containerWidth >= contentWidth;
    this.showLeftArrowList[index] = !atStart;
    this.showRightArrowList[index] = !atEnd;
  }

  /**
   * Navigates to the specified path using the RoutingService.
   *
   * @param path The path to navigate to.
   */
  navigateTo(path: string) {
    this.routingService.navigateTo(path);
  }

  /**
   * Navigates to the video player component, passing the videoId as a parameter.
   *
   * Extracts the videoId from the given thumbnail URL and navigates to the video player
   * component using the RoutingService. The videoId is extracted by using a regex to find
   * the first group of characters after the last underscore in the thumbnail URL.
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
   * Navigates to the video description component and saves the video data to session storage.
   *
   * @param video The video object to save to session storage.
   */
  navigateToVideoDescription(video: any) {
    sessionStorage.setItem('videoData', JSON.stringify(video));
    this.routingService.navigateTo(`/video-description`);
  }

  /**
   * Scrolls the given slider to the left by 300px.
   *
   * Calls HTMLElement.scrollBy() with the 'smooth' behavior to scroll the slider to the left.
   * Then, after a 300ms delay, calls checkArrowVisibility() to update the visibility of the
   * left and right navigation arrows. Finally, updates the showLeftArrowList and
   * showRightArrowList arrays based on the new scroll position.
   *
   * @param slider The HTMLElement of the slider to scroll.
   */
  scrollLeft(slider: HTMLElement) {
    slider.scrollBy({ left: -300, behavior: 'smooth' });
    setTimeout(() => {
      this.checkArrowVisibility(slider, 0);
    }, 300);
    this.showLeftArrowList[0] = slider.scrollLeft > 0;
    this.showRightArrowList[0] = slider.scrollLeft + slider.offsetWidth < slider.scrollWidth;
  }

  /**
   * Scrolls the given slider to the right by 300px.
   *
   * Calls HTMLElement.scrollBy() with the 'smooth' behavior to scroll the slider to the right.
   * Then, after a 300ms delay, calls checkArrowVisibility() to update the visibility of the
   * left and right navigation arrows. Finally, updates the showLeftArrowList and
   * showRightArrowList arrays based on the new scroll position.
   *
   * @param slider The HTMLElement of the slider to scroll.
   */
  scrollRight(slider: HTMLElement) {
    slider.scrollBy({ left: 300, behavior: 'smooth' });
    setTimeout(() => {
      this.checkArrowVisibility(slider, 0);
    }, 300);
    this.showRightArrowList[0] = slider.scrollLeft + slider.offsetWidth < slider.scrollWidth;
    this.showLeftArrowList[0] = slider.scrollLeft > 0;
  }

  /**
   * Loads the list of available genres from the API.
   *
   * Calls getGenres() from the ApiService to load the list of genres.
   * If the request is successful, the list of genres is stored in the component property
   * 'genres' and the 'loading' counter is incremented.
   * The list of genres is also stored in sessionStorage under the key 'genres'.
   * If the request fails, a toast message is shown with the error message.
   */
  loadGenres() {
    this.apiService.getGenres().subscribe(
      (data) => {
        this.genres = data;
        this.loading += 1;
        sessionStorage.setItem('genres', JSON.stringify(data));
      },
      (error) => {
        this.toastService.show('Fehler beim Laden der Genres', 'error');
        this.loading += 1;
      },
    );
  }
}
