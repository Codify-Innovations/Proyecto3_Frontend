import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturesSectionComponent } from './features-section.component';
import { StatCardComponent } from '../stat-card/stat-card.component';

describe('FeaturesSectionComponent', () => {
  let component: FeaturesSectionComponent;
  let fixture: ComponentFixture<FeaturesSectionComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FeaturesSectionComponent,
        StatCardComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturesSectionComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  // Test 1: Creación
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test 2: Título de sección
  it('should render "Features" title', () => {
    const title = compiled.querySelector('h2');
    expect(title).toBeTruthy();
    expect(title?.textContent?.trim()).toBe('Features');
  });

  // Test 3: Stats array definido
  it('should have stats array defined', () => {
    expect(component.stats).toBeDefined();
    expect(component.stats.length).toBeGreaterThan(0);
  });

  // Test 4: Stats contiene 4 elementos
  it('should have 4 stat cards', () => {
    expect(component.stats.length).toBe(4);
  });

  // Test 5: Estructura de stats correcta
  it('should have correct structure for each stat', () => {
    component.stats.forEach(stat => {
      expect(stat.icon).toBeDefined();
      expect(stat.value).toBeDefined();
      expect(stat.label).toBeDefined();
    });
  });

  // Test 6: Valores específicos de stats
  it('should have correct stat values', () => {
    const values = component.stats.map((s: any) => s.value);
    expect(values).toContain('250+');
    expect(values).toContain('600+');
    expect(values).toContain('1.8K+');
    expect(values).toContain('11K+');
  });

  // Test 7: Renderizado de stat cards
  it('should render stat cards', () => {
    const statCards = compiled.querySelectorAll('app-stat-card');
    expect(statCards.length).toBe(4);
  });

  // Test 8: Sección tiene ID correcto
  it('should have section with id "features"', () => {
    const section = compiled.querySelector('section#features');
    expect(section).toBeTruthy();
  });

  // Test 9: SVG del gráfico presente
  it('should render chart SVG', () => {
    const svg = compiled.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  // Test 10: Descripción de features
  it('should render features description', () => {
    const description = compiled.querySelector('p');
    expect(description).toBeTruthy();
    expect(description?.textContent).toContain('AutoCut ofrece');
  });
});

