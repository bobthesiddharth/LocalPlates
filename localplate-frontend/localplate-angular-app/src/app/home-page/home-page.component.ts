import { Component } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { HeroSectionComponent } from '../hero-section/hero-section.component';
import { PhotoGalleryComponent } from '../photo-gallery/photo-gallery.component';
import { MapSectionComponent } from '../map-section/map-section.component';
import { FeedbackSectionComponent } from '../feedback-section/feedback-section.component';
import { UpiSupportCardComponent } from '../upi-support-card/upi-support-card.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NavBarComponent, HeroSectionComponent, PhotoGalleryComponent, MapSectionComponent, FeedbackSectionComponent, UpiSupportCardComponent, FooterComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
