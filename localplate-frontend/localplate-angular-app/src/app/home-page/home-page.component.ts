import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { HeroSectionComponent } from '../hero-section/hero-section.component';
import { UpiSupportCardComponent } from '../upi-support-card/upi-support-card.component';
import { FooterComponent } from '../footer/footer.component';
import { CarouselItem, ContentCarouselComponent } from '../components/content-carousel/content-carousel.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    RouterModule,
    NavBarComponent,
    HeroSectionComponent,
    UpiSupportCardComponent,
    FooterComponent,
    ContentCarouselComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  spotlightSlides: CarouselItem[] = [
    {
      title: 'Morning Tiffin Favorites',
      description: 'Freshly cooked home-style breakfast options from trusted neighborhood kitchens.',
      image: '/assets/images/pic1.jpg',
      link: '/find-food',
      cta: 'See Nearby'
    },
    {
      title: 'Street Bites You Will Love',
      description: 'Spicy, crispy, and affordable snacks perfect for evening cravings.',
      image: '/assets/images/pic6.png',
      link: '/gallery',
      cta: 'Open Gallery'
    },
    {
      title: 'Budget Lunch Specials',
      description: 'Wholesome local meals for students and office-goers without breaking the budget.',
      image: '/assets/images/pic9.jpg',
      link: '/find-food',
      cta: 'Explore Map'
    }
  ];

  cityStoriesSlides: CarouselItem[] = [
    {
      title: 'Best Hidden Gems Around Campus',
      description: 'Discover small spots loved by locals and students for quality and value.',
      image: '/assets/images/pic2.jpg',
      link: '/about',
      cta: 'About LocalPlates'
    },
    {
      title: 'Community Picks of the Week',
      description: 'Places frequently recommended by users through our feedback portal.',
      image: '/assets/images/pic8.jpg',
      link: '/feedback',
      cta: 'Share Feedback'
    },
    {
      title: 'Newly Added Local Spots',
      description: 'Keep up with freshly listed food points and trending dishes in your area.',
      image: '/assets/images/pic10.jpg',
      link: '/gallery',
      cta: 'View Updates'
    }
  ];

}
