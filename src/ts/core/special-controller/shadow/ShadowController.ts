import { Quark } from "../../../anxi/chain/Quark";
import { Controller } from "../../../anxi/controller/controller";
import { VitaAttribute } from "../../chain/vita/Attribute";
import { Vita } from "../../chain/vita/Vita";
import { Shadow, ShadowState } from "./Shadow";

export class ShadowController extends Controller {

  // 残影保留时间
  continueTime = 180

  // 残影消失时爆炸
  endBoom = false

  constructor(belonger: Quark) {
    super(belonger);
  }

  shadows: Shadow[] = []
  onTime(_delta: number): void {
    super.onTime(_delta);
    this.shadows = this.shadows.filter(s => s.state === ShadowState.common);
    for (const shadow of this.shadows) {
      if (shadow.time >= this.continueTime) {
        if (this.endBoom) {
          shadow.boom();
        } else {
          shadow.destroy();
        }
      }
    }
  }

  create(x: number, y: number, belonger: Vita<VitaAttribute>, scaleX: number) {
    const shadow = new Shadow(belonger, scaleX);
    shadow.x = x;
    shadow.y = y;
    this.shadows.push(shadow);
    return shadow;
  }
}