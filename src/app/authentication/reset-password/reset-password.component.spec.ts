import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './reset-password.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../shared/services/toast-service/toast.service';
import { ApiService } from '../../shared/services/api-service/api.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let toastServiceMock: jasmine.SpyObj<ToastService>;
  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let routerMock: jasmine.SpyObj<Router>;
  let routeMock: { snapshot: { queryParams: { token: string } } };

  beforeEach(async () => {
    toastServiceMock = jasmine.createSpyObj('ToastService', ['show']);
    apiServiceMock = jasmine.createSpyObj('ApiService', ['postDataWithoutToken']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    routeMock = { snapshot: { queryParams: { token: 'dummy-token' } } };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, ResetPasswordComponent],
      providers: [
        { provide: ToastService, useValue: toastServiceMock },
        { provide: ApiService, useValue: apiServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the ResetPassword component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the resetPasswordForm with empty values', () => {
    expect(component.resetPasswordForm).toBeTruthy();
    expect(component.resetPasswordForm.get('password')?.value).toBe('');
    expect(component.resetPasswordForm.get('confirmPassword')?.value).toBe('');
  });

  it('should extract token from the queryParams', () => {
    expect(component.token).toBe('dummy-token');
  });

  it('should show error toast if passwords do not match on submit', () => {
    component.resetPasswordForm.setValue({
      password: 'newpassword123',
      confirmPassword: 'differentpassword123',
    });

    component.onSubmit();

    expect(toastServiceMock.show).toHaveBeenCalledWith('Passwörter stimmen nicht überein.', 'error');
  }); 

  it('should show error toast if password reset fails', () => {
    component.resetPasswordForm.setValue({
      password: 'newpassword123',
      confirmPassword: 'newpassword123',
    });
    apiServiceMock.postDataWithoutToken.and.returnValue(throwError(() => new Error('Error')));
    component.onSubmit();
    expect(toastServiceMock.show).toHaveBeenCalledWith('Fehler beim Zurücksetzen des Passworts.', 'error');
  });
  

  it('should enable submit button if form is valid', () => {
    component.resetPasswordForm.setValue({
      password: 'newpassword123',
      confirmPassword: 'newpassword123',
    });

    fixture.detectChanges();
    const submitButton = fixture.nativeElement.querySelector('button');
    expect(submitButton.disabled).toBe(false);
  });
});
