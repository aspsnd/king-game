import { AtomAttrBlock } from "../../../anxi/chain/Atom";

export interface VitaAttribute extends AtomAttrBlock {
  hp: number
  mp: number
  atk: number
  def: number
  crt: number
  dod: number
  hpr: number
  mpr: number
  spd: number
  ats: number
}

export const AttrText = {
  hp: '生命',
  mp: '魔法',
  atk: '攻击',
  def: '防御',
  crt: '暴击',
  dod: '闪避',
  hpr: '回血',
  mpr: '回魔',
  spd: '移速',
  ats: '攻速'
};

export type AttrNames = keyof typeof AttrText;