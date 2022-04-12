import { Graphics } from "pixi.js";
import { Atom } from "../../../anxi/chain/Atom";
import { SkillController } from "../../../anxi/controller/skill";
import { StateController } from "../../../anxi/controller/state";
import { MatrixViewer } from "../../../anxi/controller/view";
import { InstructController } from "../../instruct/InstructController";
import { StateCache } from "../../state/StateCache";
import { StatingController } from "../../stating/StatingController";
import { VitaAttribute } from "./Attribute";
import { VitaProto } from "./Proto";
import { SavedVita } from "./SavedVita";

export class Vita<B extends VitaAttribute> extends Atom<B>{

  static ID = 0

  id = Vita.ID++

  dead: boolean = false

  get face() {
    return this._face;
  }
  set face(v: number) {
    this._face = v;
    this.get(MatrixViewer).transform.set(v, 0, 0, 1, 0, 0);
  }

  private _face = 1


  group = -1
  talentStars: number;
  level: number;
  stateController!: StateController;
  viewController!: MatrixViewer;
  skillController!: SkillController;
  instructController!: InstructController;
  statingController!: StatingController;

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
    this.stateController.setStateInfinite(StateCache.common, true);

    this.statingController = new StatingController(this);

    this.viewController = new MatrixViewer(this, this.proto.actions, StateCache.common);
    this.viewController.fromBaseBodyStruct(this.proto.defaultBody);

    this.viewController.container.addChild(new Graphics().beginFill(0x008888, 1).drawRect(-.5, -200, 1, 400).endFill());
    this.viewController.container.addChild(new Graphics().beginFill(0x008888, 1).drawRect(-200, -.5, 400, 1).endFill());

    this.skillController = new SkillController(this);

    this.instructController = new InstructController(this);
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

  canRun() {
    var ps = this.stateController.get(StateCache.go)!;
    const psTime = ps.lastGet + ps.time;
    return this.time - psTime < 25 && this.time > 25;
  }

}