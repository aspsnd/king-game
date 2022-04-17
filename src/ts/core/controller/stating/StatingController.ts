import { AnxiEvent } from "../../../aixi/eventer/Event";
import { Controller } from "../../../anxi/controller/controller";
import { VitaAttribute } from "../../chain/vita/Attribute";
import { Vita } from "../../chain/vita/Vita";
import { Instructs } from "../instruct/const";
import { StateCache } from "../state/StateCache";

export class StatingController extends Controller {

  declare belonger: Vita<VitaAttribute>

  continueLefting = -1

  continueRighting = -1

  init(): void {

    super.init();

    const { belonger } = this;
    const { stateController, attribute } = belonger;
    const speed = attribute.getAttr('spd');

    stateController.on(StateCache.go, () => {
      belonger.x += belonger.face * speed.value;
    });

    stateController.on(StateCache.run, () => {
      belonger.x += belonger.face * speed.value * 1.5;
    })

    const jump = stateController.get(StateCache.jump)!;

    const jumpSec = stateController.get(StateCache.jumpSec)!;

    stateController.on(StateCache.jump, () => {
      belonger.y -= belonger.proto.jumpSpeedFunc(0, jump.time, speed.value);
    });
    stateController.on(StateCache.jumpSec, () => {
      belonger.y -= belonger.proto.jumpSpeedFunc(1, jumpSec.time, speed.value);
    });

    const drop = stateController.get(StateCache.drop)!;

    stateController.on(StateCache.drop, () => {
      if (stateController.some(StateCache.jumpSec, StateCache.jump, StateCache.hover)) {
        stateController.setStateInfinite(StateCache.drop, false);
      } else {
        belonger.y += belonger.proto.dropSpeedFunc(drop.time, speed.value);
      }
    });

    stateController.on(StateCache.rest, () => {
      if (stateController.headState.index !== StateCache.rest) {
        stateController.removeState(StateCache.rest);
      }
    })

    stateController.get(StateCache.jump)!.on('lost', () => {
      if (stateController.some(StateCache.jump, StateCache.jumpSec, StateCache.hover, StateCache.onGround)) return;
      stateController.setStateInfinite(StateCache.drop, true);
    });

    stateController.get(StateCache.jumpSec)!.on('lost', () => {
      if (stateController.some(StateCache.jump, StateCache.jumpSec, StateCache.hover, StateCache.onGround)) return;
      stateController.setStateInfinite(StateCache.drop, true);
    });

    stateController.get(StateCache.hover)!.on('lost', () => {
      if (stateController.some(StateCache.jump, StateCache.jumpSec, StateCache.hover, StateCache.onGround)) return;
      stateController.setStateInfinite(StateCache.drop, true);
    });

    const beControl = () => {
      stateController.removeState(
        StateCache.go,
        StateCache.run,
        StateCache.attack,
      );
    }

    const resumeMove = () => {
      if (this.continueLefting > 0 && this.continueLefting > this.continueRighting) {
        this.belonger.emit(new AnxiEvent(Instructs.wantleft));
        return;
      }
      if (this.continueRighting > 0 && this.continueRighting > this.continueLefting) {
        this.belonger.emit(new AnxiEvent(Instructs.wantright));
        return;
      }
    }

    stateController.get(StateCache.beHitBehind.priority)!.on('get', beControl);
    stateController.get(StateCache.dizzy.priority)!.on('get', beControl);

    stateController.get(StateCache.beHitBehind.priority)!.on('lost', resumeMove);
    stateController.get(StateCache.dizzy.priority)!.on('lost', resumeMove);

    if (belonger.proto.needRest) {
      const common = stateController.get(StateCache.common)!;
      const { restInterval, restTime } = belonger.proto;
      stateController.on(StateCache.common, () => {
        if (common.headTime >= restInterval) {
          stateController.setStateLeft(StateCache.rest, restTime);
        }
      })
    }

  }
}