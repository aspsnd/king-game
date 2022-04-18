import { SkillProto } from "../../../../anxi/controller/skill/proto";
import { VitaAttribute } from "../../../../core/chain/vita/Attribute";
import { Vita } from "../../../../core/chain/vita/Vita";
import { ShadowController } from "../../../../core/special-controller/shadow/ShadowController";
import { canNotUseSkillCommon } from "../helper/state";

export const SkillRole0_3 = new SkillProto(1004, '魔影杀', {
  intro: '【被动】残影的滞留时间增加为5秒。\n所有残影化为剑气，向自身飞回对途径敌人造成伤害，残影数量越多伤害越高，一个敌人可以被多个残影打中。若残影数量为0，则由自身向外发出9只残影，造成伤害'
}).active(true)
  .useExtraController(ShadowController)
  .canExecute(function () {
    const belonger = this.quark as Vita<VitaAttribute>;
    return belonger.var.mp >= 100 && !canNotUseSkillCommon(belonger.stateController);
  })
  .execute(function () {

  });