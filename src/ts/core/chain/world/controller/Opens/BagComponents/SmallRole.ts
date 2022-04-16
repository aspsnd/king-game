import { Container, Matrix, Sprite } from "pixi.js";
import { StateCache } from "../../../../../controller/state/StateCache";
import { ActionData, StandardActionStruct } from "../../../../../../anxi/controller/view/action/index";
import { Role } from "../../../../role/Role";
import { getCurrent } from "../../../../../../anxi/controller/view/util";

export class SmallRole extends Container {

  time = 0;
  baseAction!: StandardActionStruct;

  onTime() {
    this.time++;
    const stateIndex = StateCache.common;
    for (const bodyIndex in this.blocks) {
      let sprite = this.blocks[bodyIndex];
      let action = this.baseAction[stateIndex]?.[bodyIndex];
      if (!action) continue;
      const current = getCurrent(action, this.time);
      let result = current as Matrix;
      sprite.transform.setFromMatrix(result);
    }
  }

  constructor() {
    super();
  }

  blocks: Record<string, Sprite> = {}

  role!: Role
  refreshView(role: Role) {
    this.role = role;
    this.baseAction = role.proto.actions instanceof ActionData ? role.proto.actions.standard : new ActionData(role.proto.actions).standard
    this.removeChildren();
    const view = role.viewController;
    for (const body in view.bodys) {
      const sprite = view.bodys[body];
      const s = this.blocks[body] = new Sprite(sprite.texture.clone());
      s.anchor.copyFrom(sprite.anchor);
      this.addChild(s);
    }
  }

}