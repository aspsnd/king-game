import { RoleProtos } from "../../../data/role";
import { BagController } from "../../controller/bag/BagController";
import { EquipController } from "../../controller/equip/EquipController";
import { LevelController } from "../../controller/level/LevelController";
import { Vita } from "../vita/Vita";
import { RoleAttribute } from "./Attribute";
import { RoleProto } from "./Proto";
import { SavedRole } from "./SavedRole";

export const EmptySavedRole = (index: number): SavedRole => ({
  exp: 0,
  money: 0,
  bag: {
    equip: [],
    material: [],
    extra: []
  },
  equip: {

  },
  index,
  attr: RoleProtos[index].attr,
  skills: [],
  talentStars: 0,
  talents: []
});

export class Role extends Vita<RoleAttribute> {
  declare proto: RoleProto;
  levelController!: LevelController;
  bagController!: BagController;
  equipController!: EquipController;
  constructor(readonly savedRole: SavedRole) {
    super(savedRole, RoleProtos[savedRole.index]);
    this.initRole();
  }

  initRole() {
    this.levelController = new LevelController(this);
    this.bagController = new BagController(this);
    this.equipController = new EquipController(this);
    this.viewController.bindEquipController(this.equipController);
  }

  toJson(): SavedRole {
    return {
      ...super.toJson(),
      exp: this.levelController.exp,
      money: 0,
      bag: this.bagController.toJson(),
      equip: this.equipController.toJson()
    };
  }

}
