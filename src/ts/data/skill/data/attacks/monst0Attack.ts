import { Bodies } from "matter-js";
import { SkillProto } from "../../../../anxi/controller/skill/proto";
import { ActionData } from "../../../../anxi/controller/view/action";
import { Attack } from "../../../../core/attack/Attack";
import { VitaAttribute } from "../../../../core/chain/vita/Attribute";
import { Vita } from "../../../../core/chain/vita/Vita";
import { StateCache } from "../../../../core/controller/state/StateCache";
import { BodyCache } from "../../../../core/equip/BodyCache";
import { CommonAttack } from "../helper/common";
import { AttackProto, AttackType } from "./Proto";


interface D {
  freezeUntil: number
  lastTime: number
}
const proto: AttackProto = {
  type: AttackType.sword,
  flyerOffset: [22, -8],
  checkTimes: [0.1, 0.5],
  debuff: [{
    state: StateCache.beHitBehind.priority,
    continue: 10
  }],
  getHitBody(vita: Vita<VitaAttribute>) {
    return Bodies.circle(0, 0, 35, {
      isSensor: true,
      collisionFilter: {
        group: 5
      }
    });
  },
  actionData(need: number) {
    return {
      [BodyCache.weapon]: {
        frames: [0, 6, 15].map(v => (v / 15 * need) | 0),
        value: [
          [0, -7, 185],
          [0, -7, 280],
          [0, -7, 185]
        ]
      }
    }
  }
}
export const Monst0Attack = new SkillProto<{}, D>(1, '普通攻击-斧头兵')
  .initData(function () {
    return {
      freezeUntil: 0,
      lastTime: -Infinity
    }
  })
  .init(function () {

  }).execute(function () {
    const { quark, data } = this;
    const vita = quark as Vita<VitaAttribute>;

    const state = vita.stateController;

    const time = vita.time;
    // 更新data，执行攻击
    const atp = vita.attribute.get('ats');

    const needed = Math.ceil(60 / atp);

    data.freezeUntil = time + needed;
    data.lastTime = time;

    state.setStateLeft(StateCache.attack, needed);

    const action = proto.actionData(needed);

    const view = vita.viewController;

    const actionIndex = view.insertAction(new ActionData({
      [StateCache.attack]: action
    }).standard[StateCache.attack]);

    state.get(StateCache.attack)!.once('lost', () => {
      view.removeAction(actionIndex);
    });

    // 数值的表示
    const attack = new Attack(proto, vita);

    // 攻击的执行
    new CommonAttack(proto, vita, attack, needed).emit();

  }).canExecute(function () {
    const { quark, data } = this;
    const vita = quark as Vita<VitaAttribute>;

    if (vita.dead) return false;
    if (vita.time < data.freezeUntil) return false;
    if (vita.stateController.some(
      StateCache.beHitBehind.priority,
      StateCache.dizzy.priority,
      StateCache.hard.priority,
      StateCache.attack
    )) return false;

    return true;
  });
