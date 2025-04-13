import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
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
  public API_BASE_URL: string = 'http://127.0.0.1:8000';

  constructor(
    public apiService: ApiService,
    private toastService: ToastService,
    private routingService: RoutingService,
    private cdr: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver
  ) {}

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
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.sliders.toArray().forEach((slider, index) => {
        this.checkScrollWidth(slider.nativeElement, index);
        this.checkArrowVisibility(slider.nativeElement, index);
      });
      this.cdr.detectChanges();
    }, 0);
  }

  ngAfterViewChecked() {
    this.sliders.toArray().forEach((slider, index) => {
      this.checkScrollWidth(slider.nativeElement, index);
      this.checkArrowVisibility(slider.nativeElement, index);
    });
    this.cdr.detectChanges();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.sliders.toArray().forEach((slider, index) => {
      this.checkScrollWidth(slider.nativeElement, index);
    });
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
      return false;
    }
    return true;
  }

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

  checkArrowVisibility(sliderElement: HTMLElement, index: number) {
    const containerWidth = sliderElement.offsetWidth;
    const contentWidth = sliderElement.scrollWidth;
    const scrollLeft = sliderElement.scrollLeft;
    const atStart = scrollLeft === 0;
    const atEnd = scrollLeft + containerWidth >= contentWidth;
    this.showLeftArrowList[index] = !atStart;
    this.showRightArrowList[index] = !atEnd;
  }

  navigateTo(path: string) {
    this.routingService.navigateTo(path);
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

  navigateToVideoDescription(video: any) {
    sessionStorage.setItem('videoData', JSON.stringify(video));
    this.routingService.navigateTo(`/video-description`);
  }
  

  scrollLeft(slider: HTMLElement) {
    slider.scrollBy({ left: -300, behavior: 'smooth' });
    setTimeout(() => {
      this.checkArrowVisibility(slider, 0);
    }, 300);
    this.showLeftArrowList[0] = slider.scrollLeft > 0;
    this.showRightArrowList[0] =
      slider.scrollLeft + slider.offsetWidth < slider.scrollWidth;
  }

  scrollRight(slider: HTMLElement) {
    slider.scrollBy({ left: 300, behavior: 'smooth' });
    setTimeout(() => {
      this.checkArrowVisibility(slider, 0);
    }, 300);
    this.showRightArrowList[0] =
      slider.scrollLeft + slider.offsetWidth < slider.scrollWidth;
    this.showLeftArrowList[0] = slider.scrollLeft > 0;
  }

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
      }
    );
  }
}
