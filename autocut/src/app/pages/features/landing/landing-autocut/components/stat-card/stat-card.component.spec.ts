import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatCardComponent } from './stat-card.component';

describe('StatCardComponent', () => {
  let component: StatCardComponent;
  let fixture: ComponentFixture<StatCardComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StatCardComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  // Test 1: Creación
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test 2: Inputs inicializados vacíos
  it('should initialize with empty inputs', () => {
    expect(component.icon).toBe('');
    expect(component.value).toBe('');
    expect(component.label).toBe('');
  });

  // Test 3: Renderizado del icono
  it('should render icon when provided', () => {
    component.icon = '😊';
    fixture.detectChanges();
    
    const iconSpan = compiled.querySelector('span');
    expect(iconSpan?.textContent).toContain('😊');
  });

  // Test 4: Renderizado del valor
  it('should render value when provided', () => {
    component.value = '250+';
    fixture.detectChanges();
    
    const valueElement = compiled.querySelector('h3');
    expect(valueElement?.textContent?.trim()).toBe('250+');
  });

  // Test 5: Renderizado de la etiqueta
  it('should render label when provided', () => {
    component.label = 'Happy customers';
    fixture.detectChanges();
    
    const labelElement = compiled.querySelector('p');
    expect(labelElement?.textContent?.trim()).toBe('Happy customers');
  });

  // Test 6: Todas las propiedades renderizadas
  it('should render all properties together', () => {
    component.icon = '📊';
    component.value = '1.8K+';
    component.label = 'Resources';
    fixture.detectChanges();
    
    const iconSpan = compiled.querySelector('span');
    const valueElement = compiled.querySelector('h3');
    const labelElement = compiled.querySelector('p');
    
    expect(iconSpan?.textContent).toContain('📊');
    expect(valueElement?.textContent?.trim()).toBe('1.8K+');
    expect(labelElement?.textContent?.trim()).toBe('Resources');
  });

  // Test 7: Estilos aplicados
  it('should have correct styling classes', () => {
    fixture.detectChanges();
    
    const card = compiled.querySelector('.bg-white');
    expect(card).toBeTruthy();
    expect(card?.classList.contains('rounded-lg')).toBeTrue();
  });
});

