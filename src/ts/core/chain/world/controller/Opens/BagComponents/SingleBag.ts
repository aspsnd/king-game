import { Container } from "pixi.js";
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

  centers: StarGrid[] = []

  refresh(role: Role) {
    this.role = role;
    this.bagType = 0;
    this.bagPage = 0;
    this.reload();
  }

  reload() {

  }

  constructor() {
    super();
    this.bagMenus[0].position.set(0, 15);
    this.bagMenus[1].position.set(90, 15);
    this.bagMenus[2].position.set(180, 15);
    this.addChild(...this.bagMenus, ...this.pageMenus);
    for (let i = 0; i < 25; i++) {
      let row = (i / 5)|0;
      let col = i % 5;
      let grid = new StarGrid();
      grid.x = col * 60;
      grid.y = row * 60 + 55;
      this.addChild(grid);
      this.centers.push(grid);
    }
  }

}