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