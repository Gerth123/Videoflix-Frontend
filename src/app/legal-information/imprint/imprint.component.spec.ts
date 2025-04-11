import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprintComponent } from './imprint.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { By } from '@angular/platform-browser';

describe('ImprintComponent', () => {
  let component: ImprintComponent;
  let fixture: ComponentFixture<ImprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImprintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the correct imprint title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const h1 = compiled.querySelector('h1');
    expect(h1?.textContent).toBe('Impressum');
  });
  
  it('should render the contact email link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const emailLink = compiled.querySelector('a[href="mailto:kontakt@robin-gerth.de"]');
    expect(emailLink).toBeTruthy();
  });

  it('should pass legalInformationRoute to the header component', () => {
    const header = fixture.debugElement.query(By.directive(HeaderComponent)).componentInstance;
    expect(header.legalInformationRoute).toBe(true);
  });
});
