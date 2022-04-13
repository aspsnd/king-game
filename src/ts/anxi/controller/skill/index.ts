import { AnxiEvent } from "../../../aixi/eventer/Event";
import { AttributeController } from "../attribute";
import { Controller } from "../controller";
import { Skill } from "./skill";

export class SkillController extends Controller {
  skillIndexs: Record<number, number> = {}
  skills: Skill[] = []
  skillMap = new Map<number, Skill>()

  add(skill: Skill) {
    this.skills.push(skill);
    this.skillMap.set(skill.index, skill);
    skill.link(this.belonger!);
    skill.init();
    for (const [k, { rely, caculator, annoy }] of Object.entries(skill.proto.initedAttrs)) {
      const attr = this.belonger!.get(AttributeController).getAttr(k);
      attr.rely(...rely);
      annoy ? attr.addAnnoyCaculator(caculator) : attr.addCommonCaculator(caculator);
    }
    this.belonger!.on(new AnxiEvent('addskill', skill));
  }
  release(skill: Skill) {
    this.skills.splice(this.skills.indexOf(skill), 1);
    this.skillMap.delete(skill.index);
    skill.remove();
    for (const [k, { rely, caculator, annoy }] of Object.entries(skill.proto.initedAttrs)) {
      const attr = this.belonger!.get(AttributeController).getAttr(k);
      attr.removeRely(...rely);
      attr.removeCaculator(caculator, annoy);
    }
    this.belonger!.on(new AnxiEvent('removeskill', skill));
  }

  init() {
    this.belonger!.on('wantskill', e => {
      /* TODO */
      const skill = this.skillMap.get(this.skillIndexs[e.data[0]]);
      if (!skill) return;
      skill.execute();
    })
  }

}