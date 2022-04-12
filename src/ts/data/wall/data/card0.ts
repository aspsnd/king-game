import { Bodies } from "matter-js";
import { WallProto } from "../../../core/chain/wall/Proto";
import { grounds } from "../../../resources/list";

export const WallProto0: WallProto = {
  index: 0,
  size: [4500, 158],
  textureOffset: [0, -9],
  anchor: [.5, .5],
  createBody() {
    return Bodies.rectangle(2250, 520, 4500, 140, {
      isStatic: true,
      isSensor: true
    });
  },
  glue: false,
  canDown: false,
  texture: '/packed-resources/' + grounds["assets/scene/ground/1.png"],
  textureType: 'tiling',
  filters: []
}