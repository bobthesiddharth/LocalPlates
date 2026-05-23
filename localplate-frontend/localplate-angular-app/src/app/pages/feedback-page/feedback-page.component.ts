import { Component } from '@angular/core';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { FeedbackSectionComponent } from '../../feedback-section/feedback-section.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-feedback-page',
  standalone: true,
  imports: [NavBarComponent, FeedbackSectionComponent, FooterComponent],
  templateUrl: './feedback-page.component.html',
  styleUrl: './feedback-page.component.css'
})
export class FeedbackPageComponent {}

