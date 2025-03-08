import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoutingService } from '../../shared/services/routing-service/routing.service';
import { ToastService } from '../../shared/services/toast-service/toast.service';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  dashboardForm: FormGroup;

  constructor(private fb: FormBuilder, private routingService: RoutingService, private toastService: ToastService) {
    this.dashboardForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    let emailExists: boolean = false;
    if (this.dashboardForm.valid && !emailExists) {
      this.routingService.navigateTo('/sign-up');
      this.routingService.emailFromDashboard = this.dashboardForm.value.email;
    } else if (this.dashboardForm.valid && emailExists) {
      this.routingService.navigateTo('/log-in');
      this.routingService.emailFromDashboard = this.dashboardForm.value.email;
    } else {
      this.toastService.show('Please enter a valid email address.');
    }
  }
}
