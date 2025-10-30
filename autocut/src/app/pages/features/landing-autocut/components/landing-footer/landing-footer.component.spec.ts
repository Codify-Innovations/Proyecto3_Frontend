import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingFooterComponent } from './landing-footer.component';

describe('LandingFooterComponent', () => {
  let component: LandingFooterComponent;
  let fixture: ComponentFixture<LandingFooterComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingFooterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingFooterComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  // Test 1: Creación
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test 2: Año actual definido
  it('should have currentYear defined', () => {
    expect(component.currentYear).toBeDefined();
    expect(typeof component.currentYear).toBe('number');
  });

  // Test 3: Año actual correcto
  it('should set currentYear to current year', () => {
    const currentYear = new Date().getFullYear();
    expect(component.currentYear).toBe(currentYear);
  });

  // Test 4: Renderizado del copyright
  it('should render copyright text with current year', () => {
    const paragraph = compiled.querySelector('p');
    expect(paragraph).toBeTruthy();
    expect(paragraph?.textContent).toContain('AutoCut ©');
    expect(paragraph?.textContent).toContain(component.currentYear.toString());
    expect(paragraph?.textContent).toContain('All rights reserved');
  });

  // Test 5: Footer tiene estilos correctos
  it('should have correct styling', () => {
    const footer = compiled.querySelector('footer');
    expect(footer).toBeTruthy();
    expect(footer?.classList.contains('bg-[#424242]')).toBeTrue();
  });
});

