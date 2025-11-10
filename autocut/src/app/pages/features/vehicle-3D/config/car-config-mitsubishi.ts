// car-config-mitsubishi.ts
export const CarConfigMitsubishi = {
  editableMaterials: {
    body: ['phong1', 'material'],

    glass: ['windows', 'glass_surr'],

    frontLights: ['lights'],
    rearLights: ['lights'],

    wheels: ['wheel', 'disk'],
    tires: ['tire'],

    interior: ['int1', 'mat00', 'mat01', 'mat02', 'mat03', 'mat04', 'mat05'],

    metalParts: ['standardSurface1', 'misc', 'material_7'],
  },

  wheelStyles: {
    Classic: { color: '#4b4b4b', roughness: 0.6 },
    Sport: { color: '#bdbdbd', roughness: 0.4 },
    Black: { color: '#1a1a1a', roughness: 0.5 },
  },

  frontLightStyles: {
    Reset: { color: '#000000', intensity: 0.2 },
    Classic: { color: '#f7ff8f', intensity: 0.4 },
    LED: { color: '#f9f9f9', intensity: 0.8 },
    Xenon: { color: '#6fb6ff', intensity: 1.2 },
  },

  accessories: {
    spoiler: { nodeName: 'spoiler', visible: false },
    hood: { nodeName: 'evo_6:LOD_A_HOOD_mm_ext', visible: true },
  },

  baseColors: {
    default: '#c4c4c4',
    sportRed: '#a00d0d',
    midnightBlue: '#0b132b',
    limeGreen: '#6ef04a',
  },
};
