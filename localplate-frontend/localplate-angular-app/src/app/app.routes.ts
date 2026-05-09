import { Routes } from '@angular/router';

export const routes: Routes = [
  {
	path: '',
	loadComponent: () => import('./home-page/home-page.component').then(m => m.HomePageComponent)
  },
  {
	path: 'login',
	loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent)
  },
  {
	path: 'signup',
	loadComponent: () => import('./auth/signin.component').then(m => m.SigninComponent)
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
