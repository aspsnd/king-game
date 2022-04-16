import { Bodies } from "matter-js";
import { MonstProto } from "../../../core/chain/monst/Proto";
import { CommonDropSpeed, CommonJumpSpeed } from "../../../core/chain/vita/Proto";
import { StateCache } from "../../../core/controller/state/StateCache";
import { BodyCache } from "../../../core/equip/BodyCache";

export const MonstProto0: MonstProto = {
  index: 0,
  attr: {
    hp: 50,
    mp: 50,
    atk: 8,
    def: 0,
    crt: 0,
    dod: 0,
    hpr: 0,
    mpr: 0,
    speed: 1.2,
    spd: 1,
    ats: 1,
    timeSpeed: 1,
    timeSlot: 0
  },
  name: "斧头兵",
  level: 1,
  group: 2,
  skills: [],
  talents: [],
  talentStars: 0,
  height: 30,
  defaultBody: {
    [BodyCache.body]: {
      texture: 'assets/monst/0/2.png',
      anchor: [.5, .5]
    },
    [BodyCache.weapon]: {
      texture: 'assets/monst/0/7.png',
      anchor: [0.58, 0.163]
    }
  },
  actions: {
    [StateCache.common]: {
      [BodyCache.body]: {
        value: [
          [2, 0]
        ]
      },
      [BodyCache.weapon]: {
        frames: [0, 16, 32],
        value: [
          [0, -7, 185],
          [0, -7, 186],
          [0, -7, 185],
        ]
      }
    },
  },
  hitGraph() {
    return Bodies.circle(0, 0, 15, {
      isSensor: true
    });
  },
  maxJumpTimes: 1,
  jumpSpeedFunc: CommonJumpSpeed,
  dropSpeedFunc: CommonDropSpeed,
  restInterval: 0,
  restTime: 0,
  needRest: false,
  attack: 1
}