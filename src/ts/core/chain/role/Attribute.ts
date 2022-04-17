import { VitaAttribute } from "../vita/Attribute";

export interface RoleAttribute extends VitaAttribute {
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