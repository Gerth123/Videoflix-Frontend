import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivationFailedComponent } from './activation-failed.component';
import { RoutingService } from '../../shared/services/routing-service/routing.service';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ActivationFailedComponent', () => {
  let component: ActivationFailedComponent;
  let fixture: ComponentFixture<ActivationFailedComponent>;
  let routingServiceMock: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    routingServiceMock = jasmine.createSpyObj('RoutingService', ['navigateTo']);

    await TestBed.configureTestingModule({
      imports: [ActivationFailedComponent],
      providers: [
        { provide: RoutingService, useValue: routingServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivationFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to sign-up page when "Erneut versuchen" button is clicked', () => {
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);
    expect(routingServiceMock.navigateTo).toHaveBeenCalledWith('/sign-up');
  });
});
