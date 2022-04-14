import { Container, isMobile } from "pixi.js";
import { World } from "../../../anxi/chain/World";
import { WorldViewController } from "../../../anxi/controller/base-view/view/WorldViewer";
import { PhysicsWorldController, PhysicsWorldOptions } from "../../../anxi/physics/world";
import { gameHeight, gameWidth } from "../../../config";
import { CardData } from "../../../data/card/Proto";
import { WallProtos } from "../../../data/wall";
import { Record } from "../../../net/Record";
import { DefaultPlayer1Keys, DefaultPlayer2Keys, InstructEmitter } from "../../controller/instruct/InstructEmitter";
import { Role } from "../role/Role";
import { SavedRole } from "../role/SavedRole";
import { WallProto } from "../wall/Proto";
import { Wall } from "../wall/Wall";
import { BackController } from "./controller/BackController";
import { StepController } from "./controller/StepController";
import { MoveStruct } from "../../../anxi/chain/Quark";
import { PanelController } from "../../controller/panel/PanelController";
import { OpenController } from "./controller/OpenController";

export class CardWorld extends World {

  wallContainer = new Container();
  backController!: BackController;

  parallelContainer = new Container();
  handContainer = new Container();
  guiContainer = new Container();
  toolContainer = new Container();

  offset = [0, 0]

  roles: Role[] = []
  stepController!: StepController;
  physicsController!: PhysicsWorldController;
  openController!: OpenController;

  constructor(readonly cardData: CardData, readonly record: Record) {
    super();

    const renderer = new WorldViewController(this);
    renderer.beforeContainer.addChild(this.wallContainer);
    renderer.afterContainer.addChild(
      this.parallelContainer,
      this.handContainer,
      this.guiContainer,
      this.toolContainer
    )
    this.initController();

    cardData.walls.map(([index, x, y]) => this.initWall(WallProtos[index], x, y));

    record.roles.map((role, i) => this.initRole(role, i));

    if (__DEV__) {
      window.onkeydown = (e) => {
        if (e.key !== '1') return;
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

    this.openController = new OpenController(this, true);
    if (isMobile) {
      this.openController.listenKeyboard();
    }

    let dev: PhysicsWorldOptions['dev'] = undefined;
    let devCanvas: PhysicsWorldOptions['devCanvas'] = undefined;
    if (__DEV__ && false) {
      const canvas = document.createElement('canvas');
      canvas.style.position = 'absolute';
      canvas.style.width = appCanvas.offsetWidth + 'px';
      canvas.style.height = appCanvas.offsetHeight + 'px';

      canvas.style.left = appCanvas.offsetLeft + 'px';
      canvas.style.top = appCanvas.offsetTop + 'px';
      canvas.style.pointerEvents = 'none';


      setTimeout(() => {
        canvas.style.backgroundColor = 'rgba(0,0,0,0.0)';
      }, 100);

      devCanvas = canvas;

      dev = {
        width: gameWidth,
        height: gameHeight
      }
      document.body.append(canvas);

    }
    this.physicsController = new PhysicsWorldController(this, {
      gravity: {
        x: 0,
        y: 0,
        scale: 0
      },
      dev: dev,
      devCanvas: devCanvas,
      deltaConfig: {
        constDelta: 20
      },
      enableSleeping: false,
      velocityIterations: 10,
      positionIterations: 10
    });
    this.backController.init();
    this.stepController.init();
    this.openController.init();
  }

  initRole(proto: SavedRole, index: number) {
    const role = new Role(proto);
    role.x = 200;
    role.y = 300;
    role.land(this);
    this.roles[index] = role;
    new InstructEmitter(role, [DefaultPlayer1Keys, DefaultPlayer2Keys][index]).init();
    new PanelController(role, index).init();

    if (__DEV__) {

      // @ts-ignore
      window.role = role;
    }

    const box = this.cardData.box;

    role.on('movex', e => {
      const moveUtil = e.data[0] as MoveStruct;
      moveUtil.value = Math.max(box.x, Math.min(moveUtil.value, box.x + box.width));
    });
    role.on('movey', e => {
      const moveUtil = e.data[0] as MoveStruct;
      moveUtil.value = Math.max(box.y, Math.min(moveUtil.value, box.y + box.width));
    });

  }

  initWall(proto: WallProto, x: number, y: number) {
    const wall = new Wall(proto);
    wall.x = x;
    wall.y = y;
    wall.land(this);
    if (__DEV__) {
      // @ts-ignore
      window.wall = wall;
    }
  }

}