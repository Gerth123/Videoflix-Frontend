import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoPlayerComponent } from './video-player.component';
import { By } from '@angular/platform-browser';
import { ApiService } from '../../shared/services/api-service/api.service';
import { NetworkService } from '../../shared/services/network-service/network.service';
import { ToastService } from '../../shared/services/toast-service/toast.service';
import { RoutingService } from '../../shared/services/routing-service/routing.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fakeAsync, tick } from '@angular/core/testing';

class MockApiService {
  getData() {
    return {
      subscribe: (callback: Function) => callback({ title: 'Test Video' }),
    };
  }
}

class MockNetworkService {
  getNetworkSpeed() {
    return '720p';
  }
}

class MockToastService {
  show(message: string, type: string) {}
}

class MockRoutingService {
  getPoster() {
    return 'http://34.65.107.197/media/thumbnails/19.jpg';
  }
}

describe('VideoPlayerComponent', () => {
  let component: VideoPlayerComponent;
  let fixture: ComponentFixture<VideoPlayerComponent>;
  let videoElement: jasmine.SpyObj<HTMLVideoElement> = jasmine.createSpyObj(
    'HTMLVideoElement',
    ['play', 'pause']
  );
  videoElement.play.and.returnValue(Promise.resolve());

  beforeEach(async () => {
    videoElement = jasmine.createSpyObj('HTMLVideoElement', [
      'play',
      'pause',
      'load',
    ]);
    Object.defineProperty(videoElement, 'paused', {
      get: () => false,
      set: (value) => {},
    });
    Object.defineProperty(videoElement, 'duration', {
      get: () => 100,
      set: (value) => {},
    });
    Object.defineProperty(videoElement, 'currentTime', {
      get: () => 50,
      set: (value) => {},
    });

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: (key: string) => '24',
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [VideoPlayerComponent],
      declarations: [],
      providers: [
        { provide: ApiService, useClass: MockApiService },
        { provide: NetworkService, useClass: MockNetworkService },
        { provide: ToastService, useClass: MockToastService },
        { provide: RoutingService, useClass: MockRoutingService },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the correct poster image', () => {
    expect(component.poster).toBe(
      'http://34.65.107.197/media/thumbnails/19.jpg'
    );
  });

  it('should set video quality to 720p based on network speed', () => {
    expect(component.videoQuality).toBe('720p');
  });

  it('should call setVideoSrc when network speed changes', () => {
    spyOn(component, 'setVideoSrc');
    component.ngOnInit();
    const networkService = TestBed.inject(NetworkService);
    networkService.getNetworkSpeed = () => '480p';
    component['connectionListener']();
    expect(component.setVideoSrc).toHaveBeenCalled();
  });

  it('should pause video when togglePlayPause is called', () => {
    component.videoPlayer = { nativeElement: videoElement } as any;
    videoElement.pause.and.callThrough();
    component.togglePlayPause();
    expect(videoElement.pause).toHaveBeenCalled();
  });

  it('should handle loading state properly', () => {
    component.loading = true;
    spyOn(console, 'log');
    component.togglePlayPause();
    expect(console.log).toHaveBeenCalledWith('Das Video wird noch geladen');
  });  

  it('should update volume when setVolume is called', () => {
    const videoElement = fixture.debugElement.query(
      By.css('video')
    ).nativeElement;
    videoElement.volume = 0.5;
    fixture.detectChanges();
    component.volume = 0.7;
    component.setVolume();
    expect(videoElement.volume).toBe(0.7);
  });

  it('should toggle fullscreen mode', fakeAsync(() => {
    const videoContainer = fixture.debugElement.query(
      By.css('.video-container')
    ).nativeElement;
    spyOn(videoContainer, 'requestFullscreen').and.callFake(() =>
      Promise.resolve()
    );
    spyOn(document, 'exitFullscreen').and.callFake(() => Promise.resolve());
    component.toggleFullscreen();
    tick();
    fixture.detectChanges();
    expect(videoContainer.requestFullscreen).toHaveBeenCalled();

    Object.defineProperty(document, 'fullscreenElement', {
      value: videoContainer,
      writable: true,
    });
    component.toggleFullscreen();
    tick();
    fixture.detectChanges();
    expect(document.exitFullscreen).toHaveBeenCalled();
  }));
});
