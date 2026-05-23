import { Component } from '@angular/core';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [NavBarComponent, FooterComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {}

