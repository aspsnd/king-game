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
  boxs: [],
  whenCross() {

  },
  whenFirstCross() {

  },
  walls: [],
  monsts: [],
  boss: []
}