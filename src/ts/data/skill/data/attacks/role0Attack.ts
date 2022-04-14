import { Bodies } from "matter-js";
import { SkillProto } from "../../../../anxi/controller/skill/proto";
import { ActionData } from "../../../../anxi/controller/view/action";
import { Attack } from "../../../../core/attack/Attack";
import { VitaAttribute } from "../../../../core/chain/vita/Attribute";
import { Vita } from "../../../../core/chain/vita/Vita";
import { StateCache } from "../../../../core/controller/state/StateCache";
import { EquipCache } from "../../../../core/equip/EquipCache";
import { CommonAttack } from "../helper/common";
import { AttackProto } from "./Proto";


interface D {
  freezeUntil: number
  lastTime: number
  lastIndex: number
}

const attack0: AttackProto = {
  checkTimes: [0.5, 1.0],
  debuff: [{
    state: StateCache.beHitBehind,
    continue: 10
  }],
  getHitBody(vita: Vita<VitaAttribute>) {
    return Bodies.rectangle(0, 0, 100, 50);
  },
  actionData(need: number) {
    return {
      [EquipCache.weapon]: {
        frames: [0, 12, 20].map(v => (v / 20 * need) | 0),
        value: [
          [20, 0, 185],
          [22, 11, 280],
          [20, 0, 185]
        ]
      },
      [EquipCache.hand_r]: {
        frames: [0, 12, 20].map(v => (v / 20 * need) | 0),
        value: [
          [0, -3, 15],
          [0, -3, 45],
          [0, -3, 15],
        ]
      }
    }
  }
}

const attack1: AttackProto = {
  checkTimes: [.5, 1.0],
  debuff: [{
    state: StateCache.beHitBehind,
    continue: 10
  }],
  getHitBody(vita: Vita<VitaAttribute>) {
    return Bodies.rectangle(0, 0, 100, 50);
  },
  actionData(need: number) {
    return {
      [EquipCache.weapon]: {
        frames: [0, 2, 4, 6, 8, 10, 12, 14, 16].map(v => (v / 16 * need) | 0),
        value: [
          [20, 0, 185],
          [16, 15, 280],
          [-4, 20, 280],
          [0, 20, 280],
          [4, 20, 273],
          [10, 20, 273],
          [16, 17, 273],
          [20, 0, 185],
          [20, 0, 185],
        ]
      },
      [EquipCache.hand_r]: {
        frames: [0, 2, 4, 6, 8, 10, 12, 14, 16].map(v => (v / 16 * need) | 0),
        value: [
          [0, -3, 15],
          [0, -3, 55],
          [0, -3, 95],
          [0, -3, 85],
          [0, -3, 75],
          [0, -3, 65],
          [0, -3, 55],
          [0, -3, 15],
          [0, -3, 15],
        ]
      }
    }
  }
}

export const Role0Attack = new SkillProto<{}, D>(0, '普通攻击-孤影剑客')
  .initData(function () {
    return {
      freezeUntil: 0,
      lastIndex: 0,
      lastTime: -Infinity
    }
  })
  .init(function () {

  }).execute(function () {
    const { quark, data } = this;
    const vita = quark as Vita<VitaAttribute>;

    const state = vita.stateController;

    const time = vita.time;

    let index = 0;
    if (!state.some(StateCache.jump, StateCache.jumpSec, StateCache.drop)) {
      if (time - data.freezeUntil < 30) {
        index = (data.lastIndex + 1) % 2;
      }
      // state.removeState(StateCache.go, StateCache.run);
    }


    const proto = [attack0, attack1][index];

    // 更新data，执行攻击
    const atp = vita.attribute.get('ats');

    const needed = Math.ceil(60 / atp);

    data.freezeUntil = time + needed;
    data.lastIndex = index;
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
      StateCache.beHitBehind,
      StateCache.dizzy.priority,
      StateCache.hard.priority,
      StateCache.attack
    )) return false;

    return true;
  });

