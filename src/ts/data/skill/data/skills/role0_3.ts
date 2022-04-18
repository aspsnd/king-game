import { SkillProto } from "../../../../anxi/controller/skill/proto";
import { VitaAttribute } from "../../../../core/chain/vita/Attribute";
import { Vita } from "../../../../core/chain/vita/Vita";
import { ShadowController } from "../../../../core/special-controller/shadow/ShadowController";
import { canNotUseSkillCommon } from "../helper/state";

export const SkillRole0_3 = new SkillProto(1003, '悲影落', {
  intro: '向前位移【途中无敌】 原地留下一只残影'
}).active(true)
  .useExtraController(ShadowController)
  .canExecute(function () {
    const belonger = this.quark as Vita<VitaAttribute>;
    return belonger.var.mp >= 40 && !canNotUseSkillCommon(belonger.stateController);
  })
  .execute(function () {

  });