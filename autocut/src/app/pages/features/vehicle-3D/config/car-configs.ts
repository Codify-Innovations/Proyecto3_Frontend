import { CarConfigFord } from './car-config-ford';
import { CarConfigMitsubishi } from './car-config-mitsubishi';
import { CarConfigNissan } from './car-config-nissan';

export const CarConfigs = {
  Nissan: {
    modelPath: '/assets/models/Nissan/scene.gltf',
    config: CarConfigNissan,
    displayName: 'Nissan GT-R R33',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Nissan_2020_logo.svg',
    lights: ['Headlight_L', 'Headlight_R'], 
    targetSize: 6,
    yOffset: 1.5,
    modelScale: 1.1,
  },

  Ford: {
    modelPath: '/assets/models/Ford/scene.gltf',
    config: CarConfigFord,
    displayName: 'Ford Mustang GT',
    logo: 'https://images.seeklogo.com/logo-png/5/2/ford-logo-png_seeklogo-56581.png',
    lights: ['Lamp_Front_L', 'Lamp_Front_R'], 
    targetSize: 6,
    yOffset: 63.5,
    modelScale: 1.05,
  },

  Mitsubishi: {
    modelPath: '/assets/models/Mitsubishi/scene.gltf',
    config: CarConfigMitsubishi,
    displayName: 'Mitsubishi Lancer',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Mitsubishi-logo.png/1200px-Mitsubishi-logo.png',
    lights: ['FrontLight_1', 'FrontLight_2'], 
    targetSize: 6,
    yOffset: 0.9,
    modelScale: 1.0,
  },
};
