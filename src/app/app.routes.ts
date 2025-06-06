import { Routes } from '@angular/router';
import { DashboardComponent } from './authentication/dashboard/dashboard.component';
import { LogInComponent } from './authentication/log-in/log-in.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { ImprintComponent } from './legal-information/imprint/imprint.component';
import { PrivacyPolicyComponent } from './legal-information/privacy-policy/privacy-policy.component';
import { VideoOfferComponent } from './video/video-offer/video-offer.component';
import { AccountConfirmedComponent } from './authentication/account-confirmed/account-confirmed.component';
import { ActivationFailedComponent } from './authentication/activation-failed/activation-failed.component';
import { VideoPlayerComponent } from './video/video-player/video-player.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { VideoDescriptionComponent } from './video/video-description/video-description.component';


export const routes: Routes = [
    { path: '', component: DashboardComponent }, 
    { path: 'log-in', component: LogInComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent }, 
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'account-confirmed', component: AccountConfirmedComponent }, 
    { path: 'activation-failed', component: ActivationFailedComponent }, 
    { path: 'sign-up', component: SignUpComponent },
    { path: 'video-offer', component: VideoOfferComponent },
    { path: 'video-description', component: VideoDescriptionComponent },
    { path: 'video-player/:videoId', component: VideoPlayerComponent },
    { path: 'video-player', component: VideoPlayerComponent },
    { path: 'imprint', component: ImprintComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
  ];