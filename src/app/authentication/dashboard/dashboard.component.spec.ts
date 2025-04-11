import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { ApiService } from '../../shared/services/api-service/api.service';
import { RoutingService } from '../../shared/services/routing-service/routing.service';
import { ToastService } from '../../shared/services/toast-service/toast.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let routingServiceMock: jasmine.SpyObj<RoutingService>;
  let toastServiceMock: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    apiServiceMock = jasmine.createSpyObj('ApiService', ['checkEmailExists']);
    routingServiceMock = jasmine.createSpyObj('RoutingService', ['navigateTo']);
    toastServiceMock = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DashboardComponent],
      providers: [
        FormBuilder,
        { provide: ApiService, useValue: apiServiceMock },
        { provide: RoutingService, useValue: routingServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark the form as invalid when email is empty', () => {
    component.dashboardForm.controls['email'].setValue('');
    fixture.detectChanges();
    expect(component.dashboardForm.invalid).toBeTrue();
  });

  it('should mark the form as valid when a valid email is entered', () => {
    component.dashboardForm.controls['email'].setValue('test@example.com');
    fixture.detectChanges();
    expect(component.dashboardForm.valid).toBeTrue();
  });
});
