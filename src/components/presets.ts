export const METAL_PRESETS = {
  "Yellow Gold 22K": { color: "#F5C518", metalness: 1, roughness: 0.25 },
  "Yellow Gold 18K": { color: "#E8B84B", metalness: 1, roughness: 0.28 },
  "Rose Gold 18K":   { color: "#E8A090", metalness: 1, roughness: 0.28 },
  "White Gold 18K":  { color: "#E8E8E8", metalness: 1, roughness: 0.20 },
  "Platinum":        { color: "#E0E0E8", metalness: 1, roughness: 0.15 },
  "Silver":          { color: "#C0C0C0", metalness: 1, roughness: 0.30 },
} as const;

export const STONE_PRESETS = {
  "White Diamond":  { color: "#ffffff", transmission: 0.95, ior: 2.42, thickness: 0.5, roughness: 0,    dispersion: 0.05  },
  "Yellow Diamond": { color: "#f5e642", transmission: 0.92, ior: 2.42, thickness: 0.5, roughness: 0,    dispersion: 0.05  },
  "Blue Sapphire":  { color: "#1a3aff", transmission: 0.85, ior: 1.77, thickness: 0.8, roughness: 0.02, dispersion: 0.018 },
  "Ruby":           { color: "#cc0020", transmission: 0.80, ior: 1.76, thickness: 0.8, roughness: 0.02, dispersion: 0.018 },
  "Emerald":        { color: "#00a050", transmission: 0.78, ior: 1.58, thickness: 0.8, roughness: 0.03, dispersion: 0.014 },
  "Pink Sapphire":  { color: "#ff6fa8", transmission: 0.85, ior: 1.77, thickness: 0.8, roughness: 0.02, dispersion: 0.018 },
} as const;

export type MetalPreset = typeof METAL_PRESETS[keyof typeof METAL_PRESETS];
export type StonePreset = typeof STONE_PRESETS[keyof typeof STONE_PRESETS];
