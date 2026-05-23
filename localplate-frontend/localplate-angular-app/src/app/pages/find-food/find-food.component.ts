import { Component } from '@angular/core';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { MapSectionComponent } from '../../map-section/map-section.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-find-food-page',
  standalone: true,
  imports: [NavBarComponent, MapSectionComponent, FooterComponent],
  templateUrl: './find-food.component.html',
  styleUrl: './find-food.component.css'
})
export class FindFoodComponent {}

