import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { CarLoaderService } from '../../services/car-loader.service';
import { CarConfigs } from '../../config/car-configs';

@Component({
  selector: 'app-vehicle-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle-viewer.component.html',
})
export class VehicleViewerComponent implements OnInit, OnChanges {
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() selectedModel: keyof typeof CarConfigs = 'Nissan';
  @Input() color!: string;
  @Input() wheels!: string;
  @Input() accessory!: string;
  @Input() glassTint!: boolean;
  @Input() interior!: string;
  @Input() frontLight!: string;

  loading = false;

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
    await this.loadSelectedModel();
    this.animate();
    window.addEventListener('resize', () => this.onWindowResize());
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    // Si cambia el modelo seleccionado, recargarlo completo
    if (changes['selectedModel'] && !changes['selectedModel'].firstChange) {
      await this.loadSelectedModel();
      return;
    }

    if (!this.carModel || !this.activeConfig) return;

    // Actualizaciones dinámicas de materiales
    if (changes['color'])
      this.updateMaterialGroupColor('body', changes['color'].currentValue);
    if (changes['glassTint'])
      this.updateGlassTint(changes['glassTint'].currentValue);
    if (changes['interior'])
      this.updateInterior(changes['interior'].currentValue);
    if (changes['frontLight'])
      this.updateFrontLights(changes['frontLight'].currentValue);
    if (changes['wheels'])
      this.updateWheelStyle(changes['wheels'].currentValue);
    if (changes['accessory'])
      this.toggleAccessory(changes['accessory'].currentValue);
  }

  /** Carga el modelo 3D y ajusta escala/posición */
  private async loadSelectedModel(): Promise<void> {
    const modelData = CarConfigs[this.selectedModel];
    this.activeConfig = modelData.config;

    if (this.carModel) this.scene.remove(this.carModel);

    // Cargar GLTF
    this.carModel = await this.carLoader.loadCar(
      this.scene,
      modelData.modelPath
    );

    // --- Normalizar tamaño y posición ---
    const box = new THREE.Box3().setFromObject(this.carModel);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const targetSize = modelData.targetSize ?? 7;
    const largestDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = targetSize / largestDim;

    this.carModel.scale.setScalar(scaleFactor * (modelData.modelScale ?? 1));
    this.carModel.position.sub(center);
    this.carModel.position.y -= box.min.y * scaleFactor;
    this.carModel.position.y += modelData.yOffset ?? 1.5;

    // Reposicionar cámara
    this.camera.position.set(0, 2.5, 8);
    this.controls.target.set(0, 1.5, 0);
    this.controls.update();

    this.materials = this.getAllMaterials();
    console.log(`Modelo ${this.selectedModel} cargado correctamente.`);
  }

  /** Configuración de la escena */
  private initScene(): void {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 2.5, 8);

    const ambient = new THREE.AmbientLight(0xffffff, 1);
    const directional = new THREE.DirectionalLight(0xffffff, 1);
    directional.position.set(5, 10, 5);
    this.scene.add(ambient, directional);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.target.set(0, 1, 0);
    this.controls.minDistance = 6;
    this.controls.maxDistance = 10;
    this.controls.update();
  }

  /** Escaneo y mapeo de materiales del modelo */
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

  /** Carrocería */
  private updateMaterialGroupColor(group: string, color: string) {
    const mats = this.activeConfig.editableMaterials[group];
    if (!mats) return;
    mats.forEach((name: string) => {
      const mat = this.materials.get(name);
      if (mat) {
        mat.color.set(color);
        mat.needsUpdate = true;
      }
    });
  }

  /** Vidrios polarizados */
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
        mat.needsUpdate = true;
      }
    });
  }

  /** Interior */
  private updateInterior(color: string) {
    const mats = this.activeConfig.editableMaterials.interior || [];
    mats.forEach((name: string) => {
      const mat = this.materials.get(name);
      if (mat) {
        mat.color.set(color);
        mat.roughness = 0.8;
        mat.needsUpdate = true;
      }
    });
  }

  /** Faros delanteros */
  private updateFrontLights(style: string) {
    const configs = this.activeConfig.frontLightStyles ||
      this.activeConfig.lightStyles || {
        Reset: { color: '#000000', intensity: 0.1 },
        Classic: { color: '#ffffff', intensity: 0.6 },
        LED: { color: '#a4ff4d', intensity: 1.0 },
        Xenon: { color: '#99ccff', intensity: 1.2 },
      };

    const cfg = configs?.[style];
    if (!cfg) return;

    const lightParts =
      this.activeConfig.editableMaterials?.lightsFront ||
      CarConfigs[this.selectedModel]?.lights ||
      [];

    lightParts.forEach((name: string) => {
      const mat = this.materials.get(name);
      if (mat) {
        mat.emissive = new THREE.Color(cfg.color);
        mat.emissiveIntensity = cfg.intensity;
        mat.needsUpdate = true;
      }
    });
  }

  /** Llantas / Rines */
  private updateWheelStyle(style: string) {
    const cfg = this.activeConfig.wheelStyles?.[style];
    if (!cfg) return;
    const mats = this.activeConfig.editableMaterials.wheels || [];
    mats.forEach((name: string) => {
      const mat = this.materials.get(name);
      if (mat) {
        mat.color.set(cfg.color);
        mat.roughness = cfg.roughness;
        mat.metalness = 0.8;
        mat.needsUpdate = true;
      }
    });
  }

  /** Accesorios visibles / ocultos */
  private toggleAccessory(accessory: string) {
    Object.entries(this.activeConfig.accessories || {}).forEach(
      ([name, cfg]: any) => {
        this.carModel.traverse((obj: any) => {
          if (obj.name === cfg.nodeName) {
            obj.visible = accessory === name ? !cfg.visible : cfg.visible;
          }
        });
      }
    );
  }

  /** Redimensionar */
  private onWindowResize(): void {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /** Animación continua */
  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
