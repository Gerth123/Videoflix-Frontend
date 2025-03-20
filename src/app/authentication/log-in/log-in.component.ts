import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RoutingService } from '../../shared/services/routing-service/routing.service';
import { ToastService } from '../../shared/services/toast-service/toast.service';
import { ApiService } from '../../shared/services/api-service/api.service';
import { ApiConfigService } from '../../shared/services/api-config-service/api-config.service';

@Component({
  selector: 'app-log-in',
  imports: [HeaderComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss',
})
export class LogInComponent {
  logInForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private routingService: RoutingService,
    private toastService: ToastService,
    private apiService: ApiService,
    private apiConfigService: ApiConfigService
  ) {
    this.logInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  ngOnInit(): void {
    if (this.routingService.emailFromDashboard) {
      this.logInForm
        .get('email')
        ?.setValue(this.routingService.emailFromDashboard);
    }
  }

  onSubmit() {
    if (this.logInForm.valid) {
      const { rememberMe, ...loginData } = this.logInForm.value;

      this.apiService
        .postDataWithoutToken(this.apiConfigService.LOGIN_URL, loginData)
        .subscribe({
          next: (response) => {
            if (rememberMe) {
              this.apiService.setAuthCredentials(
                response.token,
                response.user_id,
                response.email
              );
            }
            if (response.is_active === true) {
              this.toastService.show('Erfolgreich angemeldet!', 'success');
              this.routingService.navigateTo('/video-offer');
            } else {
              this.toastService.show('Bitte aktiviere dein Konto!', 'error');
            }
          },
          error: (error) => {
            this.toastService.show(
              'Ungültige Kombination aus E-Mail und Passwort.',
              'error'
            );
          },
        });
    }
  }

  navigateTo(path: string) {
    this.routingService.navigateTo(path);
  }
}
