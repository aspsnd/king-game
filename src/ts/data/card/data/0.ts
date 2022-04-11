import { Rectangle } from "pixi.js";
import { CardData } from "../Proto";

export const CardData0: CardData = {
  name: "地球",
  index: 0,
  card: ['static/map/1.png', 'static/map/1h.png'],
  position: [285, 165],
  crossOpen: [1, 2],
  back: 0,
  ground: 0,
  box: new Rectangle(0, 0, 4500, 590),
  boxs: [
    new Rectangle(0, 0, 1300, 590),
    new Rectangle(2000, 0, 2100, 590),
    new Rectangle(1800, 0, 2900, 590),
    new Rectangle(2600, 0, 3700, 590),
    new Rectangle(3400, 0, 4500, 590),
  ],
  whenCross() {

  },
  whenFirstCross() {

  },
  walls: [],
  monsts: [],
  boss: []
}