import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

export const routes: Routes = [
  {
	path: '',
	loadComponent: () => import('./home-page/home-page.component').then(m => m.HomePageComponent),
	canActivate: [GuestGuard]
  },
  {
	path: 'about',
	loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
	canActivate: [GuestGuard]
  },
  {
	path: 'gallery',
	loadComponent: () => import('./pages/gallery-page/gallery-page.component').then(m => m.GalleryPageComponent),
	canActivate: [GuestGuard]
  },
  {
	path: 'find-food',
	loadComponent: () => import('./pages/find-food/find-food.component').then(m => m.FindFoodComponent),
	canActivate: [GuestGuard]
  },
  {
	path: 'feedback',
	loadComponent: () => import('./pages/feedback-page/feedback-page.component').then(m => m.FeedbackPageComponent),
	canActivate: [GuestGuard]
  },
  {
	path: 'contact',
	loadComponent: () => import('./pages/contact-page/contact-page.component').then(m => m.ContactPageComponent),
	canActivate: [GuestGuard]
  },
  {
	path: 'help',
	loadComponent: () => import('./pages/help-page/help-page.component').then(m => m.HelpPageComponent),
	canActivate: [GuestGuard]
  },
  {
	path: 'login',
	loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent),
	canActivate: [GuestGuard]
  },
  {
	path: 'signup',
	loadComponent: () => import('./auth/signin.component').then(m => m.SigninComponent),
	canActivate: [GuestGuard]
  },
  {
	path: 'reset-password',
	loadComponent: () => import('./auth/reset-password.component').then(m => m.ResetPasswordComponent),
	canActivate: [GuestGuard]
  },
  {
	path: 'dashboard',
	loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
	canActivate: [AuthGuard]
  },
  {
	path: 'signin',
	redirectTo: 'signup',
	pathMatch: 'full'
  },
  {
	path: '**',
	redirectTo: ''
  }
];
