import { Body } from "matter-js"
import { Filter } from "pixi.js"

export interface WallProto {
  position: [number, number]
  createBody(): Body
  glue: boolean
  canDown: boolean
  texture: string
  size?: [number, number]
  anchor?: [number, number]
  textureType: 'sprite' | 'tiling'
  filters: (abstract new () => Filter)[]
  updateFunction?(): void
}