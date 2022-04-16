import { Rectangle } from "pixi.js"

export interface CardData {
  name: string
  index: number
  /** 关卡图标 */
  card: [string, string]
  /** 在地图页面的位置 */
  position: [number, number]
  crossOpen: number[]
  back: number
  box: Rectangle
  boxs: Array<Rectangle>
  whenCross: () => void
  whenFirstCross: () => void
  walls: [index: number, x: number, y: number][]
  monsts: [index: number, x: number, y: number, wait: number, face?: -1 | 1, lastId?: number][][]
  boss: [index: number, x: number, y: number, face?: -1 | 1][]
}