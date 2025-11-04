import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonialCardComponent } from '../testimonial-card/testimonial-card.component';
import { ITestimonial } from '../../../../../../core/interfaces';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule, TestimonialCardComponent, TranslateModule],
  templateUrl: './testimonials-section.component.html',
})
export class TestimonialsSectionComponent implements OnInit, OnDestroy {
  currentIndex: number = 0;
  isMobile: boolean = false;
  private resizeListener?: () => void;

  testimonials: ITestimonial[] = [
    {
      authorName: 'TESTIMONIALS_SECTION.LIST.0.AUTHOR',
      authorLogo: 'TESTIMONIALS_SECTION.LIST.0.INITIALS',
      testimonial: 'TESTIMONIALS_SECTION.LIST.0.TEXT',
    },
    {
      authorName: 'TESTIMONIALS_SECTION.LIST.1.AUTHOR',
      authorLogo: 'TESTIMONIALS_SECTION.LIST.1.INITIALS',
      testimonial: 'TESTIMONIALS_SECTION.LIST.1.TEXT',
    },
    {
      authorName: 'TESTIMONIALS_SECTION.LIST.2.AUTHOR',
      authorLogo: 'TESTIMONIALS_SECTION.LIST.2.INITIALS',
      testimonial: 'TESTIMONIALS_SECTION.LIST.2.TEXT',
    },
  ];

  ngOnInit(): void {
    this.checkScreenSize();
    this.resizeListener = () => this.checkScreenSize();
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy(): void {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
  }

  get visibleTestimonials(): ITestimonial[] {
    if (this.isMobile) {
      return [this.testimonials[this.currentIndex]];
    }
    return [
      this.testimonials[this.currentIndex],
      this.testimonials[(this.currentIndex + 1) % this.testimonials.length],
    ];
  }

  previousTestimonial(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.testimonials.length) %
      this.testimonials.length;
  }

  nextTestimonial(): void {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }
}
