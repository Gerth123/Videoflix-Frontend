import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountConfirmedComponent } from './account-confirmed.component';
import { RoutingService } from '../../shared/services/routing-service/routing.service';
import { By } from '@angular/platform-browser';

describe('AccountConfirmedComponent', () => {
  let component: AccountConfirmedComponent;
  let fixture: ComponentFixture<AccountConfirmedComponent>;
  let routingServiceMock: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    routingServiceMock = jasmine.createSpyObj('RoutingService', ['navigateTo']);
    await TestBed.configureTestingModule({
      imports: [AccountConfirmedComponent],
      providers: [
        { provide: RoutingService, useValue: routingServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountConfirmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login page when "Zum Login" button is clicked', () => {
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);
    expect(routingServiceMock.navigateTo).toHaveBeenCalledWith('/log-in');
  });
});
