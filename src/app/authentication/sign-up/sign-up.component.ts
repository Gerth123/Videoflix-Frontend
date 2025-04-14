import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoutingService } from '../../shared/services/routing-service/routing.service';
import { ToastService } from '../../shared/services/toast-service/toast.service';
import { ApiService } from '../../shared/services/api-service/api.service';

@Component({
  selector: 'app-sign-up',
  imports: [HeaderComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  signUpForm: FormGroup;

  /**
   * Initializes the SignUpComponent.
   *
   * @param fb - The form builder for creating reactive forms.
   * @param routingService - Service for handling routing and navigation.
   * @param toastService - Service for displaying toast notifications.
   * @param apiService - Service for making API calls.
   *
   * Sets up the sign-up form with email, password, confirm password, and remember me controls.
   */
  constructor(private fb: FormBuilder, private routingService: RoutingService, private toastService: ToastService, private apiService: ApiService) {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   *
   * Checks if the email from the dashboard should be pre-filled into the sign-up form.
   */
  ngOnInit(): void {
    if (this.routingService.emailFromDashboard) {
      this.signUpForm.get('email')?.setValue(this.routingService.emailFromDashboard);
    }
  }

  /**
   * Submits the sign-up form.
   *
   * Checks if the email already exists. If the form is valid, passwords match, and the email does not exist,
   * a success toast notification is shown, the form data is sent to the registration endpoint, and the form is reset.
   * An info toast is shown prompting email activation, and after a delay, the user is navigated to the log-in page.
   * If the email exists, an error toast notification is shown instead.
   */
  async onSubmit() {
    const emailExists: boolean = await this.apiService.checkEmailExists(this.signUpForm.value.email);
    if (this.signUpForm.valid && this.signUpForm.value.password === this.signUpForm.value.confirmPassword && !emailExists) {
      this.toastService.show('Erfolgreich gespeichert!', 'success');
      setTimeout(() => this.toastService.show('Bitte die Registrierung in deiner E-Mail aktivieren', 'info'), 1000);
      this.apiService.postData('registration/', this.signUpForm.value).subscribe();
      this.signUpForm.reset();
      setTimeout(() => this.routingService.navigateTo('/log-in'), 3000);
    } else if (this.signUpForm.valid && this.signUpForm.value.password === this.signUpForm.value.confirmPassword && emailExists) {
      this.toastService.show('Bitte überprüfe deine Eingaben und versuche es erneut.', 'error');
    }
  }
}
