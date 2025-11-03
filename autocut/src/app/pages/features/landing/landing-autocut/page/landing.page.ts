import { Component } from '@angular/core';
import { LandingHeaderComponent } from '../components/landing-header/landing-header.component';
import { HeroSectionComponent } from '../components/hero-section/hero-section.component';
import { FeaturesSectionComponent } from '../components/features-section/features-section.component';
import { TestimonialsSectionComponent } from '../components/testimonials-section/testimonials-section.component';
import { LandingFooterComponent } from '../components/landing-footer/landing-footer.component';

@Component({
  selector: 'landing-autocut',
  standalone: true,
  imports: [
    LandingHeaderComponent,
    HeroSectionComponent,
    FeaturesSectionComponent,
    TestimonialsSectionComponent,
    LandingFooterComponent
  ],
  templateUrl: './landing.page.html',
})
export class LandingAutocutPage {
  AutoCutLogo = '/logo/AutoCut_Logo.png';
  carEditingImage = '/logo/CarEditing.png';
}
