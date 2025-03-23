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

  constructor(private fb: FormBuilder, private http: HttpClient, private toastService: ToastService, private apiService: ApiService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

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
