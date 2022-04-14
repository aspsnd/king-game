import { Container } from "pixi.js";
import { CardWorld } from "../../../CardWorld";

export abstract class OpenPanel extends Container {

  constructor() {
    super();
    this.visible = false;
  }

  abstract refresh(world: CardWorld): void

  time = 0
  onTime() {
    this.time++;
  }

}