import { Attack } from "../../../../core/attack/Attack";
import { Vita } from "../../../../core/chain/vita/Vita";
import { Flyer, FlyerOptions } from "../../../../core/flyer/Flyer";
import { AttackProto, AttackType } from "../attacks/Proto";

export class CommonAttack {

  finished = false

  constructor(readonly proto: AttackProto, readonly from: Vita<any>, readonly attack: Attack, readonly needed: number) {

  }

  emit() {
    const { from, attack, proto, needed } = this;

    const now = from.time;
    const createTime = Math.max((needed * proto.checkTimes[0]) | 0, 1);

    const dieTime = Math.max((needed * proto.checkTimes[1]) | 0, 1);

    const liveTime = dieTime - createTime;

    const body = proto.getHitBody(from);

    body.collisionFilter.group = -2;
    body.collisionFilter.category = 0b00010000;
    body.collisionFilter.mask = 0b11000000;

    const flyerConfig: FlyerOptions = {
      body,
      speedMode: 'const',
      speed: [0, 0],
      angleMode: 'const',
      angle: 0,
      affectGetter(to) {
        return attack.generateAffect(to);
      },
      checker(vita) {
        return vita.group !== from.group;
      },
      liveTime,
      moilTime: 0,
      dieAfterHit: false
    };

    switch (proto.type) {
      case AttackType.sword: {
        flyerConfig.speedMode = 'position';
        flyerConfig.positionGetter = (_time: number) => {
          return [from.x + (proto.flyerOffset[0] * from.face), from.y + proto.flyerOffset[1]];
        }
        break;
      }
      case AttackType.arrow: {

        break;
      }
    }

    from.once(`time_${now + createTime}`, () => {
      const flyer = new Flyer(flyerConfig);
      flyer.x = from.x;
      flyer.y = from.y;
      flyer.onTime(0);
      flyer.land(from.world!);
    });


  }

}