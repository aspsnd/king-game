import { BaseBodyStruct } from "../../../anxi/controller/view";
import { ActionData, ActionStruct } from "../../../anxi/controller/view/action";
import { RoleAttribute } from "./Attribute";
import { Body } from "matter-js";
import { VitaProto } from "../vita/Proto";
import { Vita } from "../vita/Vita";

export interface RoleProto extends VitaProto {
  index: number
  attr: RoleAttribute
  name: string
  level: number
  group: number
  skills: number[]
  fultureSkills: Array<{
    index: number
    cost: {
      money: number
    }
  }>
  talents: number[]
  talentStars: number
  height: number
  fexpGetter(level: number): number
  attrIncreaser(level: number): Partial<RoleAttribute>
  defaultBody: BaseBodyStruct
  actions: ActionData | ActionStruct
  uraSkill: number
  hitGraph(role: Vita<any>): Body
}