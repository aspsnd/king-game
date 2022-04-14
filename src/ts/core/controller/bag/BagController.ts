import { Controller } from "../../../anxi/controller/controller";
import { Equip } from "../../../data/thing/EquipProto";
import { Extra } from "../../../data/thing/ExtraProto";
import { Material } from "../../../data/thing/MaterialProto";
import { Thing, ThingType } from "../../../data/thing/ThingProto";
import { Role } from "../../chain/role/Role";

export class BagController extends Controller {

  declare belonger: Role;

  equips: Equip[] = []
  materials: Material[] = []
  extras: Extra[] = []

  init() {
    super.init();
    const bag = this.belonger.savedRole.bag
    this.equips = bag.equip;
    this.materials = bag.material;
    this.extras = bag.extra;
  }

  getThing(thing: Thing) {
    switch (thing.kind) {
      case ThingType.Equip: this.equips.push(thing as Equip); break;
      case ThingType.Extra: this.extras.push(thing as Extra); break;
      case ThingType.Material: {
        this.getMaterial(thing as Material);
        break;
      }
    }
  }
  getMaterial(material: Material) {
    let index = this.materials.findIndex(tb => tb.index == material.index);
    if (index == -1) {
      this.materials.push(material);
    } else {
      this.materials[index].count += material.count;
    };
  }
  reduceThing(thing: Thing) {
    switch (thing.kind) {
      case ThingType.Equip: this.equips.splice(this.equips.indexOf(thing as Equip), 1); break;
      case ThingType.Material: {
        this.reduceMaterial(thing as Material, 1);
      }; break;
      case ThingType.Extra: this.extras.splice(this.extras.indexOf(thing as Extra), 1); break;
    }
  }
  reduceMaterial(material: Material, count = 1) {
    material.count -= count;
    if (material.count < 0) throw new Error('imposible error!');
    if (material.count == 0) {
      this.materials.splice(this.materials.indexOf(material), 1);
    }
  }

  toJson() {
    return {
      equip: this.equips,
      material: this.materials,
      extra: this.extras
    }
  }
}