import { Graphics } from "pixi.js";
import { Atom } from "../../../anxi/chain/Atom";
import { MoveStruct } from "../../../anxi/chain/Quark";
import { SkillController } from "../../../anxi/controller/skill";
import { Skill } from "../../../anxi/controller/skill/skill";
import { StateController } from "../../../anxi/controller/state";
import { MatrixViewer } from "../../../anxi/controller/view";
import { PhysicsController } from "../../../anxi/physics/atom";
import { SkillProtos } from "../../../data/skill";
import { InstructController } from "../../controller/instruct/InstructController";
import { StateCache } from "../../controller/state/StateCache";
import { StatingController } from "../../controller/stating/StatingController";
import { VarController } from "../../controller/variable/VarController";
import { Wall } from "../wall/Wall";
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
  physicsController!: PhysicsController<true>;
  statingController!: StatingController;
  var!: VarController;

  currentGround?: Wall

  forbidRight?: Wall
  forbidLeft?: Wall


  constructor(readonly savedVita: SavedVita, readonly proto: VitaProto) {
    super(savedVita.attr as B);
    this.level = proto.level;
    this.group = proto.group;
    this.talentStars = savedVita.talentStars;
    this.init();
  }

  init() {
    this.initControllers();
    this.initForbidden();
  }

  initControllers() {

    this.stateController = new StateController(this, StateCache);
    this.stateController.setStateInfinite(StateCache.common, true);
    this.stateController.setStateInfinite(StateCache.drop, true);

    this.statingController = new StatingController(this);

    this.viewController = new MatrixViewer(this, this.proto.actions, StateCache.common);
    this.viewController.fromBaseBodyStruct(this.proto.defaultBody);

    this.skillController = new SkillController(this);

    this.skillController.add(new Skill(SkillProtos[this.proto.attack]));

    this.var = new VarController(this);

    this.instructController = new InstructController(this);

    this.physicsController = new PhysicsController(this, {
      isBody: true,
      body: this.proto.hitGraph(this),
    });
    this.physicsController.box.collisionFilter.category = 0b10000000;
    this.physicsController.box.collisionFilter.mask = 0b00110000;
    this.physicsController.box.collisionFilter.group = -1;

  }

  initForbidden() {
    this.on('movex', e => {
      const util = e.data[0] as MoveStruct;
      if (this.forbidLeft && util.value < util.old) util.value = util.old;
      if (this.forbidRight && util.value > util.old) util.value = util.old;
    });
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