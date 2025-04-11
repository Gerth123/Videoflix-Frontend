import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { ToastService } from '../services/toast-service/toast.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    const toastSpy = jasmine.createSpyObj('ToastService', ['remove']);
    toastSpy.toasts = [{ message: 'Test Toast', type: 'success', state: 'in' }];

    await TestBed.configureTestingModule({
      imports: [ToastComponent, NoopAnimationsModule],
      providers: [{ provide: ToastService, useValue: toastSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    toastServiceSpy = TestBed.inject(
      ToastService
    ) as jasmine.SpyObj<ToastService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the state of the toast to "out" when hideToast is called', () => {
    const toast = { message: 'Test Toast', type: 'success', state: 'in' };
    component.hideToast(toast);
    expect(toast.state).toBe('out');
  });

  it('should handle different toast types correctly', () => {
    const successToast = {
      message: 'Success Toast',
      type: 'success',
      state: 'in',
    };
    const errorToast = { message: 'Error Toast', type: 'error', state: 'in' };
    component.hideToast(successToast);
    component.hideToast(errorToast);
    expect(successToast.state).toBe('out');
    expect(errorToast.state).toBe('out');
  });

  it('should call toastService.remove after delay', fakeAsync(() => {
    const toast = { message: 'Test Toast', type: 'success', state: 'in' };
    component.hideToast(toast);
    tick(500);
    expect(toastServiceSpy.remove).toHaveBeenCalledWith(
      jasmine.objectContaining(toast)
    );
  }));
});
