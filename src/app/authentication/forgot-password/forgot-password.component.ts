import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastService } from '../../shared/services/toast-service/toast.service';
import { ApiService } from '../../shared/services/api-service/api.service';
import { NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  imports: [HeaderComponent, FooterComponent, ReactiveFormsModule, NgClass],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  
/**
 * Initializes the ForgotPasswordComponent.
 *
 * @param fb - The form builder for creating reactive forms.
 * @param http - The HTTP client for making HTTP requests.
 * @param toastService - Service for displaying toast notifications.
 * @param apiService - Service for making API calls.
 *
 * Sets up the forgot password form with email validation.
 */
  constructor(private fb: FormBuilder, private http: HttpClient, private toastService: ToastService, private apiService: ApiService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  /**
   * Handles the submission of the forgot password form.
   *
   * Makes a POST request to the password-reset endpoint with the form data.
   * If the request is successful, displays an info toast notification that an email was sent if the email exists.
   * If the request fails, displays an error toast notification.
   */
  onSubmit() {
    this.apiService.postData('auth/password-reset/', this.forgotPasswordForm.value).subscribe({
      next: () => {
        this.toastService.show('Falls die E-Mail existiert, wurde eine Nachricht gesendet.', 'info');
        this.forgotPasswordForm.reset();
      },
      error: () => this.toastService.show('Fehler beim Zurücksetzen des Passworts.', 'error'),
    });
  }
}
