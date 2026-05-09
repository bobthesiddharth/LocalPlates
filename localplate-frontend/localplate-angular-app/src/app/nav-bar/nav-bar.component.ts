import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule],
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

  closeMenu(): void {
    this.isMenuOpen = false;
    this.isMoreOpen = false;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.isMoreOpen = false;
  }
}
