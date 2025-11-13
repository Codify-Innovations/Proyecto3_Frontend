// car-config-ford.ts
export const CarConfigFord = {
  editableMaterials: {
    body: ['carpaint', 'blue', 'white', 'material'],

    glass: ['windowglass', 'clearglass'],

    frontLights: ['orangeglass'], 
    rearLights: ['redglass'],     

    wheels: ['chrome', 'brakedisk'],
    tires: ['tire'],

    interior: ['interior'],

    chromeParts: ['mirror', 'material_15', 'black'],
  },

  wheelStyles: {
    Classic: { color: '#5a5a5a', roughness: 0.6 },
    Chrome: { color: '#c0c0c0', roughness: 0.25 },
    MatteBlack: { color: '#1a1a1a', roughness: 0.8 },
  },

  frontLightStyles: {
    Reset: { color: '#000000', intensity: 0.2 },
    Classic: { color: '#ffd27d', intensity: 0.6 },
    LED: { color: '#f8f8f8', intensity: 1.0 },
    Xenon: { color: '#7fc3ff', intensity: 1.3 },
  },

  accessories: {
    spoiler: { nodeName: 'spoiler', visible: false },
    hood: { nodeName: 'Object_10', visible: true },
  },


  baseColors: {
    red: '#b22222',
    navyBlue: '#1c2e4a',
    silver: '#bfbfbf',
    jetBlack: '#111111',
    ivory: '#f4f4f4',
  },
};
