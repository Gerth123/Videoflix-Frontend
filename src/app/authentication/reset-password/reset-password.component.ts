import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private apiService: ApiService
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];
  }

  onSubmit() {
    if (
      this.resetPasswordForm.value.password !==
      this.resetPasswordForm.value.confirmPassword
    ) {
      this.toastService.show('Passwörter stimmen nicht überein.', 'error');
      return;
    }

    this.apiService
      .postDataWithoutToken('auth/password-reset-confirm/', {
        token: this.token,
        password: this.resetPasswordForm.value.password,
      })
      .subscribe({
        next: () => {
          this.toastService.show('Passwort erfolgreich geändert.', 'success');
          setTimeout(() => this.router.navigate(['/log-in']), 2000);
        },
        error: () => (this.toastService.show('Fehler beim Zurücksetzen des Passworts.', 'error')),
      });
  }
}
