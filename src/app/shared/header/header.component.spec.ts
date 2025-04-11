import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { RoutingService } from '../services/routing-service/routing.service';
import { ToastService } from '../services/toast-service/toast.service';
import { Location } from '@angular/common';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let routingServiceSpy: jasmine.SpyObj<RoutingService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let locationSpy: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    const routingSpy = jasmine.createSpyObj('RoutingService', ['navigateTo']);
    const toastSpy = jasmine.createSpyObj('ToastService', ['show']);
    const locationMock = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: RoutingService, useValue: routingSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: Location, useValue: locationMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    routingServiceSpy = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;
    toastServiceSpy = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    locationSpy = TestBed.inject(Location) as jasmine.SpyObj<Location>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call routingService.navigateTo with correct route', () => {
    component.navigateTo('home');
    expect(routingServiceSpy.navigateTo).toHaveBeenCalledWith('home');
  });

  it('should clear localStorage and show toast when navigating to "log-in"', () => {
    spyOn(localStorage, 'clear');
    component.navigateTo('log-in');
    expect(localStorage.clear).toHaveBeenCalled();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('Du wurdest erfolgreich abgemeldet', 'success');
  });

  it('should call location.back() when goBack is called', () => {
    component.goBack();
    expect(locationSpy.back).toHaveBeenCalled();
  });
});
