import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a toast on show()', () => {
    service.show('Test Message', 'success');
    expect(service.toasts.length).toBe(1);
    expect(service.toasts[0].message).toBe('Test Message');
    expect(service.toasts[0].type).toBe('success');
    expect(service.toasts[0].state).toBe('in');
  });

  it('should remove toast after timeout', fakeAsync(() => {
    service.show('Auto-remove test', 'info');
    expect(service.toasts.length).toBe(1);

    tick(4000);
    expect(service.toasts[0].state).toBe('out');

    tick(500); 
    expect(service.toasts.length).toBe(0);
  }));

  it('should remove toast manually', fakeAsync(() => {
    service.show('Manual remove test', 'warning');
    const toast = service.toasts[0];

    service.remove(toast);
    expect(toast.state).toBe('out');

    tick(500);
    expect(service.toasts.length).toBe(0);
  }));
});
