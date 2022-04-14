import { Graphics, Text, TextStyle } from "pixi.js";
import { gameHeight, gameWidth } from "../../../../../config";
import { EquipCache, EquipText } from "../../../../controller/equip/EquipCache";
import { BodyCache } from "../../../../equip/BodyCache";
import { Role } from "../../../role/Role";
import { CardWorld } from "../../CardWorld";
import { TextButton } from "./BagComponents/button";
import { StarGrid, TextGrid } from "./BagComponents/Grid";
import { SingleBag } from "./BagComponents/SingleBag";
import { WholeAttrBar } from "./BagComponents/WholeAttrBar";
import { OpenPanel } from "./base/OpenPanel";

export class BagPanel extends OpenPanel {

  world!: CardWorld
  roleIndex!: number
  bagType = 0
  bagPage = 0

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

  singleBag = new SingleBag()

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
    this.equipBlocks[EquipCache.Body].position.set(280, 80);
    this.equipBlocks[EquipCache.Dcrt].position.set(210, 150);
    this.equipBlocks[EquipCache.Wing].position.set(280, 150);

    this.wholeAttrBar.position.set(40, 240);
    container.addChild(this.wholeAttrBar);

    container.addChild(this.saleBtn);

    this.saleBtn.on("pointertap", () => {
      // 卖出白装
    });

    this.singleBag.position.set(375, 10);
    container.addChild(this.singleBag);

  }

  refresh(world: CardWorld): void {
    this.world = world;
    this.roleIndex = 0;
    this.bagType = 0;
    this.bagPage = 0;
  }

  reload(role: Role) {

  }


}