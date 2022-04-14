export const EquipCache = {
  Weapon: 0,
  Body: 1,
  Dcrt: 2,
  Wing: 3
} as const;

export const EquipText = {
  [EquipCache.Weapon]: '武器',
  [EquipCache.Body]: '防具',
  [EquipCache.Dcrt]: '能核',
  [EquipCache.Wing]: '羽翼',
}


export type EquipCache = typeof EquipCache[keyof typeof EquipCache];