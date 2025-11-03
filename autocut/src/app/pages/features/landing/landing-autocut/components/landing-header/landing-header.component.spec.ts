import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LandingHeaderComponent } from './landing-header.component';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

describe('LandingHeaderComponent', () => {
  let component: LandingHeaderComponent;
  let fixture: ComponentFixture<LandingHeaderComponent>;
  let router: Router;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LandingHeaderComponent,
        CommonModule,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingHeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  // Test 1: Creación del componente
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test 2: Renderizado del logo
  it('should render logo when AutoCutLogo input is provided', () => {
    component.AutoCutLogo = '/logo/AutoCut_Logo.png';
    fixture.detectChanges();
    
    const logoImg = compiled.querySelector('img[alt="AutoCut Logo"]') as HTMLImageElement;
    expect(logoImg).toBeTruthy();
    expect(logoImg.src).toContain('/logo/AutoCut_Logo.png');
  });

  // Test 3: Estado inicial del menú móvil
  it('should initialize with menu closed', () => {
    expect(component.isMenuOpen).toBeFalse();
  });

  // Test 4: Toggle del menú
  it('should toggle menu when toggleMenu is called', () => {
    expect(component.isMenuOpen).toBeFalse();
    
    component.toggleMenu();
    expect(component.isMenuOpen).toBeTrue();
    
    component.toggleMenu();
    expect(component.isMenuOpen).toBeFalse();
  });

  // Test 5: Menú móvil visible cuando está abierto
  it('should show mobile menu when isMenuOpen is true', () => {
    component.isMenuOpen = true;
    fixture.detectChanges();
    
    const mobileMenu = compiled.querySelector('[class*="md:hidden"]');
    expect(mobileMenu).toBeTruthy();
  });

  // Test 6: Menú móvil oculto cuando está cerrado
  it('should hide mobile menu when isMenuOpen is false', () => {
    component.isMenuOpen = false;
    fixture.detectChanges();
    
    const mobileMenu = compiled.querySelector('.md\\:hidden.pb-4');
    expect(mobileMenu).toBeFalsy();
  });

  // Test 7: Scroll a sección
  it('should scroll to section when scrollToSection is called', () => {
    const mockElement = document.createElement('div');
    mockElement.id = 'test-section';
    spyOn(mockElement, 'scrollIntoView');
    spyOn(document, 'getElementById').and.returnValue(mockElement);
    
    component.scrollToSection('test-section');
    
    expect(document.getElementById).toHaveBeenCalledWith('test-section');
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start'
    });
  });

  // Test 8: Scroll a sección cierra el menú móvil
  it('should close mobile menu when scrollToSection is called', () => {
    const mockElement = document.createElement('div');
    mockElement.id = 'test-section';
    spyOn(document, 'getElementById').and.returnValue(mockElement);
    
    component.isMenuOpen = true;
    component.scrollToSection('test-section');
    
    expect(component.isMenuOpen).toBeFalse();
  });

  // Test 9: Navegación a login
  it('should navigate to login when navigateToLogin is called', () => {
    spyOn(router, 'navigate');
    
    component.navigateToLogin();
    
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  // Test 10: Botones de navegación presentes
  it('should render navigation buttons for Product, Features, and Testimonials', () => {
    fixture.detectChanges();
    const buttons = compiled.querySelectorAll('button');
    const buttonTexts = Array.from(buttons).map(btn => btn.textContent?.trim());
    
    expect(buttonTexts.some(text => text?.includes('Product'))).toBeTrue();
    expect(buttonTexts.some(text => text?.includes('Features'))).toBeTrue();
    expect(buttonTexts.some(text => text?.includes('Testimonials'))).toBeTrue();
  });

  // Test 11: Botón de hamburguesa presente
  it('should render hamburger button for mobile', () => {
    fixture.detectChanges();
    const hamburgerBtn = compiled.querySelector('button.md\\:hidden');
    expect(hamburgerBtn).toBeTruthy();
  });

  // Test 12: Icono de menú cambia según estado
  it('should toggle hamburger icon when menu opens/closes', () => {
    component.isMenuOpen = false;
    fixture.detectChanges();
    
    let menuIcon = compiled.querySelector('.md\\:hidden svg');
    expect(menuIcon).toBeTruthy();
    
    component.isMenuOpen = true;
    fixture.detectChanges();
    
    menuIcon = compiled.querySelector('.md\\:hidden svg');
    expect(menuIcon).toBeTruthy();
  });
});

