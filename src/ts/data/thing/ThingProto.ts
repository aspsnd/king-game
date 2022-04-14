import { VitaAttribute } from "../../core/chain/vita/Attribute";
import { Vita } from "../../core/chain/vita/Vita";

export const ThingType = {
  Equip: 0,
  Material: 1,
  Extra: 2
} as const;

export type ThingType = typeof ThingType[keyof typeof ThingType];

export const QualityType = {
  white: 0,
  green: 1,
  blue: 2,
  purple: 3,
  yellow: 4,
  flash: 5
} as const;


export type QualityType = typeof QualityType[keyof typeof QualityType];

export interface ThingProto {
  index: number
  kind: ThingType
  name: string
  intro: string
  quality: QualityType
  money?: number
  disUrl: string
  dropUrl: string
  isSuitForVita(vita: Vita<VitaAttribute>): boolean
}

export interface Thing {
  index: number
  kind: ThingType
}