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

@Component({
  selector: 'app-sign-up',
  imports: [HeaderComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  signUpForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private routingService: RoutingService,
    private toastService: ToastService,
    private apiService: ApiService
  ) {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  ngOnInit(): void {
    if (this.routingService.emailFromDashboard) {
      this.signUpForm
        .get('email')
        ?.setValue(this.routingService.emailFromDashboard);
    }
  }

  async onSubmit() {
    const emailExists: boolean = await this.apiService.checkEmailExists(this.signUpForm.value.email);
    if (
      this.signUpForm.valid &&
      this.signUpForm.value.password ===
        this.signUpForm.value.confirmPassword &&
      !emailExists
    ) {
      this.toastService.show('Erfolgreich gespeichert!', 'success');
      setTimeout(
        () =>
          this.toastService.show(
            'Bitte die Registrierung in deiner E-Mail aktivieren',
            'info'
          ),
        1000
      );
      this.apiService
        .postData('registration/', this.signUpForm.value)
        .subscribe();
      this.signUpForm.reset();
      setTimeout(() => this.routingService.navigateTo('/log-in'), 3000);
    } else if (
      this.signUpForm.valid &&
      this.signUpForm.value.password ===
        this.signUpForm.value.confirmPassword &&
      emailExists
    ) {
      this.toastService.show(
        'Bitte überprüfe deine Eingaben und versuche es erneut.',
        'error'
      );
    }
  }
}
