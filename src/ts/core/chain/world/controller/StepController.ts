import { Rectangle } from "pixi.js";
import { Controller } from "../../../../anxi/controller/controller";
import { CardWorld } from "../CardWorld";

export class StepController extends Controller {

  declare belonger: CardWorld

  step = 0

  resting = true

  box!: Rectangle

  limits: Rectangle[] = []

  get limit() {
    return this.resting ? this.box : this.limits[this.step];
  }

  init(): void {
    super.init();

    const cardData = this.belonger.cardData;

    const { box, boxs } = cardData;

    this.box = box;
    this.limits = boxs;

  }



}