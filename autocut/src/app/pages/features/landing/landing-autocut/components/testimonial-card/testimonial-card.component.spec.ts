import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestimonialCardComponent } from './testimonial-card.component';

describe('TestimonialCardComponent', () => {
  let component: TestimonialCardComponent;
  let fixture: ComponentFixture<TestimonialCardComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestimonialCardComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  // Test 1: Creación
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test 2: Inputs vacíos por defecto
  it('should have empty inputs by default', () => {
    expect(component.authorName).toBe('');
    expect(component.authorLogo).toBe('');
    expect(component.testimonial).toBe('');
  });

  // Test 3: Renderizado del autor
  it('should render author name when provided', () => {
    component.authorName = 'John Doe';
    fixture.detectChanges();
    
    const authorElement = compiled.querySelector('p.font-bold');
    expect(authorElement?.textContent?.trim()).toBe('John Doe');
  });

  // Test 4: Renderizado del logo del autor
  it('should render author logo when provided', () => {
    component.authorLogo = 'JD';
    fixture.detectChanges();
    
    const logoElement = compiled.querySelector('.bg-\\[\\#424242\\] span');
    expect(logoElement?.textContent?.trim()).toBe('JD');
  });

  // Test 5: Renderizado del testimonial
  it('should render testimonial text when provided', () => {
    component.testimonial = 'Great product!';
    fixture.detectChanges();
    
    const testimonialElement = compiled.querySelector('p.flex-grow');
    expect(testimonialElement?.textContent?.trim()).toBe('Great product!');
  });

  // Test 6: No renderizar testimonial si está vacío
  it('should not render testimonial if empty', () => {
    component.testimonial = '';
    fixture.detectChanges();
    
    const testimonialElement = compiled.querySelector('p.flex-grow');
    expect(testimonialElement).toBeFalsy();
  });

  // Test 7: Card completa
  it('should render complete testimonial card with all props', () => {
    component.authorName = 'Jane Smith';
    component.authorLogo = 'JS';
    component.testimonial = 'Excellent service and support!';
    fixture.detectChanges();
    
    const authorElement = compiled.querySelector('p.font-bold');
    const logoElement = compiled.querySelector('.bg-\\[\\#424242\\] span');
    const testimonialElement = compiled.querySelector('p.flex-grow');
    
    expect(authorElement?.textContent?.trim()).toBe('Jane Smith');
    expect(logoElement?.textContent?.trim()).toBe('JS');
    expect(testimonialElement?.textContent?.trim()).toBe('Excellent service and support!');
  });
});

