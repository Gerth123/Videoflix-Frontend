import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RoutingService } from './routing.service';

describe('RoutingService', () => {
  let service: RoutingService;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        RoutingService,
        { provide: Router, useValue: spy },
      ],
    });

    service = TestBed.inject(RoutingService);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    localStorage.clear(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should navigate to the given route', () => {
    service.navigateTo('/test-route');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/test-route']);
  });

  it('should set poster and store it in localStorage', () => {
    service.setPoster('my-poster.jpg');
    expect(service.poster).toBe('my-poster.jpg');
    expect(localStorage.getItem('poster')).toBe('my-poster.jpg');
  });

  it('should get poster from memory if already set', () => {
    service.poster = 'poster-in-memory.jpg';
    expect(service.getPoster()).toBe('poster-in-memory.jpg');
  });

  it('should get poster from localStorage if not set in memory', () => {
    localStorage.setItem('poster', 'poster-in-storage.jpg');
    service.poster = ''; 
    expect(service.getPoster()).toBe('poster-in-storage.jpg');
  });

  it('should return empty string if no poster is available', () => {
    service.poster = '';
    localStorage.removeItem('poster');
    expect(service.getPoster()).toBe('');
  });
});
