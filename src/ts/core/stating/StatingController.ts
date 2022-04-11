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
    })

    const jump = stateController.get(StateCache.jump)!;

    stateController.on(StateCache.jump, () => {
      belonger.y -= belonger.proto.jumpSpeedFunc(0, jump.time, speed.value);
    });
    stateController.on(StateCache.jumpSec, () => {
      belonger.y -= belonger.proto.jumpSpeedFunc(1, jump.time, speed.value);
    });

  }
}