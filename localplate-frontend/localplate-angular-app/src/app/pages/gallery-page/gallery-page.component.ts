import { Component } from '@angular/core';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { PhotoGalleryComponent } from '../../photo-gallery/photo-gallery.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-gallery-page',
  standalone: true,
  imports: [NavBarComponent, PhotoGalleryComponent, FooterComponent],
  templateUrl: './gallery-page.component.html',
  styleUrl: './gallery-page.component.css'
})
export class GalleryPageComponent {}

