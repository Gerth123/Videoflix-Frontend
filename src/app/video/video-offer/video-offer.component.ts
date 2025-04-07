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
  loading: boolean = true;
  bigThumbnailUrl: string = '/api/big-thumbnail';
  bigThumbnailTitle: string = '';
  bigThumbnailDescription: string = '';
  public API_BASE_URL: string = 'http://127.0.0.1:8000';

  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
    private routingService: RoutingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkToken();
    this.loadBigThumbnail();
    this.loadGenres();
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
    }
  }

  loadBigThumbnail() {
    this.apiService.getData('big-thumbnail').subscribe((data) => {
      this.bigThumbnailUrl = data.thumbnail;
      this.bigThumbnailTitle = data.title;
      this.bigThumbnailDescription = data.description;
      this.loading = false;
    });
  }

  checkScrollWidth(sliderElement: HTMLElement, index: number) {
    const containerWidth = sliderElement.offsetWidth;
    const contentWidth = sliderElement.scrollWidth;

    // Berechne, ob der Inhalt größer als der Container ist (damit Pfeile angezeigt werden können)
    const hasOverflow = contentWidth > containerWidth;

    // Berechne den Scroll-Status
    const scrollLeft = sliderElement.scrollLeft;
    const atStart = scrollLeft === 0;
    const atEnd = scrollLeft + containerWidth >= contentWidth;

    // Speichere, ob die Pfeile angezeigt werden sollen
    this.showArrowsList[index] = hasOverflow;

    // Aktualisiere die Sichtbarkeit der Pfeile, abhängig vom Scroll-Status
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
      const videoId = match[1].replace('.jpg', '');
      this.routingService.navigateTo(`/video-player/${videoId}`);
    } else {
      console.log('Kein Video ID gefunden');
    }
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
        this.loading = false;
      },
      (error) => {
        this.toastService.show('Fehler beim Laden der Genres', 'error');
        this.loading = false;
      }
    );
  }
}
