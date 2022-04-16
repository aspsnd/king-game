import { Body } from "matter-js"
import { ActionStruct } from "../../../../anxi/controller/view/action"
import { VitaAttribute } from "../../../../core/chain/vita/Attribute"
import { Vita } from "../../../../core/chain/vita/Vita"
import { ValueOf } from "../../../../util/types";

export const AttackType = {
  sword: 0,
  arrow: 1
} as const;
export type AttackType = ValueOf<typeof AttackType>;

export interface AttackProto {
  type: AttackType
  flyerOffset: [number, number]
  flyerSpeed?: [number, number]
  checkTimes: [number, number]
  debuff: Array<{
    state: number
    continue: number
  }>
  getHitBody(vita: Vita<VitaAttribute>): Body
  actionData(needTime: number): ActionStruct[string]
}