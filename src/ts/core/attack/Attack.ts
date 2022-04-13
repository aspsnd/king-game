import { AnxiEvent } from "../../aixi/eventer/Event"
import { AttackProto } from "../../data/skill/data/attacks/Proto"
import { Randomer } from "../../random/Ramdom"
import { Affect } from "../affect/Affect"
import { Vita } from "../chain/vita/Vita"


export class Attack {

  crted: boolean

  hurt = {
    physics: 0,
    magic: 0,
    real: 0
  }

  debuffs: Array<{
    state: number,
    continue: number
  }> = []

  constructor(readonly proto: AttackProto, readonly from: Vita<any>) {
    this.hurt.physics = from.attribute.get('atk');
    for (const debuff of proto.debuff) {
      this.debuffs.push({
        ...debuff
      });
    }
    this.crted = Randomer.gen() < from.attribute.get('crt');
    from.emit(new AnxiEvent('createAttack', this));
  }

  generateAffect(to: Vita<any>) {
    const affect = new Affect(this.from, to);
    affect.hurt.physics = this.hurt.physics;
    affect.hurt.magic = this.hurt.magic;
    affect.hurt.real = this.hurt.real;
    affect.debuffs = this.debuffs.map(v => ({ ...v }));
    affect.crtCaculated = true;
    affect.crted = this.crted;
    return affect;
  }


}