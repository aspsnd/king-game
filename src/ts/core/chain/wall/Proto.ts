import { Body } from "matter-js"
import { Filter } from "pixi.js"

export interface WallProto {
  index: number
  createBody(): Body
  // 是否施加缚地效果
  glue: boolean
  // 是否可以下跳
  canDown: boolean
  // 是否可以从下穿透跳上去
  crossUp: boolean
  texture: string
  size?: [number, number]
  textureOffset?: [number, number]
  anchor?: [number, number]
  textureType: 'sprite' | 'tiling'
  filters: (abstract new () => Filter)[]
  updateFunction?(): void
}