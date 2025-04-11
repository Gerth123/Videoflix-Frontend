import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../shared/services/api-service/api.service';
import { ToastService } from '../../shared/services/toast-service/toast.service';
import { HttpClientModule } from '@angular/common/http';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let toastServiceMock: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    apiServiceMock = jasmine.createSpyObj('ApiService', ['postData']);
    toastServiceMock = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientModule, ForgotPasswordComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form as invalid if email is empty', () => {
    component.forgotPasswordForm.controls['email'].setValue('');
    fixture.detectChanges();
    expect(component.forgotPasswordForm.invalid).toBeTrue();
  });

  it('should mark form as valid if email is valid', () => {
    component.forgotPasswordForm.controls['email'].setValue('test@example.com');
    fixture.detectChanges();
    expect(component.forgotPasswordForm.valid).toBeTrue();
  });
});
