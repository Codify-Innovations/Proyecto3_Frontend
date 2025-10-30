import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestimonialsSectionComponent } from './testimonials-section.component';
import { TestimonialCardComponent } from '../testimonial-card/testimonial-card.component';

describe('TestimonialsSectionComponent', () => {
  let component: TestimonialsSectionComponent;
  let fixture: ComponentFixture<TestimonialsSectionComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestimonialsSectionComponent,
        TestimonialCardComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestimonialsSectionComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  // Test 1: Creación
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test 2: Testimonials array definido
  it('should have testimonials array defined', () => {
    expect(component.testimonials).toBeDefined();
    expect(component.testimonials.length).toBe(3);
  });

  // Test 3: Índice inicial
  it('should initialize currentIndex to 0', () => {
    expect(component.currentIndex).toBe(0);
  });

  // Test 4: Detectar tamaño de pantalla en init
  it('should check screen size on init', () => {
    spyOn(component as any, 'checkScreenSize');
    component.ngOnInit();
    expect((component as any).checkScreenSize).toHaveBeenCalled();
  });

  // Test 5: Limpiar evento en destroy
  it('should remove resize listener on destroy', () => {
    spyOn(window, 'removeEventListener');
    component.ngOnDestroy();
    expect(window.removeEventListener).toHaveBeenCalled();
  });

  // Test 6: CheckScreenSize para desktop
  it('should set isMobile to false for desktop', () => {
    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(1024);
    component.checkScreenSize();
    expect(component.isMobile).toBeFalse();
  });

  // Test 7: CheckScreenSize para móvil
  it('should set isMobile to true for mobile', () => {
    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(375);
    component.checkScreenSize();
    expect(component.isMobile).toBeTrue();
  });

  // Test 8: VisibleTestimonials en móvil
  it('should return 1 testimonial for mobile', () => {
    component.isMobile = true;
    component.currentIndex = 0;
    
    const visible = component.visibleTestimonials;
    
    expect(visible.length).toBe(1);
    expect(visible[0]).toBe(component.testimonials[0]);
  });

  // Test 9: VisibleTestimonials en desktop
  it('should return 2 testimonials for desktop', () => {
    component.isMobile = false;
    component.currentIndex = 0;
    
    const visible = component.visibleTestimonials;
    
    expect(visible.length).toBe(2);
    expect(visible[0]).toBe(component.testimonials[0]);
    expect(visible[1]).toBe(component.testimonials[1]);
  });

  // Test 10: Navegación hacia adelante
  it('should move to next testimonial', () => {
    component.currentIndex = 0;
    component.nextTestimonial();
    expect(component.currentIndex).toBe(1);
  });

  // Test 11: Navegación hacia atrás
  it('should move to previous testimonial', () => {
    component.currentIndex = 1;
    component.previousTestimonial();
    expect(component.currentIndex).toBe(0);
  });

  // Test 12: Navegación circular (siguiente)
  it('should wrap around when moving next from last testimonial', () => {
    component.currentIndex = 2;
    component.nextTestimonial();
    expect(component.currentIndex).toBe(0);
  });

  // Test 13: Navegación circular (anterior)
  it('should wrap around when moving previous from first testimonial', () => {
    component.currentIndex = 0;
    component.previousTestimonial();
    expect(component.currentIndex).toBe(2);
  });

  // Test 14: Botones de navegación presentes
  it('should render navigation buttons', () => {
    const buttons = compiled.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  // Test 15: Sección tiene ID correcto
  it('should have section with id "testimonials"', () => {
    const section = compiled.querySelector('section#testimonials');
    expect(section).toBeTruthy();
  });

  // Test 16: Título renderizado
  it('should render "Testimonials" title', () => {
    const title = compiled.querySelector('h2');
    expect(title?.textContent?.trim()).toBe('Testimonials');
  });
});

