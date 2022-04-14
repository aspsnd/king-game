import { Attack } from "../../../../core/attack/Attack";
import { Vita } from "../../../../core/chain/vita/Vita";
import { Flyer } from "../../../../core/flyer/Flyer";
import { AttackProto } from "../attacks/Proto";

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

    from.once(`time_${now + createTime}`, () => {
      const flyer = new Flyer({
        body: proto.getHitBody(from),
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
      });
      flyer.x = from.x;
      flyer.y = from.y;
      flyer.land(from);
    });


  }

}