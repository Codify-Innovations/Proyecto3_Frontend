import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingAutocutPage } from './landing.page';
import { LandingHeaderComponent } from '../components/landing-header/landing-header.component';
import { HeroSectionComponent } from '../components/hero-section/hero-section.component';
import { FeaturesSectionComponent } from '../components/features-section/features-section.component';
import { TestimonialsSectionComponent } from '../components/testimonials-section/testimonials-section.component';
import { LandingFooterComponent } from '../components/landing-footer/landing-footer.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('LandingAutocutPage', () => {
  let component: LandingAutocutPage;
  let fixture: ComponentFixture<LandingAutocutPage>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LandingAutocutPage,
        LandingHeaderComponent,
        HeroSectionComponent,
        FeaturesSectionComponent,
        TestimonialsSectionComponent,
        LandingFooterComponent,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingAutocutPage);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  // Test 1: Creación
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test 2: Logo path definido
  it('should have AutoCutLogo path defined', () => {
    expect(component.AutoCutLogo).toBe('/logo/AutoCut_Logo.png');
  });

  // Test 3: Car editing image path definido
  it('should have carEditingImage path defined', () => {
    expect(component.carEditingImage).toBe('/logo/CarEditing.png');
  });

  // Test 4: Header renderizado
  it('should render landing header', () => {
    const header = compiled.querySelector('app-landing-header');
    expect(header).toBeTruthy();
  });

  // Test 5: Hero section renderizado
  it('should render hero section', () => {
    const hero = compiled.querySelector('app-hero-section');
    expect(hero).toBeTruthy();
  });

  // Test 6: Features section renderizado
  it('should render features section', () => {
    const features = compiled.querySelector('app-features-section');
    expect(features).toBeTruthy();
  });

  // Test 7: Testimonials section renderizado
  it('should render testimonials section', () => {
    const testimonials = compiled.querySelector('app-testimonials-section');
    expect(testimonials).toBeTruthy();
  });

  // Test 8: Footer renderizado
  it('should render landing footer', () => {
    const footer = compiled.querySelector('app-landing-footer');
    expect(footer).toBeTruthy();
  });

  // Test 9: Estructura principal
  it('should have main structure with flex layout', () => {
    const mainDiv = compiled.querySelector('.min-h-screen');
    expect(mainDiv).toBeTruthy();
    expect(mainDiv?.classList.contains('flex')).toBeTrue();
    expect(mainDiv?.classList.contains('flex-col')).toBeTrue();
  });

  // Test 10: Main tag presente
  it('should have main tag with flex-grow', () => {
    const main = compiled.querySelector('main');
    expect(main).toBeTruthy();
    expect(main?.classList.contains('flex-grow')).toBeTrue();
  });
});

