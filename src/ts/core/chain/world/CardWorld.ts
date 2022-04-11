import { Container } from "pixi.js";
import { World } from "../../../anxi/chain/World";
import { WorldViewController } from "../../../anxi/controller/base-view/view/WorldViewer";
import { CardData } from "../../../data/card/Proto";
import { Record } from "../../../net/Record";
import { DefaultPlayer1Keys, DefaultPlayer2Keys, InstructEmitter } from "../../instruct/InstructEmitter";
import { Role } from "../role/Role";
import { SavedRole } from "../role/SavedRole";
import { BackController } from "./controller/BackController";
import { StepController } from "./controller/StepController";

export class CardWorld extends World {

  wallContainer = new Container();
  backController!: BackController;

  offset = [0, 0]

  roles: Role[] = []
  stepController!: StepController;

  constructor(readonly cardData: CardData, readonly record: Record) {
    super();

    const renderer = new WorldViewController(this);
    renderer.beforeContainer.addChild(this.wallContainer);
    this.initController();

    record.roles.map((role, i) => this.initRole(role, i));

    if (__DEV__) {
      window.onkeydown = (e) => {
        if (!e.ctrlKey || e.key !== '1') return;
        e.preventDefault();
        if (this.running) {
          this.running = false;
        } else {
          this.running = true;
        }
      }
    }

  }

  initController() {
    this.backController = new BackController(this, true);
    this.stepController = new StepController(this, true);
    this.backController.init();
    this.stepController.init();
  }

  initRole(proto: SavedRole, index: number) {
    const role = new Role(proto);
    role.x = 200;
    role.y = 300;
    role.land(this);
    this.roles[index] = role;
    new InstructEmitter(role, [DefaultPlayer1Keys, DefaultPlayer2Keys][index]).init();
  }

}