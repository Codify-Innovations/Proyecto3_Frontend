import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonialCardComponent } from '../testimonial-card/testimonial-card.component';
import { ITestimonial } from '../../../../../core/interfaces';

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule, TestimonialCardComponent],
  templateUrl: './testimonials-section.component.html',
})
export class TestimonialsSectionComponent {
  currentIndex: number = 0;
  
  testimonials: ITestimonial[] = [
    {
      authorName: 'Javier Cruz',
      authorLogo: 'JC',
      testimonial: '"AutoCut ha revolucionado mi proceso de creación de contenido. Ahora todo lo que necesito está en una sola plataforma, ¡y la IA hace todo mucho más rápido!"'
    },
    {
      authorName: 'María González',
      authorLogo: 'MG',
      testimonial: '"Gracias a AutoCut, he logrado optimizar mis publicaciones y aumentar mi alcance en redes sociales sin complicarme con múltiples herramientas."'
    },
    {
      authorName: 'Carlos Rodríguez',
      authorLogo: 'CR',
      testimonial: '"La integración de IA en AutoCut me ha permitido crear contenido de mejor calidad en menos tiempo. ¡Es la solución perfecta para los creadores de contenido del sector automotriz!"'
    }
  ];

  get visibleTestimonials(): ITestimonial[] {
    return [
      this.testimonials[this.currentIndex],
      this.testimonials[(this.currentIndex + 1) % this.testimonials.length]
    ];
  }

  previousTestimonial(): void {
    this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }

  nextTestimonial(): void {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }
}

