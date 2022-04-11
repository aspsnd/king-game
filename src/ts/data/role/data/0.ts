import type { RoleProto } from "../../../core/chain/role/Proto";
import type { Role } from "../../../core/chain/role/Role";
import { Bodies, Body } from "matter-js";
import { ActionData } from "../../../anxi/controller/view/action";
import { StateCache } from "../../../core/state/StateCache";
import { EquipCache } from "../../../core/equip/EquipCache";
import { CommonJumpSpeed } from "../../../core/chain/vita/Proto";

export const RoleProto0: RoleProto = {
  index: 0,
  name: '孤影剑客',
  attr: {
    hp: 100,
    mp: 80,
    atk: 10,
    def: 0,
    crt: 0,
    dod: 0,
    hpr: 0,
    mpr: 0,
    spd: 2,
    ats: 1,
    timeSpeed: 1,
    timeSlot: 0
  },
  level: 1,
  group: 1,
  skills: [],
  maxJumpTimes: 2,
  jumpSpeedFunc: CommonJumpSpeed,
  fultureSkills: [{
    index: 0,
    cost: {
      money: 100
    }
  },
  {
    index: 1,
    cost: {
      money: 200
    }
  },
  {
    index: 2,
    cost: {
      money: 300
    }
  },
  {
    index: 3,
    cost: {
      money: 800
    }
  },
  {
    index: 4,
    cost: {
      money: 2400
    }
  }],
  talents: [],
  talentStars: 0,
  height: 0,
  fexpGetter: function (level: number): number {
    return Math.round(25 + 25 * level);
  },
  attrIncreaser: function (level: number) {
    return {
      hp: 25,
      mp: 20,
      atk: 3,
      def: 1.5,
      hpr: (level % 10 == 0) ? 1 : 0,
      mpr: (level % 10 == 5) ? 1 : 0,
    };
  },
  defaultBody: {
    [EquipCache.head]: {
      texture: 'static/role/0/1.png',
      anchor: [0.45, 0.74],
    },
    [EquipCache.body]: {
      texture: 'static/role/0/2.png',
      anchor: [.5, .5]
    },
    [EquipCache.hand_l]: {
      texture: 'static/role/0/3.png',
      anchor: [1 / 6, 0.5],
    },
    [EquipCache.hand_r]: {
      texture: 'static/role/0/4.png',
      anchor: [1 / 6, 0.5],
    },
    [EquipCache.leg_l]: {
      texture: 'static/role/0/5.png',
      anchor: [0.5, 0],
    },
    [EquipCache.leg_r]: {
      texture: 'static/role/0/6.png',
      anchor: [0.5, 0],
    },
    [EquipCache.weapon]: {
      texture: 'static/role/0/7.png',
      anchor: [2 / 3, 1 / 6],
    },
  },
  actions: new ActionData({
    [StateCache.common]: {
      [EquipCache.body]: {
        value: [
          [-1, 51]
        ]
      },
      [EquipCache.head]: {
        frames: [0, 16, 32],
        value: [
          [2, 20],
          [2, 21],
          [2, 20]
        ]
      },
      [EquipCache.hand_l]: {
        frames: [0, 16, 32],
        value: [
          [0, 35, 105],
          [0, 35, 104],
          [0, 35, 105]
        ]
      },
      [EquipCache.hand_r]: {
        frames: [0, 16, 32],
        value: [
          [0, 37, 15],
          [0, 37, 16],
          [0, 37, 15]
        ]
      },
      [EquipCache.leg_l]: {
        value: [
          [-2, 68, 30]
        ]
      },
      [EquipCache.leg_r]: {
        value: [
          [3, 68, -30]
        ]
      },
      [EquipCache.weapon]: {
        frames: [0, 16, 32],
        value: [
          [20, 40, 185],
          [20, 40, 186],
          [20, 40, 185]
        ]
      },
      [EquipCache.wing]: {
        frames: [0, 16, 32],
        value: [
          [0, 39],
          [0, 40],
          [0, 39],
        ]
      }
    },
    [StateCache.go]: {
      [EquipCache.leg_l]: {
        frames: [0, 24],
        value: [
          [-1, 68, 20],
          [4, 68, -30]
        ]
      },
      [EquipCache.leg_r]: {
        frames: [0, 24],
        value: [
          [5, 68, -20],
          [-2, 68, 30]
        ]
      }
    }
  }),
  uraSkill: 0,
  hitGraph() {
    return Bodies.rectangle(-20, 40, 40, 80);
  }
}