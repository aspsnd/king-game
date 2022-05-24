import { AnxiPlainHandler, BEN } from "../../../../aixi/eventer/Eventer";
import { Skill } from "../../../../anxi/controller/skill/skill";
import { VitaAttribute } from "../../../../core/chain/vita/Attribute";
import { Vita } from "../../../../core/chain/vita/Vita";
import { StateCache } from "../../../../core/controller/state/StateCache";

export const useInterrupt = (vita: Vita<VitaAttribute>, skill: Skill) => {
  vita.stateController.get(StateCache.attack)!.on('lost', () => {
    skill.executing = false;
  })
}

export const listenAvoidInterruptOnce = (vita: Vita<VitaAttribute>, name: BEN, handler: AnxiPlainHandler<BEN>, interruptHandler?: () => void) => {
  const listener1 = vita.once(name, e => {
    vita.stateController.get(StateCache.attack)!.removeListener(listener2);
    return handler(e);
  });
  const listener2 = vita.stateController.get(StateCache.attack)!.once('lost', () => {
    if (listener1.valid) {
      vita.removeListener(listener1);
      if (interruptHandler) {
        interruptHandler();
      }
    }
  });
}