import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { CommonModule } from '@angular/common';
import { CarLoaderService } from '../../vehicle-3D/services/car-loader.service';
import { CarConfigs } from '../../vehicle-3D/config/car-configs';

@Component({
  selector: 'app-user-car-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-car-viewer.component.html',
})
export class UserCarViewerComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  /** Modelo guardado del usuario (por ejemplo “Nissan”) */
  @Input() model: keyof typeof CarConfigs = 'Nissan';

  /** Colores opcionales (se pueden pasar desde el perfil) */
  @Input() color = '';
  @Input() glassTint = false;
  @Input() wheelStyle = '';
  @Input() interior = '';
  @Input() frontLight = '';

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private carModel!: THREE.Group;
  private materials: Map<string, THREE.MeshStandardMaterial> = new Map();
  private activeConfig: any = null;

  constructor(private carLoader: CarLoaderService) {}

  async ngOnInit(): Promise<void> {
    this.initScene();
    await this.loadCar();
    this.animate();
  }

  private initScene(): void {
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement!;
    const width = parent.clientWidth || 120;
    const height = parent.clientHeight || 120;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(0, 1.5, 3);

    const ambient = new THREE.AmbientLight(0xffffff, 1);
    const directional = new THREE.DirectionalLight(0xffffff, 1);
    directional.position.set(4, 8, 4);
    this.scene.add(ambient, directional);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 1.0;
    this.controls.update();
  }

  private async loadCar(): Promise<void> {
    const modelData = CarConfigs[this.model];
    this.activeConfig = modelData.config;

    this.carModel = await this.carLoader.loadCar(
      this.scene,
      modelData.modelPath
    );

    // Escalar más pequeño para perfil
  const box = new THREE.Box3().setFromObject(this.carModel);
  const size = new THREE.Vector3();
  box.getSize(size);
  const largest = Math.max(size.x, size.y, size.z);
  const scale = (this.activeConfig?.targetSize ?? 6) / largest;
  this.carModel.scale.setScalar(scale * 0.5);
  this.carModel.position.set(0, -0.1, 0);
  this.scene.add(this.carModel);

    this.materials = this.getAllMaterials();
    this.applyCustomization();
  }

  private getAllMaterials(): Map<string, THREE.MeshStandardMaterial> {
    const materials = new Map<string, THREE.MeshStandardMaterial>();
    this.carModel.traverse((obj: any) => {
      if (obj.isMesh && obj.material) {
        const mats = Array.isArray(obj.material)
          ? obj.material
          : [obj.material];
        mats.forEach((mat: THREE.MeshStandardMaterial) => {
          if (mat.name) materials.set(mat.name, mat);
        });
      }
    });
    return materials;
  }

  private applyCustomization(): void {
    if (this.color) this.updateColor('body', this.color);
    if (this.glassTint) this.updateGlassTint(this.glassTint);
    if (this.interior) this.updateInterior(this.interior);
    if (this.frontLight) this.updateLights(this.frontLight);
    if (this.wheelStyle) this.updateWheels(this.wheelStyle);
  }

  private updateColor(group: string, color: string) {
    const mats = this.activeConfig.editableMaterials[group];
    mats?.forEach((name: string) => {
      const mat = this.materials.get(name);
      if (mat) {
        mat.color.set(color);
        mat.needsUpdate = true;
      }
    });
  }

  private updateGlassTint(isTinted: boolean) {
    const mats = this.activeConfig.editableMaterials.glass || [];
    const cfg = isTinted
      ? { color: '#0a0a0a', opacity: 0.5 }
      : { color: '#ffffff', opacity: 0.1 };
    mats.forEach((name: string) => {
      const mat = this.materials.get(name);
      if (mat) {
        mat.color.set(cfg.color);
        mat.opacity = cfg.opacity;
        mat.transparent = true;
      }
    });
  }

  private updateInterior(color: string) {
    const mats = this.activeConfig.editableMaterials.interior || [];
    mats.forEach((name: string) => {
      const mat = this.materials.get(name);
      if (mat) mat.color.set(color);
    });
  }

  private updateLights(style: string) {
    const cfg = this.activeConfig.frontLightStyles?.[style] || {
      color: '#ffffff',
      intensity: 0.8,
    };
    const parts = this.activeConfig.editableMaterials?.lightsFront || [];
    parts.forEach((name: string) => {
      const mat = this.materials.get(name);
      if (mat) {
        mat.emissive = new THREE.Color(cfg.color);
        mat.emissiveIntensity = cfg.intensity;
      }
    });
  }

  private updateWheels(style: string) {
    const cfg = this.activeConfig.wheelStyles?.[style];
    const mats = this.activeConfig.editableMaterials.wheels || [];
    mats.forEach((name: string) => {
      const mat = this.materials.get(name);
      if (mat && cfg) {
        mat.color.set(cfg.color);
      }
    });
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
