import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';

@Injectable({ providedIn: 'root' })
export class CarLoaderService {
  private loader = new GLTFLoader();

  /**
   * Carga un modelo GLTF del auto en la escena.
   * @param scene Escena de Three.js donde se montará el modelo
   * @param modelPath Ruta del modelo GLTF (por defecto el Nissan)
   */
  async loadCar(scene: THREE.Scene, modelPath: string = '/assets/models/Nissan/scene.gltf'): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
      this.loader.load(
        modelPath,
        (gltf) => {
          const model = gltf.scene;
          scene.add(model);
          resolve(model);
        },
        undefined,
        (err) => reject(err)
      );
    });
  }
}
