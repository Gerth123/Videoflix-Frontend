import { TestBed } from '@angular/core/testing';
import { ApiConfigService } from './api-config.service';

describe('ApiConfigService', () => {
  let service: ApiConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return full API URL with given endpoint', () => {
    const endpoint = 'profile/';
    const fullUrl = service.getFullUrl(endpoint);
    expect(fullUrl).toBe('https://videoflix.robin-gerth.de/api/profile/');
  });

  it('should have correct API base URL', () => {
    expect(service.API_BASE_URL).toBe('https://videoflix.robin-gerth.de/api/');
  });

  it('should have correct static base URL', () => {
    expect(service.STATIC_BASE_URL).toBe('https://videoflix.robin-gerth.de/');
  });

  it('should have correct PAGE_SIZE', () => {
    expect(service.PAGE_SIZE).toBe(6);
  });
});
