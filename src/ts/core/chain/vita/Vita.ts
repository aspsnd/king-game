import { Atom } from "../../../anxi/chain/Atom";
import { SkillController } from "../../../anxi/controller/skill";
import { StateController } from "../../../anxi/controller/state";
import { MatrixViewer } from "../../../anxi/controller/view";
import { RoleProtos } from "../../../data/role";
import { StateCache } from "../../state/StateCache";
import { VitaAttribute } from "./Attribute";
import { VitaProto } from "./Proto";
import { SavedVita } from "./SavedVita";

export class Vita<B extends VitaAttribute> extends Atom<B>{

  static ID = 0

  id = Vita.ID++

  group = -1
  talentStars: number;
  level: number;
  stateController!: StateController;
  viewController!: MatrixViewer;
  skillController!: SkillController;

  constructor(readonly savedVita: SavedVita, readonly proto: VitaProto) {
    super(savedVita.attr as B);
    this.level = proto.level;
    this.group = proto.group;
    this.talentStars = savedVita.talentStars;
    this.init();
  }

  init() {
    this.initControllers();
  }

  initControllers() {
    this.stateController = new StateController(this, StateCache);
    this.viewController = new MatrixViewer(this, this.proto.actions);
    this.skillController = new SkillController(this);
  }

  toJson(): SavedVita {
    return {
      index: this.proto.index,
      attr: this.attribute.toBaseJson() as VitaAttribute,
      skills: [],
      talentStars: 0,
      talents: []
    };
  }
}