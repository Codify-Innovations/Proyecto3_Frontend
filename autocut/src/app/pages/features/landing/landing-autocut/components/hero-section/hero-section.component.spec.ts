import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HeroSectionComponent } from './hero-section.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeroSectionComponent', () => {
  let component: HeroSectionComponent;
  let fixture: ComponentFixture<HeroSectionComponent>;
  let router: Router;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeroSectionComponent,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSectionComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  // Test 1: Creación
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test 2: Renderizado del título
  it('should render "AutoCut" title', () => {
    const title = compiled.querySelector('h1');
    expect(title).toBeTruthy();
    expect(title?.textContent?.trim()).toBe('AutoCut');
  });

  // Test 3: Renderizado de la descripción
  it('should render description text', () => {
    const description = compiled.querySelector('p');
    expect(description).toBeTruthy();
    expect(description?.textContent).toContain('plataforma innovadora');
  });

  // Test 4: Renderizado de botón Sign Up
  it('should render Sign Up button', () => {
    const buttons = compiled.querySelectorAll('button');
    const signUpButton = Array.from(buttons).find(btn => 
      btn.textContent?.trim() === 'Sign Up'
    );
    expect(signUpButton).toBeTruthy();
  });

  // Test 5: Renderizado de botón Log In
  it('should render Log In button', () => {
    const buttons = compiled.querySelectorAll('button');
    const loginButton = Array.from(buttons).find(btn => 
      btn.textContent?.trim() === 'Log In'
    );
    expect(loginButton).toBeTruthy();
  });

  // Test 6: Navegación a signup
  it('should navigate to signup when navigateToSignup is called', () => {
    spyOn(router, 'navigate');
    
    component.navigateToSignup();
    
    expect(router.navigate).toHaveBeenCalledWith(['/signup']);
  });

  // Test 7: Navegación a login
  it('should navigate to login when navigateToLogin is called', () => {
    spyOn(router, 'navigate');
    
    component.navigateToLogin();
    
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  // Test 8: Renderizado de imagen
  it('should render car editing image when input is provided', () => {
    component.carEditingImage = '/logo/CarEditing.png';
    fixture.detectChanges();
    
    const img = compiled.querySelector('img[alt="AutoCut Car Editing"]') as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.src).toContain('/logo/CarEditing.png');
  });

  // Test 9: Sección tiene ID correcto
  it('should have section with id "product"', () => {
    const section = compiled.querySelector('section#product');
    expect(section).toBeTruthy();
  });

  // Test 10: Grid responsive
  it('should have responsive grid layout', () => {
    const gridContainer = compiled.querySelector('.grid');
    expect(gridContainer).toBeTruthy();
    expect(gridContainer?.classList.contains('grid-cols-1')).toBeTrue();
    expect(gridContainer?.classList.contains('md:grid-cols-2')).toBeTrue();
  });
});

