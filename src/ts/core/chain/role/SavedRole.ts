import { SavedVita } from "../vita/SavedVita"
import { RoleAttribute } from "./Attribute"

export interface SavedRole extends SavedVita {
  attr: RoleAttribute
  exp: number
  money: number
  bag: {
    equip: {
      proto: number
    }[]
    material: {
      proto: number,
      count: number
    }[]
    extra: {
      proto: number
    }[]
  }
  equip: any[]
}