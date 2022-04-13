import type { RoleProto } from "../../../core/chain/role/Proto";
import { Bodies } from "matter-js";
import { ActionData } from "../../../anxi/controller/view/action";
import { StateCache } from "../../../core/controller/state/StateCache";
import { EquipCache } from "../../../core/equip/EquipCache";
import { CommonDropSpeed, CommonJumpSpeed } from "../../../core/chain/vita/Proto";

export const RoleProto0: RoleProto = {
  index: 0,
  name: '孤影剑客',
  restInterval: 60 * 5,
  restTime: 110,
  needRest: true,
  attack: 0,
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
  dropSpeedFunc: CommonDropSpeed,
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
          [-1, 11]
        ]
      },
      [EquipCache.head]: {
        frames: [0, 16, 32],
        value: [
          [2, -20],
          [2, -19],
          [2, -20]
        ]
      },
      [EquipCache.hand_l]: {
        frames: [0, -24, 32],
        value: [
          [0, -5, 105],
          [0, -5, 104],
          [0, -5, 105]
        ]
      },
      [EquipCache.hand_r]: {
        frames: [0, 16, 32],
        value: [
          [0, -3, 15],
          [0, -3, 16],
          [0, -3, 15]
        ]
      },
      [EquipCache.leg_l]: {
        value: [
          [-2, 28, 30]
        ]
      },
      [EquipCache.leg_r]: {
        value: [
          [3, 28, -30]
        ]
      },
      [EquipCache.weapon]: {
        frames: [0, 16, 32],
        value: [
          [20, 0, 185],
          [20, 0, 186],
          [20, 0, 185]
        ]
      },
      [EquipCache.wing]: {
        frames: [0, 16, 32],
        value: [
          [0, -1],
          [0, 0],
          [0, -1],
        ]
      }
    },
    [StateCache.go]: {
      [EquipCache.leg_l]: {
        frames: [0, 24],
        value: [
          [-1, 28, 20],
          [4, 28, -30]
        ]
      },
      [EquipCache.leg_r]: {
        frames: [0, 24],
        value: [
          [5, 28, -20],
          [-2, 28, 30]
        ]
      }
    },
    [StateCache.run]: {
      [EquipCache.leg_l]: {
        frames: [0, 15],
        value: [
          [-1, 28, 20],
          [4, 28, -30]
        ]
      },
      [EquipCache.leg_r]: {
        frames: [0, 15],
        value: [
          [5, 28, -20],
          [-2, 28, 30]
        ]
      }
    },
    [StateCache.rest]: {
      [EquipCache.leg_l]: {
        frames: [0, 10, 55, 100, 110],
        value: [
          [-5, 28, 20],
          [-5, 28, 10],
          [-5, 28, 0],
          [-5, 28, 10],
          [-5, 28, 20],
        ]
      },
      [EquipCache.body]: {
        frames: [0, 10, 55, 100, 110],
        value: [
          [-4, 11],
          [-7, 11],
          [-10, 11],
          [-7, 11],
          [-4, 11],
        ]
      },
      [EquipCache.leg_r]: {
        frames: [0, 10, 55, 100, 110],
        value: [
          [0, 28, -40],
          [-3, 28, -50],
          [-5, 28, -60],
          [-3, 28, -50],
          [0, 28, -40],
        ]
      },
      [EquipCache.hand_l]: {
        frames: [0, 10, 55, 100, 110],
        value: [
          [-3, -5, 105],
          [-6, -5, 105],
          [-9, -5, 105],
          [-6, -5, 105],
          [-3, -5, 105],
        ]
      },
      [EquipCache.hand_r]: {
        frames: [0, 10, 55, 100, 110],
        value: [
          [-4, -3, 19],
          [-7, -3, 20],
          [-10, -3, 21],
          [-7, -3, 20],
          [-4, -3, 19],
        ]
      },
      [EquipCache.weapon]: {
        frames: [0, 100, 110],
        value: [
          [19, 0, 185 + 12 * 1],
          [10, 5, 185 + 12 * 130],
          [10, 5, 185 + 12 * 130],
        ]
      },
      [EquipCache.head]: {
        frames: [0, 10, 55, 100, 110],
        value: [
          [-1, -20],
          [-4, -19],
          [-6, -19],
          [-4, -19],
          [-1, -20],
        ]
      }
    },
    [StateCache.beHitBehind]: {
      [EquipCache.hand_r]: {
        value: [[0, -3, 65]]
      },
      [EquipCache.weapon]: {
        value: [[11, 20, -60]]
      },
      [EquipCache.head]: {
        value: [[2, -20, -10]]
      },
      [EquipCache.leg_r]: {
        value: [[3, 28, -15]]
      }
    }
  }),
  uraSkill: 0,
  hitGraph() {
    return Bodies.rectangle(0, 0, 40, 80, {
      isSensor: true
    });
  }
}