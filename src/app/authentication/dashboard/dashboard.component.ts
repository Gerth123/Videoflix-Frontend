import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoutingService } from '../../shared/services/routing-service/routing.service';
import { ToastService } from '../../shared/services/toast-service/toast.service';
import { NgClass } from '@angular/common';
import { ApiService } from '../../shared/services/api-service/api.service';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, FooterComponent, ReactiveFormsModule, NgClass],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  dashboardForm: FormGroup;

  constructor(private fb: FormBuilder, private routingService: RoutingService, private toastService: ToastService, private apiService: ApiService) {
    this.dashboardForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async onSubmit() {
    const emailExists: boolean = await this.apiService.checkEmailExists(this.dashboardForm.value.email);
    if (this.dashboardForm.valid && !emailExists) {
      this.routingService.navigateTo('/sign-up');
      this.routingService.emailFromDashboard = this.dashboardForm.value.email;
      this.toastService.show('Zuerst registrieren', 'info');
    } else if (this.dashboardForm.valid && emailExists) {
      this.routingService.navigateTo('/log-in');
      this.routingService.emailFromDashboard = this.dashboardForm.value.email;
      this.toastService.show('Zuerst anmelden', 'info');
    } else {
      this.toastService.show('Bitte eine gültige E-Mail Adresse eingeben!', 'error');
    }
  }
}
