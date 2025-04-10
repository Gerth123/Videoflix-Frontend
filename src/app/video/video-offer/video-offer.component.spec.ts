import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import { VideoOfferComponent } from './video-offer.component';
import { ApiService } from '../../shared/services/api-service/api.service';
import { ToastService } from '../../shared/services/toast-service/toast.service';
import { RoutingService } from '../../shared/services/routing-service/routing.service';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('VideoOfferComponent', () => {
  let component: VideoOfferComponent;
  let fixture: ComponentFixture<VideoOfferComponent>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let mockRoutingService: jasmine.SpyObj<RoutingService>;

  beforeEach(() => {
    mockApiService = jasmine.createSpyObj('ApiService', [
      'getData',
      'getGenres',
    ]);
    mockToastService = jasmine.createSpyObj('ToastService', ['show']);
    mockRoutingService = jasmine.createSpyObj('RoutingService', [
      'navigateTo',
      'setPoster',
    ]);

    mockApiService.getData.and.returnValue(
      of({
        thumbnail: '/img.jpg',
        title: 'Test Title',
        description: 'Test Description',
      })
    );

    TestBed.configureTestingModule({
      imports: [VideoOfferComponent],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: ToastService, useValue: mockToastService },
        { provide: RoutingService, useValue: mockRoutingService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoOfferComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadGenres', () => {
    it('should load genres from API if not in sessionStorage', () => {
      spyOn(component.apiService, 'getGenres').and.returnValue(
        of([{ name: 'Drama' }, { name: 'Comedy' }])
      );

      component.loadGenres();

      expect(component.genres.length).toBe(2); // Prüft, ob 2 Genres geladen wurden
      expect(component.genres[0].name).toBe('Drama'); // Prüft, ob das erste Genre "Drama" ist
    });
  });

  describe('checkToken', () => {
    it('should navigate to home and show toast if token is missing', fakeAsync(() => {
      localStorage.removeItem('auth-token');

      component.ngOnInit();
      tick(300);

      expect(mockRoutingService.navigateTo).toHaveBeenCalledWith('');
      expect(mockToastService.show).toHaveBeenCalledWith(
        'Bitte anmelden oder registrieren',
        'info'
      );
    }));

    it('should not navigate or show toast if token exists', fakeAsync(() => {
      // Setze den Token korrekt in den LocalStorage
      localStorage.setItem('auth-token', 'test-token');
    
      // Stelle sicher, dass der Token überprüft wird
      spyOn(component, 'checkToken').and.callThrough();
    
      // Führe ngOnInit aus
      component.ngOnInit();
      tick();  // Stelle sicher, dass alle asynchronen Aufgaben abgeschlossen sind
    
      // Überprüfe, dass navigateTo nicht aufgerufen wurde
      expect(mockRoutingService.navigateTo).not.toHaveBeenCalled();
      expect(mockToastService.show).not.toHaveBeenCalled();
    }));
    
  });

  describe('loadBigThumbnail', () => {
    it('should load and set big thumbnail data', () => {
      const response = {
        thumbnail: '/img.jpg',
        title: 'Test Title',
        description: 'Test Desc',
      };

      mockApiService.getData.and.returnValue(of(response));
      component.loadBigThumbnail();

      expect(mockApiService.getData).toHaveBeenCalledWith('big-thumbnail');
    });
  });

  describe('loadGenres', () => {
    it('should load genres and save to sessionStorage', () => {
      const genres = [{ name: 'Comedy' }];
      mockApiService.getGenres.and.returnValue(of(genres));
      component.loadGenres();

      expect(component.genres).toEqual(genres);
      expect(sessionStorage.getItem('genres')).toEqual(JSON.stringify(genres));
    });

    it('should show toast on error', () => {
      mockApiService.getGenres.and.returnValue(throwError(() => 'error'));
      component.loadGenres();

      expect(mockToastService.show).toHaveBeenCalledWith(
        'Fehler beim Laden der Genres',
        'error'
      );
    });
  });

  describe('navigateToVideoPlayer', () => {
    it('should extract videoId and navigate to video player', () => {
      const url = '/thumbnails/abc123_test.jpg';
      component.navigateToVideoPlayer(url);

      expect(mockRoutingService.setPoster).toHaveBeenCalledWith(
        component.API_BASE_URL + url
      );
      expect(mockRoutingService.navigateTo).toHaveBeenCalledWith(
        '/video-player/abc123'
      );
    });

    it('should log if no match is found', () => {
      spyOn(console, 'log');
      component.navigateToVideoPlayer('/wrongurl.jpg');

      expect(console.log).toHaveBeenCalledWith('Kein Video ID gefunden');
    });
  });
});
