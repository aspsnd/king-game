import { Container, Loader, Sprite, TilingSprite } from "pixi.js";
import { Quark } from "../../../anxi/chain/Quark";
import { StateItem } from "../../../anxi/controller/state/item";
import { ConstViewer } from "../../../anxi/controller/view-const";
import { PhysicsController } from "../../../anxi/physics/atom";
import { directBy, directStatic } from "../../../util/texture";
import { StateCache } from "../../controller/state/StateCache";
import { VitaAttribute } from "../vita/Attribute";
import { Vita } from "../vita/Vita";
import { WallProto } from "./Proto";

export class Wall extends Quark {
  physicsController: PhysicsController<boolean>;
  viewController: ConstViewer<Container>;
  canDown: boolean;
  glue: boolean;
  crossUp: boolean;
  constructor(readonly proto: WallProto) {
    super();

    const body = proto.createBody();
    this.physicsController = new PhysicsController(this, {
      isBody: true,
      body
    });

    body.collisionFilter.group = Symbol() as unknown as number;
    body.collisionFilter.category = 0b00100000;
    body.collisionFilter.mask = 0b11000000;

    this.physicsController.on('collisionStart', e => {
      const physics = e.data[0] as PhysicsController<true>;
      const vita = physics.belonger as Vita<VitaAttribute>;

      const left = physics.box.bounds.max.x - body.bounds.min.x;
      const right = body.bounds.max.x - physics.box.bounds.min.x;

      const top = physics.box.bounds.max.y - body.bounds.min.y;
      const bottom = body.bounds.max.y - physics.box.bounds.min.y;

      let min = left;
      let target = 0;

      let toLeft = left < right;
      let toTop = top < bottom;

      if (right < min) {
        target = 1;
        min = right;
      }
      if (top < min) {
        target = 2;
        min = top;
      }
      if (bottom < min) {
        target = 3;
        min = bottom;
      }

      switch (target) {
        case 0: {
          if (this.crossUp) break;
          vita.x -= left - 1;
          if (!vita.forbidRight) vita.forbidRight = this;
          break;
        }
        case 1: {
          if (this.crossUp) break;
          vita.x += right - 1;
          if (!vita.forbidLeft) vita.forbidLeft = this;
          break;
        }
        case 2: {
          vita.y -= top - 1;
          vita.stateController.setStateInfinite(StateCache.drop, false);
          vita.stateController.setStateInfinite(StateCache.onGround, true);
          vita.currentGround = this;
          vita.instructController.jumpTimes = 0;
          if (this.glue) vita.stateController.insertStateItem(StateCache.linkGround.priority, new StateItem(0, true));
          break;
        }
        case 3: {
          if (this.crossUp) break;
          vita.y += bottom;
          vita.stateController.removeState(StateCache.jump, StateCache.jumpSec);
          break;
        }
      }

    });

    this.physicsController.on('collisionEnd', e => {
      const physics = e.data[0] as PhysicsController<true>;
      const vita = physics.belonger as Vita<VitaAttribute>;
      if (vita.currentGround === this) {
        vita.currentGround = undefined;
        vita.stateController.setStateInfinite(StateCache.onGround, false);
        vita.stateController.setStateInfinite(StateCache.drop, true);
      }
      if (vita.forbidLeft === this) vita.forbidLeft = undefined;
      if (vita.forbidRight === this) vita.forbidRight = undefined;
    });

    const container = new Container();

    this.viewController = new ConstViewer(this, container);

    let sprite: Sprite;
    if (proto.textureType === 'sprite') {
      sprite = new Sprite(directBy(proto.texture));
    } else {
      sprite = new TilingSprite(directBy(proto.texture));
    }
    if (proto.size) {
      sprite.width = proto.size[0];
      sprite.height = proto.size[1];
    }
    if (proto.textureOffset) {
      sprite.position.set(...proto.textureOffset);
    }
    if (proto.anchor) {
      sprite.anchor.set(...proto.anchor);
    }

    container.addChild(sprite);

    this.canDown = proto.canDown;
    this.glue = proto.glue;
    this.crossUp = proto.crossUp;

  }

}