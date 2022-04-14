import { EquipCache } from "../../core/controller/equip/EquipCache";
import { BodyCache } from "../../core/equip/BodyCache";
import { Thing, ThingProto, ThingType } from "./ThingProto";

export interface EquipProto extends ThingProto {
  emitEffect?(): () => void
  kind: typeof ThingType.Equip
  type: EquipCache
  props: Record<string, [number, number]>
  extraIntro?: string
  bulletUrl?: string
  views: Partial<Record<BodyCache, {
    anchor: [number, number],
    url: string
  }>>
  ringSkill?: [index: number, rate: number]
  extraSkills?: [index: number, rate: number][]
}

export interface Equip extends Thing{
  props: Record<string, number>
  wingSkill?: number
  extraIntro: string[]
  extraSkills: number[]
}

BodyCache