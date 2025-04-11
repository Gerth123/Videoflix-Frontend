import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { RoutingService } from '../services/routing-service/routing.service';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let routingServiceSpy: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    const routingSpy = jasmine.createSpyObj('RoutingService', ['navigateTo']);

    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [
        { provide: RoutingService, useValue: routingSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;

    routingServiceSpy = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call routingService.navigateTo with correct route', () => {
    const route = 'home';
    component.navigateTo(route);
    expect(routingServiceSpy.navigateTo).toHaveBeenCalledWith(route);
  });
});
