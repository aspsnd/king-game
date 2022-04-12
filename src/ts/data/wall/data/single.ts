import { Bodies } from "matter-js";
import { WallProto } from "../../../core/chain/wall/Proto";

export const WallProto1: WallProto = {
  index: 1,
  size: [200, 30],
  textureOffset: [0, 0],
  anchor: [.5, .5],
  createBody() {
    return Bodies.rectangle(0, 0, 200, 30, {
      isStatic: true
    });
  },
  glue: false,
  crossUp: false,
  canDown: false,
  texture: 'static/scene/board/1.png',
  textureType: 'sprite',
  filters: []
}