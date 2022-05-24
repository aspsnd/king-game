import { AnxiEvent } from "../../../aixi/eventer/Event";
import { AttributeController } from "../attribute";
import { Controller } from "../controller";
import { Skill } from "./skill";

export class SkillController extends Controller {
  skillIndexs: Record<number, number> = {}
  skills: Skill[] = []
  skillMap = new Map<number, Skill>()

  add(skill: Skill, index = -1) {
    this.skills.push(skill);
    this.skillIndexs[index] = skill.index;
    this.skillMap.set(skill.index, skill);
    for (const Construct of skill.proto.extraControllers) {
      if (!this.belonger.get(Construct)) new Construct(this.belonger);
    }
    skill.link(this.belonger);
    for (const [k, { rely, caculator, annoy }] of Object.entries(skill.proto.initedAttrs)) {
      const attr = this.belonger.get(AttributeController).getAttr(k);
      attr.rely(...rely);
      annoy ? attr.addAnnoyCaculator(caculator) : attr.addCommonCaculator(caculator);
    }
    skill.init();
    this.belonger.get(AttributeController).needCompute = true;
    this.belonger.on(new AnxiEvent('addskill', skill));
  }
  release(skill: Skill) {
    this.skills.splice(this.skills.indexOf(skill), 1);
    this.skillMap.delete(skill.index);
    for (const [k, { rely, caculator, annoy }] of Object.entries(skill.proto.initedAttrs)) {
      const attr = this.belonger!.get(AttributeController).getAttr(k);
      attr.removeRely(...rely);
      attr.removeCaculator(caculator, annoy);
    }
    skill.remove();
    this.belonger.get(AttributeController).needCompute = true;
    this.belonger!.on(new AnxiEvent('removeskill', skill));
  }

  wantSkill(index: number) {
    const skill = this.skillMap.get(this.skillIndexs[index]);
    if (!skill) return;
    if (!skill.proto._active) return;
    if (!skill.canExecute()) return;
    skill.executing = true;
    skill.execute();
  }
  wantCancel(index: number) {
    const skill = this.skillMap.get(this.skillIndexs[index]);
    if (!skill) return;
    if (!skill.executing) return;
    skill.cancel();
  }

}