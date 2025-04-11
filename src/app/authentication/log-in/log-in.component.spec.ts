import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogInComponent } from './log-in.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../shared/services/api-service/api.service';
import { RoutingService } from '../../shared/services/routing-service/routing.service';
import { ToastService } from '../../shared/services/toast-service/toast.service';
import { ApiConfigService } from '../../shared/services/api-config-service/api-config.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LogInComponent', () => {
  let component: LogInComponent;
  let fixture: ComponentFixture<LogInComponent>;
  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let routingServiceMock: jasmine.SpyObj<RoutingService>;
  let toastServiceMock: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    apiServiceMock = jasmine.createSpyObj('ApiService', ['postData']);
    routingServiceMock = jasmine.createSpyObj('RoutingService', ['navigateTo']);
    toastServiceMock = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LogInComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: RoutingService, useValue: routingServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
        { provide: ApiConfigService, useValue: { LOGIN_URL: 'fake-url' } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LogInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should mark the form as invalid when required fields are missing', () => {
    component.logInForm.controls['email'].setValue('');
    component.logInForm.controls['password'].setValue('');
    fixture.detectChanges();

    expect(component.logInForm.valid).toBeFalse();
  });

  it('should mark the form as valid when required fields are filled', () => {
    component.logInForm.controls['email'].setValue('test@example.com');
    component.logInForm.controls['password'].setValue('password123');
    fixture.detectChanges();

    expect(component.logInForm.valid).toBeTrue();
  });

  it('should show password field when rememberMe is unchecked', () => {
    component.logInForm.controls['rememberMe'].setValue(false);
    component.onCheckboxChange();

    expect(component.showPasswordField).toBeTrue();
  });

  it('should hide password field when rememberMe is checked', () => {
    spyOn(localStorage, 'getItem').and.returnValue('test@example.com');
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');
    component.logInForm.controls['rememberMe'].setValue(true);
    component.onCheckboxChange();
    expect(component.showPasswordField).toBeFalse();
    expect(localStorage.setItem).toHaveBeenCalledWith('remember-me', 'true');
  });

  it('should pre-fill email if provided from routing service', () => {
    routingServiceMock.emailFromDashboard = 'dashboard@example.com';
    component.ngOnInit();

    expect(component.logInForm.get('email')?.value).toBe(
      'dashboard@example.com'
    );
  });
});
