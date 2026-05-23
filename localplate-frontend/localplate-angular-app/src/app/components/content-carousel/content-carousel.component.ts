import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

export type CarouselItem = {
  title: string;
  description: string;
  image: string;
  link?: string;
  cta?: string;
};

@Component({
  selector: 'app-content-carousel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './content-carousel.component.html',
  styleUrl: './content-carousel.component.css'
})
export class ContentCarouselComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() items: CarouselItem[] = [];

  activeIndex = 0;

  prev(): void {
    if (this.items.length === 0) {
      return;
    }
    this.activeIndex = (this.activeIndex - 1 + this.items.length) % this.items.length;
  }

  next(): void {
    if (this.items.length === 0) {
      return;
    }
    this.activeIndex = (this.activeIndex + 1) % this.items.length;
  }

  goTo(index: number): void {
    if (index < 0 || index >= this.items.length) {
      return;
    }
    this.activeIndex = index;
  }
}

