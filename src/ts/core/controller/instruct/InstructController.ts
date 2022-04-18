import { AnxiEvent } from "../../../aixi/eventer/Event";
import { AnxiPlainHandler, BEN } from "../../../aixi/eventer/Eventer";
import { Controller } from "../../../anxi/controller/controller";
import { VitaAttribute } from "../../chain/vita/Attribute";
import { Vita } from "../../chain/vita/Vita";
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
      if (stateController.some(StateCache.hard.priority, StateCache.beHitBehind.priority, StateCache.dizzy.priority, StateCache.go)) return;
      if (e.data[0] === true) {
        stateController.setStateInfinite(StateCache.go, true);
      } else {
        stateController.setStateLeft(StateCache.go, e.data[0] ?? 60);
      }
    });
    this.registerLivingHandler(Instructs.wantleft, () => {
      belonger.statingController.continueLefting = belonger.time;
      if (stateController.some(StateCache.hard.priority, StateCache.beHitBehind.priority, StateCache.dizzy.priority)) return;
      if (stateController.some(StateCache.go) && belonger.face == -1) return;
      if (belonger.canRun() && belonger.face == -1) {
        stateController.setStateInfinite(StateCache.go, false);
        stateController.setStateInfinite(StateCache.run, true);
      } else {
        belonger.face = -1;
        stateController.setStateInfinite(StateCache.run, false);
        stateController.setStateInfinite(StateCache.go, true);
      }
    })
    this.registerLivingHandler(Instructs.wantright, () => {
      belonger.statingController.continueRighting = belonger.time;
      if (stateController.some(StateCache.hard.priority, StateCache.beHitBehind.priority, StateCache.dizzy.priority)) return;
      if (stateController.some(StateCache.go) && belonger.face == 1) return;
      if (belonger.canRun() && belonger.face == 1) {
        stateController.setStateInfinite(StateCache.go, false);
        stateController.setStateInfinite(StateCache.run, true);
      } else {
        belonger.face = 1;
        stateController.setStateInfinite(StateCache.run, false);
        stateController.setStateInfinite(StateCache.go, true);
      }
    });

    this.registerLivingHandler(Instructs.cancelleft, () => {
      belonger.statingController.continueLefting = -1;
      if (belonger.face == 1) return;
      stateController.setStateInfinite(StateCache.go, false);
      stateController.setStateInfinite(StateCache.run, false);
    });

    this.registerLivingHandler(Instructs.cancelright, () => {
      belonger.statingController.continueRighting = -1;
      if (belonger.face == -1) return;
      stateController.setStateInfinite(StateCache.go, false);
      stateController.setStateInfinite(StateCache.run, false);
    });

    this.registerLivingHandler(Instructs.wantjump, () => {
      if (stateController.some(StateCache.hard.priority, StateCache.attack, StateCache.beHitBehind.priority, StateCache.dizzy.priority, StateCache.linkGround.priority)) return;
      if (this.maxJumpTimes < 1 || this.jumpTimes == this.maxJumpTimes) return;

      this.jumpTimes++;
      if (this.jumpTimes == 1) {
        stateController.setStateLeft(StateCache.jump, 30);
      } else {
        stateController.removeState(StateCache.jump);
        stateController.setStateLeft(StateCache.jumpSec, 30);
      }
    });

    this.registerLivingHandler(Instructs.wantdown, () => {
      if (stateController.some(
        StateCache.drop,
        StateCache.jump,
        StateCache.jumpSec,
        StateCache.hover,
        StateCache.linkGround.priority
      )) return;

      //TODO 在地板上， 且地板可以下跳

      // TODO下落当前地板
      stateController.setStateInfinite(StateCache.drop, true);

    });

    this.registerLivingHandler(Instructs.wantdrop, () => {
      if (stateController.some(
        StateCache.drop,
        StateCache.jump,
        StateCache.jumpSec,
        StateCache.hover,
        StateCache.onGround
      )) return;
      stateController.setStateInfinite(StateCache.drop, true);
    });

    const attackSkill = belonger.skillController!.skillMap.get(belonger.proto.attack)!;
    this.registerLivingHandler(Instructs.wantattack, () => {
      if (attackSkill.canExecute()) attackSkill.execute();
    });

    const skillController = belonger.skillController;
    this.registerLivingHandler(Instructs.wantskill, e => {
      skillController.wantSkill(e.data[0]);
    });
    this.registerLivingHandler(Instructs.cancelskill, e => {
      skillController.wantCancel(e.data[0]);
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