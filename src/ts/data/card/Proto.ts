import { Rectangle } from "pixi.js"

export interface CardData {
  name: string,
  index: number,
  /** 关卡图标 */
  card: [string, string],
  /** 在地图页面的位置 */
  position: [number, number],
  crossOpen: number[],
  back: number,
  ground: number,
  box: Rectangle
  boxs: Array<Rectangle>
  whenCross: () => void,
  whenFirstCross: () => void,
  walls: [number, number, number][]
  monsts: [number, number, number, number][][],
  boss: [number, number, number, number][]
}