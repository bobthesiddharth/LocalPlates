import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [RouterModule, NavBarComponent, FooterComponent],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.css'
})
export class ContactPageComponent {}

