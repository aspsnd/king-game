import { RoleProtos } from "../../../data/role";
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
  equip: [],
  index,
  attr: RoleProtos[index].attr,
  skills: [],
  talentStars: 0,
  talents: []
});

export class Role extends Vita<RoleAttribute> {
  declare proto: RoleProto;
  constructor(readonly savedRole: SavedRole) {
    super(savedRole, RoleProtos[savedRole.index]);
  }

  initRole() {

  }

  toJson(): SavedRole {
    return {
      ...super.toJson(),
      exp: 0,
      money: 0,
      bag: {
        equip: [],
        material: [],
        extra: []
      },
      equip: []
    };
  }

}
