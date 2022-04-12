import { Controller } from "../../anxi/controller/controller";
import { VitaAttribute } from "../chain/vita/Attribute";
import { Vita } from "../chain/vita/Vita";
import { StateCache } from "../state/StateCache";

export class StatingController extends Controller {

  declare belonger: Vita<VitaAttribute>
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

    stateController.on(StateCache.jump, () => {
      belonger.y -= belonger.proto.jumpSpeedFunc(0, jump.time, speed.value);
    });
    stateController.on(StateCache.jumpSec, () => {
      belonger.y -= belonger.proto.jumpSpeedFunc(1, jump.time, speed.value);
    });

    const drop = stateController.get(StateCache.drop)!;

    stateController.on(StateCache.drop, () => {
      if (stateController.some(StateCache.jumpSec, StateCache.jump, StateCache.hover)) {
        stateController.setStateInfinite(StateCache.drop, false);
      } else {
        belonger.y += belonger.proto.dropSpeedFunc(drop.time, speed.value);
      }
    });

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
    })

  }
}