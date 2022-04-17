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
  lastIndex: number
}

const attack0: AttackProto = {
  type: AttackType.sword,
  flyerOffset: [40, -10],
  checkTimes: [0.5, 1.0],
  debuff: [{
    state: StateCache.beHitBehind.priority,
    continue: 10
  }],
  getHitBody() {
    return Bodies.rectangle(0, 0, 80,80);
  },
  actionData(need: number) {
    return {
      [BodyCache.weapon]: {
        frames: [0, 8, 20].map(v => (v / 20 * need) | 0),
        value: [
          [20, 0, 185],
          [22, 11, 280],
          [20, 0, 185]
        ]
      },
      [BodyCache.hand_r]: {
        frames: [0, 8, 20].map(v => (v / 20 * need) | 0),
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
  type: AttackType.sword,
  flyerOffset: [45, 5],
  checkTimes: [.5, 1.0],
  debuff: [{
    state: StateCache.beHitBehind.priority,
    continue: 10
  }],
  getHitBody(vita: Vita<VitaAttribute>) {
    return Bodies.rectangle(0, 0, 100, 60);
  },
  actionData(need: number) {
    return {
      [BodyCache.weapon]: {
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => (v / 10 * need) | 0),
        value: [
          [20, 0, 185],
          [18, 15, 275],
          [-4, 20, 275],
          [-13, 12, 275],
          [-20, 8, 275],
          [-8, 16, 275],
          [18, 13, 270],
          [30, -5, 270],
          [33, -5, 270],
          [24, -3, 225],
          [20, 0, 185],
        ]
      },
      [BodyCache.hand_r]: {
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => (v / 10 * need) | 0),
        value: [
          [0, -3, 15],
          [0, -3, 52],
          [0, -3, 90],
          [0, -3, 127],
          [0, -3, 155],
          [0, -3, 102],
          [0, -3, 55],
          [0, -3, 0],
          [0, -3, 0],
          [0, -3, 7],
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
      if (time - data.freezeUntil < 15) {
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
      StateCache.beHitBehind.priority,
      StateCache.dizzy.priority,
      StateCache.hard.priority,
      StateCache.attack
    )) return false;

    return true;
  });
