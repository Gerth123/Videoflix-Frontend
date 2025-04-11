import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolicyComponent } from './privacy-policy.component';
import { By } from '@angular/platform-browser';
import { HeaderComponent } from '../../shared/header/header.component';

describe('PrivacyPolicyComponent', () => {
  let component: PrivacyPolicyComponent;
  let fixture: ComponentFixture<PrivacyPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyPolicyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the correct privacy policy title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const h1 = compiled.querySelector('h1');
    expect(h1?.textContent).toBe('Datenschutzerklärung');
  });

  it('should render the correct seal link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector(
      'a[href="https://datenschutz-generator.de/"]'
    );
    expect(link).toBeTruthy();
  });

  it('should scroll to the specified anchor element', () => {
    const anchor = 'privacy-section';
    const element = document.createElement('div');
    element.id = anchor;
    document.body.appendChild(element);

    const scrollIntoViewSpy = spyOn(element, 'scrollIntoView');

    component.scrollTo(anchor);

    expect(scrollIntoViewSpy).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });

    document.body.removeChild(element);
  });

  it('should pass legalInformationRoute to the header component', () => {
    const header = fixture.debugElement.query(By.directive(HeaderComponent)).componentInstance;
    expect(header.legalInformationRoute).toBe(true);
  });  
});
