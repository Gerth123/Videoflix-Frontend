import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../shared/services/toast-service/toast.service';
import { ApiService } from '../../shared/services/api-service/api.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [HeaderComponent, FooterComponent, ReactiveFormsModule, NgClass],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  token = '';

  /**
   * Initializes the ResetPasswordComponent.
   *
   * @param fb - The form builder for creating reactive forms.
   * @param route - The route for accessing the route parameters.
   * @param router - The router for navigating to other routes.
   * @param toastService - Service for displaying toast notifications.
   * @param apiService - Service for making API calls.
   *
   * Sets up the reset password form with password and confirm password controls.
   */
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private toastService: ToastService, private apiService: ApiService) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  /**
   * Angular lifecycle hook that is called after data-bound properties are initialized.
   *
   * Extracts the token from the URL query parameters and assigns it to the component's token property.
   */
  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];
  }

  /**
   * Submits the reset password form.
   *
   * Checks if the passwords match. If they do not, a toast notification is shown with an error message.
   * If the passwords match, a POST request is made to the password-reset-confirm endpoint with the form data.
   * If the request is successful, a toast notification is shown with a success message, and the user is routed to the log-in page after a 2 second delay.
   * If the request fails, a toast notification is shown with an error message.
   */
  onSubmit() {
    if (this.resetPasswordForm.value.password !== this.resetPasswordForm.value.confirmPassword) {
      this.toastService.show('Passwörter stimmen nicht überein.', 'error');
      return;
    }
    this.apiService.postDataWithoutToken('auth/password-reset-confirm/', { token: this.token, password: this.resetPasswordForm.value.password }).subscribe({
      next: () => {
        this.toastService.show('Passwort erfolgreich geändert.', 'success');
        setTimeout(() => this.router.navigate(['/log-in']), 2000);
      },
      error: () => this.toastService.show('Fehler beim Zurücksetzen des Passworts.', 'error'),
    });
  }
}
