import { TestBed } from '@angular/core/testing';
import { NetworkService } from './network.service';

describe('NetworkService', () => {
  let service: NetworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const mockConnection = (downlink: number | undefined) => {
    Object.defineProperty(navigator, 'connection', {
      value: downlink !== undefined ? { downlink } : undefined,
      configurable: true,
    });
  };

  it('should return 144p for very slow connection', () => {
    mockConnection(0.3);
    expect(service.getNetworkSpeed()).toBe('144p');
  });

  it('should return 240p for slow connection', () => {
    mockConnection(0.8);
    expect(service.getNetworkSpeed()).toBe('240p');
  });

  it('should return 360p for medium-slow connection', () => {
    mockConnection(2.0);
    expect(service.getNetworkSpeed()).toBe('360p');
  });

  it('should return 480p for medium connection', () => {
    mockConnection(3.5);
    expect(service.getNetworkSpeed()).toBe('480p');
  });

  it('should return 720p for fast connection', () => {
    mockConnection(6.0);
    expect(service.getNetworkSpeed()).toBe('720p');
  });

  it('should return 1080p for very fast connection', () => {
    mockConnection(10);
    expect(service.getNetworkSpeed()).toBe('1080p');
  });

  it('should return auto if connection is not available', () => {
    Object.defineProperty(navigator, 'connection', {
      value: undefined,
      configurable: true,
    });
  
    expect(service.getNetworkSpeed()).toBe('auto');
  });  
});
