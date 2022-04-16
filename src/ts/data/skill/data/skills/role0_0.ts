import { SkillProto } from "../../../../anxi/controller/skill/proto";
import { Affect } from "../../../../core/affect/Affect";
import { Role } from "../../../../core/chain/role/Role";
import { VitaAttribute } from "../../../../core/chain/vita/Attribute";
import { Vita } from "../../../../core/chain/vita/Vita";

export const SkillRole0_0: SkillProto = new SkillProto(1000, '轻灵之心', {
  intro: '【被动】增加[8+([等级]/10)%]的闪避率，且每当成功闪避一次攻击会回复自身已损失蓝量的10%。'
})
  .active(false)
  .initAttr('dod', [], (controller, attr) => {
    attr.extra += Math.round(8 + (controller.belonger as Role).level * 0.1) / 100;
  })
  .initListen('levelup', (role) => {
    return () => {
      (role as Vita<any>).attribute.needCompute = true;
    };
  })
  .initListen('dodaffect', quark => {
    return () => {
      const vita = quark as Vita<VitaAttribute>;
      const lostedMp = vita.attribute.get('mp') - vita.var.mp;
      const mpr = Math.round(lostedMp * 0.1);
      const affect = new Affect(vita, vita);
      affect.positive = true;
      affect.recover.mp = mpr;
      affect.emit();
    }
  })