import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-privacy-policy',
  imports: [HeaderComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
})
export class PrivacyPolicyComponent {
  scrollTo(anchor: string) {
    const el = document.getElementById(anchor);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
