import { Application, Container, isMobile } from "pixi.js";
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
import { MoveStruct, Quark } from "../../../anxi/chain/Quark";
import { PanelController } from "../../controller/panel/PanelController";
import { OpenController, OpenType } from "./controller/OpenController";
import { generateEquip } from "../../../data/thing/EquipProto";
import { EquipProtos } from "../../../data/thing";
import { Skill } from "../../../anxi/controller/skill/skill";
import { SkillRole0_0 } from "../../../data/skill/data/skills/role0_0";
import { SkillRole0_1 } from "../../../data/skill/data/skills/role0_1";
import { Vita } from "../vita/Vita";
import { VitaAttribute } from "../vita/Attribute";
import { SkillRole0_2 } from "../../../data/skill/data/skills/role0_2";
import { SkillRole0_3 } from "../../../data/skill/data/skills/role0_3";
import { SkillRole0_4 } from "../../../data/skill/data/skills/role0_4";

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

  constructor(readonly app: Application, readonly cardData: CardData, readonly record: Record) {
    super();

    const renderer = new WorldViewController(this);
    renderer.beforeContainer.addChild(this.wallContainer);
    renderer.afterContainer.addChild(
      this.parallelContainer,
      this.handContainer,
      this.guiContainer,
      this.toolContainer
    )
    this.initChildren();
    this.initController();

    cardData.walls.map(([index, x, y]) => this.initWall(WallProtos[index], x, y));

    record.roles.map((role, i) => this.initRole(role, i));

    if (__DEV__) {
      window.onkeydown = (e) => {
        if (e.key !== 'Home') return;
        e.preventDefault();
        if (this.running) {
          this.running = false;
        } else {
          this.running = true;
        }
      }
    }

  }

  vitas = new Set<Vita<VitaAttribute>>()

  walls = new Set<Wall>();

  initChildren() {
    this.on('getchild', e => {
      const quark = e.data[0] as Quark;
      if (quark instanceof Vita) {
        this.vitas.add(quark);
      } else if (quark instanceof Wall) {
        this.walls.add(quark);
      }
    })
    this.on('losechild', e => {
      const quark = e.data[0] as Quark;
      if (quark instanceof Vita) {
        this.vitas.delete(quark);
      } else if (quark instanceof Wall) {
        this.walls.delete(quark);
      }
    })
  }

  initController() {
    this.backController = new BackController(this, true);
    this.stepController = new StepController(this, true);

    this.openController = new OpenController(this, true);
    if (isMobile) {
      this.openController.listenKeyboard();
      // if (__DEV__) {
      //   setTimeout(() => {
      //     this.openController.wantToggle(OpenType.Bag);
      //   }, 100);
      // }
    }

    let dev: PhysicsWorldOptions['dev'] = undefined;
    let devCanvas: PhysicsWorldOptions['devCanvas'] = undefined;
    if (__DEV__ && true) {
      const canvas = document.createElement('canvas');
      canvas.style.position = 'absolute';
      canvas.style.width = appCanvas.offsetWidth + 'px';
      canvas.style.height = appCanvas.offsetHeight + 'px';

      canvas.style.left = appCanvas.offsetLeft + 'px';
      const shadow = true;
      canvas.style.top = (appCanvas.offsetTop + (shadow ? 0 : appCanvas.offsetHeight)) + 'px';
      shadow && setTimeout(() => {
        canvas.style.backgroundColor = 'transparent';
      }, 100);
      canvas.style.pointerEvents = 'none';

      devCanvas = canvas;

      dev = {
        width: gameWidth,
        height: gameHeight
      }
      document.body.append(canvas);
      this.on('time', () => {
        this.physicsController.render!.bounds.min.x = this.backController.offset[0];
        this.physicsController.render!.bounds.min.y = this.backController.offset[1];
        this.physicsController.render!.bounds.max.x = this.backController.offset[0] + gameWidth;
        this.physicsController.render!.bounds.max.y = this.backController.offset[1] + gameHeight;
      })

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

    if (__DEV__) {
      const weapon = generateEquip(EquipProtos[0]);
      const body = generateEquip(EquipProtos[1]);
      role.equipController.data[weapon.type] = weapon;
      role.equipController.data[body.type] = body;
      for (let i = 0; i < 30; i++) {
        const weapon = generateEquip(EquipProtos[Math.floor(Math.random() * 2)]);
        role.bagController.getThing(weapon);
      }

      role.skillController.add(new Skill(SkillRole0_0), 0);
      role.skillController.add(new Skill(SkillRole0_1), 1);
      role.skillController.add(new Skill(SkillRole0_2), 2);
      role.skillController.add(new Skill(SkillRole0_3), 3);
      role.skillController.add(new Skill(SkillRole0_4), 4);
      role.levelController.getExp(100000);
    }

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