export const CarConfigNissan = {
  modelPath: '/assets/models/Nissan/scene.gltf',

  editableMaterials: {
    body: [
      'body',
      'Nissan_SkylineR33NismoSTune_1995Coloured_Material',
    ],
    
    glass: [
      'window',
      'glass.001',
      'Nissan_SkylineR33NismoSTune_1995Window_Material.001',
    ],

    interior: [
      'Nissan_SkylineR33NismoSTune_1995InteriorA_Material',
      'Nissan_SkylineR33NismoSTune_1995InteriorTillingColourZo_536c238',
    ],


    wheels: [
      'spoke',
      'disc',
      'sidewall', 
    ],

    lightsFront: [
      'lightFront',
      'Nissan_SkylineR33NismoSTune_1995Grille6A_Material',
    ],

    lightsRear: [
      'glassBackLight',
      'Nissan_SkylineR33NismoSTune_1995Grille4A_Material',
    ],

    decals: [
      'badge',
      'Nissan_SkylineR33NismoSTune_1995BadgeA_Material',
      'Nissan_SkylineR33NismoSTune_1995NismoSticker_Material',
    ],
  },

  accessories: {
    spoiler: { nodeName: 'Object_67_62', visible: true },
    badge: { nodeName: 'Object_52_46', visible: true },
  },

  wheelStyles: {
    Classic: { color: '#C0C0C0', roughness: 0.5 },
    Sport: { color: '#111111', roughness: 0.2 },
    Offroad: { color: '#333333', roughness: 0.8 },
  },

  lightStyles: {
    LED: { emissive: '#ffffff', intensity: 1.5 },
    Classic: { emissive: '#ffaa00', intensity: 0.8 },
    Smoke: { emissive: '#cc0000', intensity: 0.6 },
  },
};
