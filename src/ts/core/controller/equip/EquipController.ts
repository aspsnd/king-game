import { Controller } from "../../../anxi/controller/controller";
import { Equip } from "../../../data/thing/EquipProto";
import { Role } from "../../chain/role/Role";
import { EquipCache } from "./EquipCache";

interface EquipControllerData {
  [EquipCache.Weapon]: Equip,
  [EquipCache.Body]: Equip,
  [EquipCache.Dcrt]: Equip,
  [EquipCache.Wing]: Equip,
}

export class EquipController extends Controller<EquipControllerData> {
  constructor(role: Role) {
    super(role);
    this.data = {
      [EquipCache.Weapon]: role.savedRole.equip[EquipCache.Weapon],
      [EquipCache.Body]: role.savedRole.equip[EquipCache.Body],
      [EquipCache.Dcrt]: role.savedRole.equip[EquipCache.Dcrt],
      [EquipCache.Wing]: role.savedRole.equip[EquipCache.Wing],
    };
    this.initDataAndSignal();
  }
  toJson() {
    return this.data;
  }
}