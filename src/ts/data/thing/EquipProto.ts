import { EquipCache } from "../../core/controller/equip/EquipCache";
import { BodyCache } from "../../core/equip/BodyCache";
import { Randomer } from "../../random/Ramdom";
import { SkillProtos } from "../skill";
import { Thing, ThingProto, ThingType } from "./ThingProto";

export interface EquipProto extends ThingProto {
  emitEffect?(): () => void
  kind: typeof ThingType.Equip
  type: EquipCache
  props: Record<string, [number, number] | number>
  extraIntro?: string
  bulletUrl?: string
  views: Partial<Record<BodyCache, {
    anchor: [number, number],
    texture: string
  }>>
  wingSkill?: [index: number, rate: number]
  extraSkills?: [index: number, rate: number][]
}

export interface Equip extends Thing {
  props: Record<string, number>
  type: EquipCache
  wingSkill?: number
  extraIntro: string[]
  extraSkills: number[]
}

export const generateEquip = (proto: EquipProto): Equip => {
  const equip: Equip = {
    index: proto.index,
    kind: proto.kind,
    type: proto.type,
    extraIntro: [],
    extraSkills: [],
    props: {}
  };

  for (const prop in proto.props) {
    const v = proto.props[prop];
    if (typeof v === 'number') {
      equip.props[prop] = v;
    } else {
      if (v[1] <= 1) {
        equip.props[prop] = Math.round(v[0] + (v[1] - v[0]) * Randomer.gen() * 100) * 0.01;
      } else {
        equip.props[prop] = Math.round(v[0] + (v[1] - v[0]) * Randomer.gen());
      }
    }
  }

  if (proto.wingSkill && proto.wingSkill[1] > Randomer.gen()) {
    equip.wingSkill = proto.wingSkill[0];
    const skillProto = SkillProtos[proto.wingSkill[0]];
    equip.extraIntro.push(`羽翼技能:${skillProto.name}`);
  }

  proto.extraSkills?.forEach(s => {
    if (s[1] >= Randomer.gen()) {
      equip.extraSkills.push(s[0]);
      let skillProto = SkillProtos[s[0]];
      equip.extraIntro.push(`${skillProto.name}:${skillProto.extra?.intro}`);
    }
  });

  return equip;
}