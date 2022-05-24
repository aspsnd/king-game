import { SkillProto } from "../../../../anxi/controller/skill/proto";
import { VitaAttribute } from "../../../../core/chain/vita/Attribute";
import { Vita } from "../../../../core/chain/vita/Vita";
import { ShadowState } from "../../../../core/special-controller/shadow/Shadow";
import { ShadowController } from "../../../../core/special-controller/shadow/ShadowController";
import { canNotUseSkillCommon } from "../helper/state";

export const SkillRole0_3 = new SkillProto(1003, '魔影杀', {
  intro: '【被动】残影的滞留时间增加为5秒。\n所有残影化为剑气，向自身飞回对途径敌人造成伤害，残影数量越多伤害越高，一个敌人可以被多个残影打中。'
}).active(true)
  .useExtraController(ShadowController)
  .init(function () {
    const controller = this.quark.get(ShadowController);
    controller.continueTime = 300;
  })
  .canExecute(function () {
    const belonger = this.quark as Vita<VitaAttribute>;
    const controller = belonger.get(ShadowController);
    if (!controller.shadows.some(v => v.state === ShadowState.common)) return false;
    return belonger.var.mp >= 40 && !canNotUseSkillCommon(belonger.stateController);
  })
  .execute(function () {
    const belonger = this.quark as Vita<VitaAttribute>;
    belonger.var.mp -= 40;
    const controller = belonger.get(ShadowController);
    const shadows = controller.shadows.filter(shadow => shadow.state === ShadowState.common);
    const num = shadows.length;
    for (const shadow of shadows) {
      shadow.follow(belonger, num);
    }
  });