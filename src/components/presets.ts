export const METAL_PRESETS = {
  // Colors matched to real jewelry under neutral studio lighting (sRGB)
  "Yellow Gold 22K": { color: "#E8B000", metalness: 1, roughness: 0.22, iridescence: 0    },
  "Yellow Gold 18K": { color: "#D4962A", metalness: 1, roughness: 0.26, iridescence: 0    },
  "Rose Gold 18K":   { color: "#C08070", metalness: 1, roughness: 0.26, iridescence: 0    },
  "White Gold 18K":  { color: "#E0E0E4", metalness: 1, roughness: 0.18, iridescence: 0.2  },
  "Platinum":        { color: "#C0C0CC", metalness: 1, roughness: 0.14, iridescence: 0.25 },
  "Silver":          { color: "#C8C8C8", metalness: 1, roughness: 0.28, iridescence: 0    },
} as const;

export const STONE_PRESETS = {
  "White Diamond":  { color: "#ffffff", attenuationColor: "#bfdfff", transmission: 1.0,  ior: 2.417, thickness: 2.5, roughness: 0,    dispersion: 5   },
  "Yellow Diamond": { color: "#f5e642", attenuationColor: "#f5e642", transmission: 0.95, ior: 2.417, thickness: 2.5, roughness: 0,    dispersion: 5   },
  "Blue Sapphire":  { color: "#1a3aff", attenuationColor: "#1a3aff", transmission: 0.85, ior: 1.77,  thickness: 2.0, roughness: 0.01, dispersion: 0.5 },
  "Ruby":           { color: "#cc0020", attenuationColor: "#cc0020", transmission: 0.80, ior: 1.76,  thickness: 2.0, roughness: 0.01, dispersion: 0.5 },
  "Emerald":        { color: "#00a050", attenuationColor: "#00a050", transmission: 0.78, ior: 1.58,  thickness: 2.0, roughness: 0.02, dispersion: 0.3 },
  "Pink Sapphire":  { color: "#ff6fa8", attenuationColor: "#ff6fa8", transmission: 0.85, ior: 1.77,  thickness: 2.0, roughness: 0.01, dispersion: 0.5 },
} as const;

export type MetalPreset = typeof METAL_PRESETS[keyof typeof METAL_PRESETS];
export type StonePreset = typeof STONE_PRESETS[keyof typeof STONE_PRESETS];
