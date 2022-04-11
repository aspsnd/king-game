import { BaseBodyStruct } from "../../../anxi/controller/view";
import { ActionData, ActionStruct } from "../../../anxi/controller/view/action";
import { VitaAttribute } from "./Attribute";
import { Body } from "matter-js";
import { Vita } from "./Vita";

export interface VitaProto {
  index: number
  attr: VitaAttribute
  name: string
  level: number
  group: number
  skills: number[]
  talents: number[]
  talentStars: number
  height: number
  defaultBody: BaseBodyStruct
  actions: ActionData | ActionStruct
  hitGraph(role: Vita<any>): Body
}