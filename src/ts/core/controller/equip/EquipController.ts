import { Attribute } from "../../../anxi/controller/attribute/attribute";
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

    const needCompute = () => {
      role.attribute.needCompute = true;
      role.attribute.compute();
    }

    this.signal[EquipCache.Weapon].get.add(needCompute);
    this.signal[EquipCache.Body].get.add(needCompute);
    this.signal[EquipCache.Dcrt].get.add(needCompute);
    this.signal[EquipCache.Wing].get.add(needCompute);

    this.signal[EquipCache.Weapon].lose.add(needCompute);
    this.signal[EquipCache.Body].lose.add(needCompute);
    this.signal[EquipCache.Dcrt].lose.add(needCompute);
    this.signal[EquipCache.Wing].lose.add(needCompute);

    role.attribute.attrArray.forEach(attr => {
      attr.addCommonCaculator(() => {
        this.caculate(attr);
      })
    });

  }

  caculate(attr: Attribute) {
    const name = attr.name;
    const equips = [EquipCache.Weapon, EquipCache.Body, EquipCache.Dcrt, EquipCache.Wing];
    for (const e of equips) {
      const equip = this.data[e];
      if (!equip) continue;
      attr.extra += equip.props[name] || 0;
    }
  }


  toJson() {
    return this.data;
  }
}