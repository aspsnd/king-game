import { Equip } from "../../../data/thing/EquipProto"
import { Extra } from "../../../data/thing/ExtraProto"
import { Material } from "../../../data/thing/MaterialProto"
import { EquipCache } from "../../controller/equip/EquipCache"
import { SavedVita } from "../vita/SavedVita"
import { RoleAttribute } from "./Attribute"

export interface SavedRole extends SavedVita {
  attr: RoleAttribute
  exp: number
  money: number
  bag: {
    equip: Equip[]
    material: Material[]
    extra: Extra[]
  }
  equip: {
    [EquipCache.Weapon]?: Equip,
    [EquipCache.Body]?: Equip,
    [EquipCache.Dcrt]?: Equip,
    [EquipCache.Wing]?: Equip,
  }
}