import { Container } from "pixi.js";
import { Thing } from "../../../../../../data/thing/ThingProto";
import { Role } from "../../../../role/Role";
import { TextButton } from "./button";
import { StarGrid } from "./Grid";

export class SingleBag extends Container {

  bagType = 0
  bagPage = 0
  role!: Role

  bagMenus = [
    new TextButton('装 备').overColor(),
    new TextButton('材 料').overColor(),
    new TextButton('待 定').overColor(),
  ]

  pageMenus = [
    new TextButton('1', 195 + 0, 375, {}, 25, 20),
    new TextButton('2', 195 + 35, 375, {}, 25, 20),
    new TextButton('3', 195 + 70, 375, {}, 25, 20),
  ]

  grids: StarGrid[] = []

  refresh(role: Role) {
    this.role = role;
    this.bagType = 0;
    this.bagPage = 0;
    this.reload();
  }

  reload() {
    const { bagController } = this.role;

    let iceThings: Thing[];
    switch (this.bagType) {
      case 0: iceThings = bagController.equips; break;
      case 1: iceThings = bagController.materials; break;
      case 2: iceThings = bagController.extras; break;
      default: throw new Error('BagController.bagType must in [0, 1, 2];');
    }
    const things = iceThings.slice(25 * this.bagPage, 25 * (this.bagPage + 1));

    for (let i = 0; i < 25; i++) {
      this.grids[i].thing = things[i];
    };

  }

  constructor(readonly clickHandler: (grid: StarGrid) => void) {
    super();
    this.bagMenus[0].position.set(0, 15);
    this.bagMenus[1].position.set(90, 15);
    this.bagMenus[2].position.set(180, 15);
    this.bagMenus.forEach((menu, i) => {
      menu.on('pointertap', () => {
        this.bagType = i;
        this.reload();
      })
    });
    this.pageMenus.forEach((menu, i) => {
      menu.on('pointertap', () => {
        this.bagPage = i;
        this.reload();
      })
    });
    this.addChild(...this.bagMenus, ...this.pageMenus);
    for (let i = 0; i < 25; i++) {
      let row = (i / 5) | 0;
      let col = i % 5;
      let grid = new StarGrid();
      grid.x = col * 60;
      grid.y = row * 60 + 55;
      this.addChild(grid);
      this.grids.push(grid);
      grid.on('pointertap', () => {
        this.clickHandler(grid);
      })
    }

  }

}