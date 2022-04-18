import { StateController } from "../../../../anxi/controller/state";
import { StateCache } from "../../../../core/controller/state/StateCache";

export const canNotUseSkillCommon = (state: StateController) => state.some(
  StateCache.attack,
  StateCache.beHitBehind.priority,
  StateCache.dizzy.priority,
  StateCache.hard.priority,
)