import { AnxiEvent } from "../../aixi/eventer/Event";
import { AnxiPlainHandler, BEN } from "../../aixi/eventer/Eventer";
import { Controller } from "../../anxi/controller/controller";
import { VitaAttribute } from "../chain/vita/Attribute";
import { Vita } from "../chain/vita/Vita";
import { StateCache } from "../state/StateCache";
import { Instructs } from "./const";

export class InstructController extends Controller {

  declare belonger: Vita<VitaAttribute>
  jumpTimes: number = 0;
  declare maxJumpTimes: number;

  init(): void {
    super.init();
    const { belonger } = this;
    this.maxJumpTimes = belonger.proto.maxJumpTimes;
    const { stateController } = belonger;
    this.registerLivingHandler(Instructs.wantgo, (e: AnxiEvent) => {
      if (stateController.some(StateCache.hard.priority, StateCache.beHitBehind, StateCache.dizzy.priority, StateCache.attack, StateCache.go)) return;
      if (e.data[0] === true) {
        stateController.setStateInfinite(StateCache.go, true);
      } else {
        stateController.setStateLeft(StateCache.go, e.data[0] ?? 60);
      }
    });
    this.registerLivingHandler(Instructs.wantleft, () => {
      if (belonger.dead) return;
      if (stateController.some(StateCache.hard.priority, StateCache.beHitBehind, StateCache.dizzy.priority, StateCache.attack)) return;
      if (stateController.some(StateCache.go) && belonger.face == -1) return;
      if (belonger.canRun() && belonger.face == -1) {
        stateController.setStateInfinite(StateCache.go, false);
        stateController.setStateInfinite(StateCache.run, true);
      } else {
        belonger.face = -1;
        stateController.setStateInfinite(StateCache.go, true);
      }
    })
    this.registerLivingHandler(Instructs.wantright, () => {
      if (belonger.dead) return;
      if (stateController.some(StateCache.hard.priority, StateCache.beHitBehind, StateCache.dizzy.priority, StateCache.attack)) return;
      if (stateController.some(StateCache.go) && belonger.face == 1) return;
      if (belonger.canRun() && belonger.face == 1) {
        stateController.setStateInfinite(StateCache.go, false);
        stateController.setStateInfinite(StateCache.run, true);
      } else {
        belonger.face = 1;
        stateController.setStateInfinite(StateCache.go, true);
      }
    });

    this.registerLivingHandler(Instructs.cancelleft, () => {
      if (belonger.dead) return;
      if (belonger.face == 1) return;
      stateController.setStateInfinite(StateCache.go, false);
      stateController.setStateInfinite(StateCache.run, false);
    });

    this.registerLivingHandler(Instructs.cancelright, () => {
      if (belonger.dead) return;
      if (belonger.face == -1) return;
      stateController.setStateInfinite(StateCache.go, false);
      stateController.setStateInfinite(StateCache.run, false);
    });

    this.registerLivingHandler(Instructs.wantjump, () => {
      if (belonger.dead) return;
      if (stateController.some(StateCache.hard.priority, StateCache.attack, StateCache.beHitBehind, StateCache.dizzy.priority, StateCache.linkGround.priority)) return;
      if (this.maxJumpTimes < 1 || this.jumpTimes == this.maxJumpTimes) return;

      this.jumpTimes++;
      if (this.jumpTimes == 1) {
        stateController.setStateLeft(StateCache.jump, 30);
      } else {
        stateController.removeState(StateCache.jump);
        stateController.setStateLeft(StateCache.jumpSec, 30);
      }
    });

  }
  registerLivingHandler(name: BEN, handler: AnxiPlainHandler<BEN>) {
    const { belonger } = this;
    return this.eventer.on(name, (e) => {
      if (belonger.dead) return true;
      return handler(e);
    });
  }
}