import { Routes } from '@angular/router';
import { DashboardComponent } from './authentication/dashboard/dashboard.component';
import { LogInComponent } from './authentication/log-in/log-in.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { ImprintComponent } from './legal-information/imprint/imprint.component';
import { PrivacyPolicyComponent } from './legal-information/privacy-policy/privacy-policy.component';
import { VideoOfferComponent } from './video/video-offer/video-offer.component';


export const routes: Routes = [
    { path: '', component: DashboardComponent }, 
    { path: 'log-in', component: LogInComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent }, 
    // { path: 'new-password', component: NewPasswordComponent }, 
    { path: 'sign-up', component: SignUpComponent },
    { path: 'video-offer', component: VideoOfferComponent },
  
    // {
    //   path: 'main/:uid',
    //   component: MainComponent,
    //   children: [
    //     { path: 'channel/:channelId', component: MainMessageAreaComponent, children: [
    //       {
    //         path: 'thread/:messageId',
    //         component: ThreadComponent, 
    //       },
    //     ]},
    //     { path: 'privateChat/:privateChatId', component: PrivateChatComponent },
    //     { path: '', component: NewMessagePlaceholderComponent },
    //   ],
    // },
    
    { path: 'imprint', component: ImprintComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
  ];