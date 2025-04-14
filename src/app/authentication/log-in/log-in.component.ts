import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

  /**
   * Initializes the LogInComponent.
   *
   * @param fb - The form builder for creating reactive forms.
   * @param routingService - Service for handling routing and navigation.
   * @param toastService - Service for displaying toast notifications.
   * @param apiService - Service for making API calls.
   * @param apiConfigService - Service for accessing API configuration settings.
   *
   * Sets up the login form with email, password, and remember me controls.
   */
  constructor(
    private fb: FormBuilder,
    private routingService: RoutingService,
    private toastService: ToastService,
    private apiService: ApiService,
    private apiConfigService: ApiConfigService,
  ) {
    this.logInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   *
   * Checks if the email from the dashboard should be pre-filled into the login form.
   * Checks if the user has previously checked "Remember me" and pre-fills the email and sets the
   * rememberMe flag to true if so. If so, also hides the password field.
   */
  ngOnInit(): void {
    if (!this.logInForm) return;
    if (this.routingService.emailFromDashboard) {
      this.logInForm.get('email')?.setValue(this.routingService.emailFromDashboard);
    }
    const rememberMe = localStorage.getItem('remember-me') === 'true';
    const email = localStorage.getItem('auth-user');
    if (rememberMe && email) {
      this.logInForm.get('rememberMe')?.setValue(true);
      this.logInForm.get('email')?.setValue(localStorage.getItem('auth-user') || '');
      this.showPasswordField = false;
    }
  }

  /**
   * Submits the login form.
   *
   * If the form is valid, logs the user in. If the user has previously checked "Remember me", uses the stored auth token to log in.
   * If the form is invalid, shows an error toast notification with an error message.
   *
   * @returns A promise that resolves when the user has been logged in or an error toast notification has been shown.
   */
  async onSubmit() {
    const authToken = localStorage.getItem('auth-token');
    if (this.logInForm.valid || (this.logInForm.value.rememberMe && authToken)) {
      const { rememberMe, ...loginData } = this.logInForm.value;
      if (authToken) {
        await this.login(loginData);
      } else {
        this.apiService.postData(this.apiConfigService.LOGIN_URL, loginData).subscribe({
          next: (res) => {
            this.apiService.setAuthCredentials(res.token, res.user_id, res.email, rememberMe);
            res.is_active
              ? (this.toastService.show('Erfolgreich angemeldet!', 'success'), this.routingService.navigateTo('/video-offer'))
              : this.toastService.show('Bitte aktiviere dein Konto!', 'error');
          },
          error: () => this.toastService.show('Ungültige Kombination aus E-Mail und Passwort.', 'error'),
        });
      }
    }
  }

  /**
   * Makes a login API call with the given login data.
   *
   * @param loginData - The data to be sent in the login API call.
   *
   * Shows a success toast and navigates to the video offer page if the login call is successful and the user is active.
   * Shows an error toast if the user is not active.
   * Shows an error toast and logs the error if the API call fails.
   */
  async login(loginData: any) {
    try {
      let filteredLoginData: any = { email: loginData.email };
      let response = await firstValueFrom(this.apiService.postData(this.apiConfigService.LOGIN_URL, filteredLoginData));
      if (response.is_active === true) {
        this.toastService.show('Erfolgreich angemeldet!', 'success');
        this.routingService.navigateTo('/video-offer');
      } else this.toastService.show('Bitte aktiviere dein Konto!', 'error');
    } catch (error) {
      console.error('Error during API call:', error);
    }
  }

  /**
   * Toggles the `showPasswordField` flag and sets/clears the `required` validator on the `password` control based on the value of the `rememberMe` checkbox.
   *
   * If the `rememberMe` checkbox is checked and there is an `auth-user` stored in local storage, the `password` control is cleared of validators and the `showPasswordField` flag is set to `false`.
   * Otherwise, the `password` control has the `required` validator set and the `showPasswordField` flag is set to `true`.
   */
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

/**
 * Navigates to the specified path using the RoutingService.
 *
 * @param path - The path to navigate to.
 */
  navigateTo(path: string) {
    this.routingService.navigateTo(path);
  }
}
