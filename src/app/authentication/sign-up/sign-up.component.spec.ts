import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignUpComponent } from './sign-up.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { RoutingService } from '../../shared/services/routing-service/routing.service';
import { ToastService } from '../../shared/services/toast-service/toast.service';
import { ApiService } from '../../shared/services/api-service/api.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let toastServiceMock: jasmine.SpyObj<ToastService>;
  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let routingServiceMock: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    toastServiceMock = jasmine.createSpyObj('ToastService', ['show']);
    apiServiceMock = jasmine.createSpyObj('ApiService', [
      'checkEmailExists',
      'postData',
    ]);
    routingServiceMock = jasmine.createSpyObj('RoutingService', [
      'navigateTo',
      'emailFromDashboard',
    ]);
    routingServiceMock.emailFromDashboard = '';

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        SignUpComponent,
        HeaderComponent,
        FooterComponent,
      ],
      providers: [
        { provide: ToastService, useValue: toastServiceMock },
        { provide: ApiService, useValue: apiServiceMock },
        { provide: RoutingService, useValue: routingServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the signUpForm with empty values', () => {
    expect(component.signUpForm).toBeTruthy();
    expect(component.signUpForm.get('email')?.value).toBe('');
    expect(component.signUpForm.get('password')?.value).toBe('');
    expect(component.signUpForm.get('confirmPassword')?.value).toBe('');
  });

  it('should not call onSubmit if form is invalid', async () => {
    component.signUpForm.setValue({
      email: '',
      password: '',
      confirmPassword: '',
      rememberMe: false,
    });

    await component.onSubmit();

    expect(toastServiceMock.show).not.toHaveBeenCalled();
    expect(apiServiceMock.postData).not.toHaveBeenCalled();
  });

  it('should not call onSubmit if password and confirmPassword do not match', async () => {
    component.signUpForm.setValue({
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password456',
      rememberMe: false,
    });

    await component.onSubmit();

    expect(toastServiceMock.show).not.toHaveBeenCalled();
    expect(apiServiceMock.postData).not.toHaveBeenCalled();
  });

  it('should set emailFromDashboard to the form email if provided in routing service', () => {
    routingServiceMock.emailFromDashboard = 'dashboard@example.com';
    component.ngOnInit();
    expect(component.signUpForm.get('email')?.value).toBe(
      'dashboard@example.com'
    );
  });
});
