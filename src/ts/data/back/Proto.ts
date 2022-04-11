import { Sprite } from "pixi.js"

export interface BackProto {
  index: number
  children: Array<{
    texture: string
    type: 'sprite' | 'tiling'
    size: [number, number]
    position: [number, number]
    offsetMode: 'none' | 'linear' | 'function' | 'update'
    linearOffset?: [number, number]
    offsetFunction?(offset: [number, number]): [number, number]
    updateFunction?(sprite: Sprite, offset: [number, number]): void
  }>
}