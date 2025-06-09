import { Routes } from '@angular/router';
import { LandingPageComponent } from './features/landing-page/landing-page.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { PersonalizationComponent } from './features/personalization/personalization.component';
import { AuthGuard } from './auth.guard';
import { GuestGuard } from './guest.guard';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'registro', component: RegisterComponent, canActivate: [GuestGuard] },
  {
    path: 'personalization',
    component: PersonalizationComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'landing', pathMatch: 'full' },
      { path: 'landing', component: LandingPageComponent },
      { path: 'login-preview', component: LoginComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];