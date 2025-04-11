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
import { NgIf } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-log-in',
  imports: [HeaderComponent, FooterComponent, ReactiveFormsModule, NgIf],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss',
})
export class LogInComponent {
  logInForm: FormGroup;
  showPasswordField: boolean = true;

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
    if (!this.logInForm) return;
    if (this.routingService.emailFromDashboard) {
      this.logInForm
        .get('email')
        ?.setValue(this.routingService.emailFromDashboard);
    }
    const rememberMe = localStorage.getItem('remember-me') === 'true';
    const email = localStorage.getItem('auth-user');
    if (rememberMe && email) {
      this.logInForm.get('rememberMe')?.setValue(true);
      this.logInForm
        .get('email')
        ?.setValue(localStorage.getItem('auth-user') || '');
      this.showPasswordField = false;
    }
  }

  async onSubmit() {
    const authToken = localStorage.getItem('auth-token');
    if (
      this.logInForm.valid ||
      (this.logInForm.value.rememberMe && authToken)
    ) {
      const { rememberMe, ...loginData } = this.logInForm.value;
      if (authToken) {
        try {
          let filteredLoginData: any = { email: loginData.email };
          let response = await firstValueFrom(
            this.apiService.postData(this.apiConfigService.LOGIN_URL, filteredLoginData)
          );
          if (response.is_active === true) {
              this.toastService.show('Erfolgreich angemeldet!', 'success');
              this.routingService.navigateTo('/video-offer');
            } else {
              this.toastService.show('Bitte aktiviere dein Konto!', 'error');
            }
        } catch (error) {
          console.error('Error during API call:', error);
        }
      } else {
        this.apiService
          .postData(this.apiConfigService.LOGIN_URL, loginData)
          .subscribe({
            next: (response) => {
              this.apiService.setAuthCredentials(
                response.token,
                response.user_id,
                response.email,
                rememberMe
              );
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
  }

  onCheckboxChange() {
    const rememberMe = this.logInForm.get('rememberMe')?.value;
    const email = localStorage.getItem('auth-user');
    const passwordControl = this.logInForm.get('password');
    if (rememberMe && email) {
      localStorage.setItem('remember-me', 'true');
      this.showPasswordField = false;
      passwordControl?.clearValidators();
    } else {
      localStorage.removeItem('remember-me');
      this.showPasswordField = true;
      passwordControl?.setValidators(Validators.required);
    }
  }

  navigateTo(path: string) {
    this.routingService.navigateTo(path);
  }
}
