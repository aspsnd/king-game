import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { AnxiEvent } from "../../../../../aixi/eventer/Event";
import { CommonClock } from "../../../../../clocks/common";
import { gameHeight, gameWidth } from "../../../../../config";
import { Thing } from "../../../../../data/thing/ThingProto";
import { EquipCache, EquipText } from "../../../../controller/equip/EquipCache";
import { Role } from "../../../role/Role";
import { CardWorld } from "../../CardWorld";
import { TextButton } from "./BagComponents/button";
import { TextGrid } from "./BagComponents/Grid";
import { Operate } from "./BagComponents/Operate";
import { SingleBag } from "./BagComponents/SingleBag";
import { SmallRole } from "./BagComponents/SmallRole";
import { WholeAttrBar } from "./BagComponents/WholeAttrBar";
import { OpenPanel } from "./base/OpenPanel";

export class BagPanel extends OpenPanel {

  world!: CardWorld
  roleIndex!: number

  constructor() {
    super();
    this.initCommon();
  }

  container = new Graphics();

  equipBlocks = {
    [EquipCache.Weapon]: new TextGrid(EquipText[EquipCache.Weapon]),
    [EquipCache.Body]: new TextGrid(EquipText[EquipCache.Body]),
    [EquipCache.Dcrt]: new TextGrid(EquipText[EquipCache.Dcrt]),
    [EquipCache.Wing]: new TextGrid(EquipText[EquipCache.Wing]),
  }
  wholeAttrBar = new WholeAttrBar()

  saleBtn = new TextButton('出售白装', 500, 383, {
    fontSize: 12
  }, 60, 20)


  singleBag = new SingleBag((grid) => {
    this.operate.show(grid.thing!, this.world, this.roleIndex);
    this.operate.position.set(grid.x + 25, grid.y + 25);
  })

  operate = new Operate(this.singleBag, (thing: Thing, action: number) => {
    const role = this.world.roles[this.roleIndex];
    switch (action) {
      case 0: role.emit(new AnxiEvent('wantuse', thing)); break;
      case 1: role.emit(new AnxiEvent('wantgive', thing)); break;
      case 2: role.emit(new AnxiEvent('wantsell', thing)); break;
    }
    this.reload(role);
  });

  rolesContainer = new Container()

  smallRole = new SmallRole()

  initCommon() {
    const container = this.container;
    this.addChild(container);
    container.interactive = true;
    container.accessiblePointerEvents = 'none';
    container.beginFill(0).drawRect(0, 0, 700, 450).endFill();
    container.position.set((gameWidth - 700) >> 1, (gameHeight - 450) >> 1);

    const bagText = new Text('背 包', new TextStyle({
      stroke: 0xffffff,
      strokeThickness: 2,
      fill: [0xffff88, 0xff8800],
      fontSize: 40
    }));
    bagText.x = 28;
    bagText.y = -25;
    container.addChild(bagText);

    container.addChild(
      this.equipBlocks[EquipCache.Weapon],
      this.equipBlocks[EquipCache.Body],
      this.equipBlocks[EquipCache.Dcrt],
      this.equipBlocks[EquipCache.Wing],
    )
    this.equipBlocks[EquipCache.Weapon].position.set(210, 80);
    this.equipBlocks[EquipCache.Body].position.set(210, 150);
    this.equipBlocks[EquipCache.Dcrt].position.set(280, 80);
    this.equipBlocks[EquipCache.Wing].position.set(280, 150);

    this.equipBlocks[EquipCache.Weapon].on('pointertap', () => {
      this.world.roles[this.roleIndex].emit(new AnxiEvent('wantunequip', EquipCache.Weapon));
      this.reload(this.world.roles[this.roleIndex]);
    });
    this.equipBlocks[EquipCache.Body].on('pointertap', () => {
      this.world.roles[this.roleIndex].emit(new AnxiEvent('wantunequip', EquipCache.Body));
      this.reload(this.world.roles[this.roleIndex]);
    });
    this.equipBlocks[EquipCache.Dcrt].on('pointertap', () => {
      this.world.roles[this.roleIndex].emit(new AnxiEvent('wantunequip', EquipCache.Dcrt));
      this.reload(this.world.roles[this.roleIndex]);
    });
    this.equipBlocks[EquipCache.Wing].on('pointertap', () => {
      this.world.roles[this.roleIndex].emit(new AnxiEvent('wantunequip', EquipCache.Wing));
      this.reload(this.world.roles[this.roleIndex]);
    });

    this.wholeAttrBar.position.set(40, 240);
    container.addChild(this.wholeAttrBar);

    container.addChild(this.saleBtn);

    this.saleBtn.on("pointertap", () => {
      // 卖出白装
    });

    this.singleBag.position.set(375, 10);
    container.addChild(this.singleBag);

    container.addChild(this.rolesContainer);

    const srBg = new Graphics().beginFill(0x555555).drawRect(45, 55, 150, 150).endFill();

    this.smallRole.position.set(45 + 75, 55 + 75);

    container.addChild(srBg, this.smallRole);

    CommonClock.onTime(() => {
      if (!this.visible) return;
      this.smallRole.onTime();
    });

  }

  refresh(world: CardWorld): void {
    this.world = world;
    this.roleIndex = 0;

    this.rolesContainer.removeChildren();
    world.roles.forEach((role, index) => {
      let nameBtn = new TextButton(role.proto.name, -42, 100 + 60 * index, {}, 85, 30);
      this.rolesContainer.addChild(nameBtn);
      nameBtn.interactive = true;
      nameBtn.cursor = 'pointer';
      nameBtn.on('pointertap', () => {
        this.roleIndex = index;
        this.reload(role);
      });
    });
    this.singleBag.refresh(world.roles[0]);
    this.reload(world.roles[0]);
  }

  reload(role: Role) {

    const { equipController } = role;

    this.operate.hide();

    this.equipBlocks[EquipCache.Weapon].thing = equipController.data[EquipCache.Weapon];
    this.equipBlocks[EquipCache.Body].thing = equipController.data[EquipCache.Body];
    this.equipBlocks[EquipCache.Dcrt].thing = equipController.data[EquipCache.Dcrt];
    this.equipBlocks[EquipCache.Wing].thing = equipController.data[EquipCache.Wing];

    this.wholeAttrBar.refresh(role);
    this.smallRole.refreshView(role);
    this.singleBag.reload();

  }


}