import { SkillProto } from "../../../../anxi/controller/skill/proto";
import { StateItem } from "../../../../anxi/controller/state/item";
import { Affect } from "../../../../core/affect/Affect";
import type { VitaAttribute } from "../../../../core/chain/vita/Attribute";
import type { Vita } from "../../../../core/chain/vita/Vita";
import { StateCache } from "../../../../core/controller/state/StateCache";
import { canNotUseSkillCommon } from "../helper/state";

interface D {
  endTime: number
}

export const SkillRole0_1 = new SkillProto<{ intro: string }, D>(1001, '断魂闪', {
  intro: '耗费10%最大生命值，闪避3秒内的一次攻击，并眩晕攻击者3秒(无法对3秒内受到过眩晕的敌人造成眩晕)'
})
  .initData(function () {
    return {
      endTime: -Infinity
    }
  })
  .active(true)
  .canExecute(function () {
    const { data: { endTime } } = this;
    const belonger = this.quark as Vita<VitaAttribute>;
    if (endTime >= belonger.time) return false;
    const hp = belonger.attribute.get('hp');
    return hp * .1 < belonger.var.hp && !canNotUseSkillCommon(belonger.stateController);
  })
  .initListen('preBeAffect0', (quark, skill) => {
    return (e) => {
      const { time } = quark;
      const { data: { endTime } } = skill;
      if (endTime < time) return;
      const affect = e.data[0] as Affect;
      affect.dodCaculated = true;
      affect.doded = true;
      const { from } = affect;
      const state = from.stateController;
      const dizzyState = state.get(StateCache.dizzy.priority)!;
      if (dizzyState.lastGet + 60 * 3 < from.time) {
        state.insertStateItem(StateCache.dizzy.priority, new StateItem(60 * 3));
      }
    }
  })
  .execute(function () {
    const belonger = this.quark as Vita<VitaAttribute>;
    belonger.var.hp -= belonger.attribute.get('hp') * .1;
    this.data.endTime = belonger.time + 60 * 3;
  })