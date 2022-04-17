import { Container, Sprite, TilingSprite } from "pixi.js";
import { WorldViewController } from "../../../../anxi/controller/base-view/view/WorldViewer";
import { Controller } from "../../../../anxi/controller/controller";
import { gameHeight, gameWidth } from "../../../../config";
import { BackProtos } from "../../../../data/back";
import { BackProto } from "../../../../data/back/Proto";
import { directBack } from "../../../../util/texture";
import { CardWorld } from "../CardWorld";
import { StepController } from "./StepController";

const MaxChangeOffset = 5;

export class BackController extends Controller {

  declare belonger: CardWorld;
  container!: Container;
  backs: Sprite[] = []
  backProto!: BackProto
  offset: [number, number] = [0, 0]

  init(): void {
    super.init();
    this.container = this.belonger.wallContainer;
    const backProto = this.backProto = BackProtos[this.belonger.cardData.back];
    for (const back of backProto.children) {
      let sprite: Sprite | TilingSprite;
      if (back.type === 'sprite') {
        sprite = new Sprite(directBack(back.texture));
      } else {
        sprite = new TilingSprite(directBack(back.texture), ...back.size);
      }
      sprite.position.set(...back.position);
      sprite.width = back.size[0];
      sprite.height = back.size[1];
      this.container.addChild(sprite);
      this.backs.push(sprite);
    }
  }

  onTime(_delta: number): void {
    super.onTime(_delta);
    const { belonger } = this;

    const { limit, box } = belonger.get(StepController);

    const centerPos = [0, 0];

    if (this.belonger.roles.length > 1) {
      const [role1, role2] = this.belonger.roles;
      centerPos[0] = (role1.x + role2.x) * .5;
      centerPos[1] = (role1.y + role2.y) * .5;
    } else {
      const role = this.belonger.roles[0];
      centerPos[0] = role.x;
      centerPos[1] = role.y;
    }

    const targetOffset = [centerPos[0] - (gameWidth >> 1), centerPos[1] - (gameHeight >> 1)];

    const maxOffset = [box.width - gameWidth, box.height - gameHeight];

    const [oldX, oldY] = this.offset;

    targetOffset[0] = Math.max(Math.min(targetOffset[0], maxOffset[0]), 0);
    targetOffset[1] = Math.max(Math.min(targetOffset[1], maxOffset[1]), 0);

    const cx = Math.abs(targetOffset[0] - oldX);
    const cy = Math.abs(targetOffset[1] - oldY);

    const addX = targetOffset[0] - oldX > 0 ? 1 : -1;
    const addY = targetOffset[1] - oldY > 0 ? 1 : -1;

    const rcx = Math.max(Math.min(MaxChangeOffset, cx), cx * .8) * addX;
    const rcy = Math.max(Math.min(MaxChangeOffset, cy), cy * .8) * addY;

    const newX = oldX + rcx;
    const newY = oldY + rcy;

    this.offset[0] = newX;
    this.offset[1] = newY;

    this.belonger.get(WorldViewController).childContainer.x = -newX;
    this.belonger.get(WorldViewController).childContainer.y = -newY;
    this.belonger.wallContainer.x = -newX;
    this.belonger.wallContainer.y = -newY;

    let i = 0;
    for (const sprite of this.backs) {

      const config = this.backProto.children[i];
      switch (config.offsetMode) {
        case 'linear': {
          sprite.x = config.linearOffset![0] * newX;
          sprite.y = config.linearOffset![1] * newY;
          break;
        }
        case 'function': {
          sprite.position.set(...config.offsetFunction!(this.offset));
          break;
        }
        case 'update': {
          config.updateFunction!(sprite, this.offset);
          break;
        }
      }

    }

  }

}