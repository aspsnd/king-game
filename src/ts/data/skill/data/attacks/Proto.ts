import { Body } from "matter-js"
import { ActionStruct } from "../../../../anxi/controller/view/action"
import { VitaAttribute } from "../../../../core/chain/vita/Attribute"
import { Vita } from "../../../../core/chain/vita/Vita"

export interface AttackProto {
  checkTimes: [number, number]
  debuff: Array<{
    state: number
    continue: number
  }>
  getHitBody(vita: Vita<VitaAttribute>): Body
  actionData(needTime: number): ActionStruct[string]
}