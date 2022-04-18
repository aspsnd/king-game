import type { RoleProto } from "../../../core/chain/role/Proto";
import { Bodies } from "matter-js";
import { ActionData } from "../../../anxi/controller/view/action";
import { StateCache } from "../../../core/controller/state/StateCache";
import { BodyCache } from "../../../core/equip/BodyCache";
import { CommonDropSpeed, CommonJumpSpeed } from "../../../core/chain/vita/Proto";
import { Matrix } from "pixi.js";

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
    mgc: 0,
    mdf: 0,
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
  height: 80,
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
    [BodyCache.head]: {
      texture: 'static/role/0/1.png',
      anchor: [0.45, 0.74],
    },
    [BodyCache.body]: {
      texture: 'static/role/0/2.png',
      anchor: [.5, .5]
    },
    [BodyCache.hand_l]: {
      texture: 'static/role/0/3.png',
      anchor: [1 / 6, 0.5],
    },
    [BodyCache.hand_r]: {
      texture: 'static/role/0/4.png',
      anchor: [1 / 6, 0.5],
    },
    [BodyCache.leg_l]: {
      texture: 'static/role/0/5.png',
      anchor: [0.5, 0],
    },
    [BodyCache.leg_r]: {
      texture: 'static/role/0/6.png',
      anchor: [0.5, 0],
    },
    [BodyCache.weapon]: {
      texture: 'static/role/0/7.png',
      anchor: [2 / 3, 1 / 6],
    },
  },
  actions: new ActionData({
    [StateCache.common]: {
      [BodyCache.body]: {
        value: [
          [-1, 11]
        ]
      },
      [BodyCache.head]: {
        frames: [0, 16, 32],
        value: [
          [2, -20],
          [2, -19],
          [2, -20]
        ]
      },
      [BodyCache.hand_l]: {
        frames: [0, -24, 32],
        value: [
          [0, -5, 105],
          [0, -5, 104],
          [0, -5, 105]
        ]
      },
      [BodyCache.hand_r]: {
        frames: [0, 16, 32],
        value: [
          [0, -3, 15],
          [0, -3, 16],
          [0, -3, 15]
        ]
      },
      [BodyCache.leg_l]: {
        value: [
          [-2, 28, 30]
        ]
      },
      [BodyCache.leg_r]: {
        value: [
          [3, 28, -30]
        ]
      },
      [BodyCache.weapon]: {
        frames: [0, 16, 32],
        value: [
          [20, 0, 185],
          [20, 0, 186],
          [20, 0, 185]
        ]
      },
      [BodyCache.wing]: {
        frames: [0, 16, 32],
        value: [
          [0, -1],
          [0, 0],
          [0, -1],
        ]
      }
    },
    [StateCache.go]: {
      [BodyCache.leg_l]: {
        frames: [0, 24],
        value: [
          [-1, 28, 20],
          [4, 28, -30]
        ]
      },
      [BodyCache.leg_r]: {
        frames: [0, 24],
        value: [
          [5, 28, -20],
          [-2, 28, 30]
        ]
      }
    },
    [StateCache.run]: {
      [BodyCache.leg_l]: {
        frames: [0, 15],
        value: [
          [-1, 28, 20],
          [4, 28, -30]
        ]
      },
      [BodyCache.leg_r]: {
        frames: [0, 15],
        value: [
          [5, 28, -20],
          [-2, 28, 30]
        ]
      }
    },
    [StateCache.rest]: {
      [BodyCache.leg_l]: {
        frames: [0, 10, 55, 100, 110],
        value: [
          [-2, 28, 30],
          [-8, 28, 10],
          [-8, 28, 0],
          [-8, 28, 10],
          [-2, 28, 30],
        ]
      },
      [BodyCache.body]: {
        frames: [0, 10, 55, 100, 110],
        value: [
          [-1, 11],
          [-7, 11],
          [-10, 11],
          [-7, 11],
          [-1, 11],
        ]
      },
      [BodyCache.leg_r]: {
        frames: [0, 10, 55, 100, 110],
        value: [
          [3, 28, -30],
          [-3, 28, -50],
          [-5, 28, -60],
          [-3, 28, -50],
          [3, 28, -30],
        ]
      },
      [BodyCache.hand_l]: {
        frames: [0, 10, 55, 100, 110],
        value: [
          [0, -5, 105],
          [-6, -5, 105],
          [-9, -5, 105],
          [-6, -5, 105],
          [0, -5, 105],
        ]
      },
      [BodyCache.hand_r]: {
        frames: [0, 10, 55, 100, 110],
        value: [
          [0, -3, 15],
          [-7, -3, 20],
          [-10, -3, 21],
          [-7, -3, 20],
          [0, -3, 15],
        ]
      },
      [BodyCache.weapon]: {
        frames: [0, 10, 100, 110],
        value: [
          [20, 5, 185 + 12 * 0],
          [14, 5, 185 + 12 * 11],
          [14, 5, 185 + 12 * 111],
          [20, 5, 185 + 12 * 120],
        ]
      },
      [BodyCache.head]: {
        frames: [0, 10, 55, 100, 110],
        value: [
          [2, -20],
          [-4, -19],
          [-6, -19],
          [-4, -19],
          [2, -20],
        ]
      }
    },
    [StateCache.beHitBehind.priority]: {
      [BodyCache.leg_l]: {
        value: [[-5, 28, -8]]
      },
      [BodyCache.leg_r]: {
        value: [[0, 28, -35]]
      },
      [BodyCache.body]: {
        value: [[-6, 11, -5]]
      },
      [BodyCache.hand_r]: {
        value: [[-5, 0, 65]]
      },
      [BodyCache.hand_l]: {
        value: [[-5, -2, 105]]
      },
      [BodyCache.weapon]: {
        value: [[4, 16, -160]]
      },
      [BodyCache.head]: {
        value: [[-2, -18, 0]]
      }
    },
    [StateCache.dead]: {
      [BodyCache.body]: {
        frames: [0, 30],
        frameSelector(time: number) {
          return Math.min(time, 29);
        },
        value: [
          [-1, 11, 0],
          [8, 11, 30],
        ]
      },
      [BodyCache.head]: {
        frames: [0, 30],
        frameSelector(time: number) {
          return Math.min(time, 29);
        },
        value: [
          [2, -20],
          [28, -12, 30],
        ]
      },
      [BodyCache.hand_l]: {
        frames: [0, 30],
        frameSelector(time: number) {
          return Math.min(time, 29);
        },
        value: [
          [0, -5, 105],
          [20, -2, 90]
        ]
      },
      [BodyCache.hand_r]: {
        frames: [0, 30],
        frameSelector(time: number) {
          return Math.min(time, 29);
        },
        value: [
          [0, -3, 15],
          [20, 0, 0]
        ]
      },
      [BodyCache.weapon]: {
        frames: [0, 15, 30],
        frameSelector(time: number) {
          return Math.min(time, 29);
        },
        value: [
          [20, 0, 185],
          [28, -150, 452],
          [36, 0, 720]
        ]
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