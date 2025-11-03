import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import emailjs from '@emailjs/browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './landing-page.component.html',
})
export class LandingPageComponent {
  public translate: TranslateService = inject(TranslateService);

  switchLang(lang: string): void {
    this.translate.use(lang);
  }

  currentYear: number = new Date().getFullYear();

  // Equipo Ejecutivo
  team = [
    {
      name: 'Alexander Lopez',
      role: 'TEAM.ROLES.TECH_LEAD',
      image:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&auto=format',
    },
    {
      name: 'Emerson Hidalgo',
      role: 'TEAM.ROLES.PROJECT_MANAGER',
      image:
        'https://images.unsplash.com/photo-1531590878845-12627191e687?w=600&auto=format',
    },
    {
      name: 'Luis Diego Dien',
      role: 'TEAM.ROLES.DEVOPS',
      image:
        'https://images.unsplash.com/photo-1488508872907-592763824245?w=600&auto=format',
    },
    {
      name: 'Sebastian Zamora',
      role: 'TEAM.ROLES.QA_TESTER',
      image:
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=600&auto=format',
    },
    {
      name: 'Gabriel Bryan',
      role: 'TEAM.ROLES.QA_TESTER',
      image:
        'https://images.unsplash.com/photo-1499470932971-a90681ce8530?w=600&auto=format',
    },
  ];

  missions: { icon: SafeHtml; text: string }[] = [];
  visions: { icon: SafeHtml; text: string }[] = [];

  images = [
    'assets/img/login/cenfoscore.png',
    'assets/img/login/ecosecha.png',
    'assets/img/login/gestionMultas.png',
    'assets/img/login/healthTag.png',
  ];

  currentIndex = 0;
  interval: any;

  // Campos de estado para el formulario de contacto
  isSending = false;
  successMessage = '';
  errorMessage = '';

  constructor(private sanitizer: DomSanitizer) {
    // Misiones
    this.missions = [
      {
        icon: this.sanitize(`
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-[#A4FF4D]" fill="none" viewBox="0 0 24 24" stroke="#A4FF4D" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        `),
        text: 'Deliver cutting-edge technology solutions that empower global scalability.',
      },
      {
        icon: this.sanitize(`
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-[#A4FF4D]" fill="none" viewBox="0 0 24 24" stroke="#A4FF4D" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10h14V10"/>
          </svg>
        `),
        text: 'Build solid digital infrastructures that foster innovation and collaboration.',
      },
      {
        icon: this.sanitize(`
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-[#A4FF4D]" fill="none" viewBox="0 0 24 24" stroke="#A4FF4D" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        `),
        text: 'Strive for excellence through intelligence, creativity, and trust.',
      },
      {
        icon: this.sanitize(`
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-[#A4FF4D]" fill="none" viewBox="0 0 24 24" stroke="#A4FF4D" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        `),
        text: 'Promote transparent communication and unity across every team.',
      },
    ];

    // Visiones
    this.visions = [
      {
        icon: this.sanitize(`
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-[#A4FF4D]" fill="none" viewBox="0 0 24 24" stroke="#A4FF4D" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-4 0-8 2-8 4s4 4 8 4 8-2 8-4-4-4-8-4z"/>
          </svg>
        `),
        text: 'Drive global impact through interconnected and intelligent ecosystems.',
      },
      {
        icon: this.sanitize(`
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-[#A4FF4D]" fill="none" viewBox="0 0 24 24" stroke="#A4FF4D" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        `),
        text: 'Lead innovation with responsibility, sustainability, and human values.',
      },
      {
        icon: this.sanitize(`
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-[#A4FF4D]" fill="none" viewBox="0 0 24 24" stroke="#A4FF4D" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l9-9 9 9-9 9-9-9z"/>
          </svg>
        `),
        text: 'Empower creativity, design, and excellence across all disciplines.',
      },
      {
        icon: this.sanitize(`
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-[#A4FF4D]" fill="none" viewBox="0 0 24 24" stroke="#A4FF4D" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 19V6l12 6-12 7z"/>
          </svg>
        `),
        text: 'Inspire digital evolution and growth through continuous innovation.',
      },
    ];

    this.startAutoSlide();
  }

  sendEmail(event: Event): void {
    event.preventDefault();
    this.isSending = true;
    this.successMessage = '';
    this.errorMessage = '';

    console.log(
      Object.fromEntries(new FormData(event.target as HTMLFormElement))
    );

    emailjs
      .sendForm(
        'service_n4yv1c4',
        'template_a9i40tl',
        event.target as HTMLFormElement,
        'NPDNnaAB5rw2av4j8'
      )
      .then(() => {
        this.isSending = false;
        this.successMessage = this.successMessage = this.translate.instant(
          'CONTACT.STATUS.SUCCESS'
        );

        (event.target as HTMLFormElement).reset();
      })
      .catch((error: any) => {
        console.error('Error al enviar el mensaje:', error);
        this.isSending = false;
        this.errorMessage = this.translate.instant('CONTACT.STATUS.ERROR');
      });
  }

  private sanitize(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  //Carousel logic
  startAutoSlide() {
    this.interval = setInterval(() => this.nextSlide(), 5000);
  }

  pauseAutoSlide() {
    clearInterval(this.interval);
  }

  resumeAutoSlide() {
    this.startAutoSlide();
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevSlide() {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }
}
