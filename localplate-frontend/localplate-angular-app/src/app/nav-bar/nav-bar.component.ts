import { Component, HostListener } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  isMenuOpen = false;
  isMoreOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      this.isMoreOpen = false;
    }
  }

  toggleMoreMenu(event: Event): void {
    event.stopPropagation();
    this.isMoreOpen = !this.isMoreOpen;
  }

  constructor(private auth: AuthService, private router: Router) {}

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  logout(): void {
    this.auth.logout();
    // After logout redirect to home (landing)
    this.router.navigateByUrl('/');
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    this.isMoreOpen = false;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.isMoreOpen = false;
  }
}
