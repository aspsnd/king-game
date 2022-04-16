import { AnxiEvent } from "../../../aixi/eventer/Event";
import { Controller } from "../../../anxi/controller/controller";
import { getProto, MaterialProtos } from "../../../data/thing";
import { Equip } from "../../../data/thing/EquipProto";
import { Extra } from "../../../data/thing/ExtraProto";
import { Material } from "../../../data/thing/MaterialProto";
import { Thing, ThingType } from "../../../data/thing/ThingProto";
import { Role } from "../../chain/role/Role";
import { CardWorld } from "../../chain/world/CardWorld";
import { EquipCache } from "../equip/EquipCache";

export class BagController extends Controller {

  declare belonger: Role;

  equips: Equip[] = []
  materials: Material[] = []
  extras: Extra[] = []

  money = 0

  init() {
    super.init();
    const bag = this.belonger.savedRole.bag
    this.equips = bag.equip;
    this.materials = bag.material;
    this.extras = bag.extra;
    this.money = this.belonger.savedRole.money;
    const { eventer } = this;
    eventer.on('wantunequip', e => {
      const type = e.data[0] as EquipCache;
      const equipController = this.belonger.equipController;
      const equip = equipController.data[type];
      if (!equip) return;
      equipController.data[type] = undefined;
      this.getThing(equip);
    });
    eventer.on('wantuse', e => {
      const thing = e.data[0] as Thing;
      this.reduceThing(thing);
      switch (thing.kind) {
        case ThingType.Equip: {
          const equip = thing as Equip;
          const equipController = this.belonger.equipController;
          if (equipController.data[equip.type]) {
            this.getThing(equipController.data[equip.type]!);
          }
          equipController.data[equip.type] = equip;
          break;
        }
        case ThingType.Material: {
          const material = thing as Material;
          const proto = MaterialProtos[material.index];
          proto.useHandler(this.belonger);
          break;
        }
      }
    });
    eventer.on('wantgive', e => {
      const thing = e.data[0] as Thing;
      const role = this.belonger;
      const index = (role.world as CardWorld).roles.indexOf(role);
      const anothor = (role.world as CardWorld).roles[1 - index];
      role.bagController.reduceThing(thing);
      anothor.bagController.getThing(thing);
    });
    eventer.on('wantsell', e => {
      const thing = e.data[0] as Thing;
      const proto = getProto(thing);
      this.reduceThing(thing);
      this.getMoney((proto.money || 0) * ((thing as Material)?.count || 0));
    })
  }

  getMoney(money: number) {
    this.money += money;
    this.belonger.emit(new AnxiEvent('getmoney', money));
  }
  reduceMoney(money: number) {
    if (this.money < money) throw new Error('大于0');
    this.money -= money;
    this.belonger.emit(new AnxiEvent('reducemoney', money));
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