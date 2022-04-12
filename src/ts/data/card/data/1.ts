import { Rectangle } from "pixi.js";
import { CardData } from "../Proto";

export const CardData1: CardData = {
  name: "月球",
  index: 1,
  card: ['static/map/2.png', 'static/map/2h.png'],
  position: [350, 240],
  crossOpen: [],
  back: 1,
  box: new Rectangle(0, 0, 960, 590),
  boxs: [],
  whenCross() {

  },
  whenFirstCross() {

  },
  walls: [],
  monsts: [],
  boss: []
}