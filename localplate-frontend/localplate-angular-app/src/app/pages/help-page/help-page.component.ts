import { Component } from '@angular/core';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-help-page',
  standalone: true,
  imports: [NavBarComponent, FooterComponent],
  templateUrl: './help-page.component.html',
  styleUrl: './help-page.component.css'
})
export class HelpPageComponent {}

