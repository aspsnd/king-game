import { BaseBodyStruct } from "../../../anxi/controller/view";
import { ActionData, ActionStruct } from "../../../anxi/controller/view/action";
import { VitaAttribute } from "./Attribute";
import { Body } from "matter-js";
import { Vita } from "./Vita";

export interface JumpSpeedFunc {
  (jumpIndex: number, jumpTime: number, speed: number): number
}

export const CommonJumpSpeed = (_jumpIndex: number, jumpTime: number, speed: number) => {
  return (900 - jumpTime * jumpTime) * speed * 0.25 * 0.011;
};

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
  maxJumpTimes: number
  jumpSpeedFunc: JumpSpeedFunc
}