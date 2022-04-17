import { AnxiEvent } from "../../../aixi/eventer/Event";
import { Controller } from "../../../anxi/controller/controller";
import { StateItem } from "../../../anxi/controller/state/item";
import { Randomer } from "../../../random/Ramdom";
import { Affect } from "../../affect/Affect";
import { VitaAttribute } from "../../chain/vita/Attribute";
import { Vita } from "../../chain/vita/Vita";
import { StateCache } from "../state/StateCache";
import { Shield, ShieldType } from "../variable/Shield";

export class ReactionController extends Controller {

  declare belonger: Vita<VitaAttribute>

  init(): void {
    super.init();
    const { belonger } = this;
    belonger.on('preBeAffect1', e => {
      const affect = e.data[0] as Affect;

      if (!affect.dodCaculated) {
        affect.dodCaculated = true;
        if (affect.canDod) {
          affect.doded = affect.to.attribute.get('dod') > Randomer.gen();
        }
      }

      if (affect.doded) {
        this.emit(new AnxiEvent('dodaffect', affect));
        affect.from.emit(new AnxiEvent('affectdoded', affect));
        return;
      }
      if (!affect.crtCaculated) {
        affect.crtCaculated = true
        if (affect.canCrt) {
          affect.crted = Randomer.gen() < affect.from.attribute.get('crt');
        }
      };

      const def = belonger.attribute.get('def');
      const mdf = belonger.attribute.get('mdf');

      affect.reduce.physics += def >= 0 ? affect.hurt.physics * def / (def + 100) : affect.hurt.physics * def / 100;
      affect.reduce.magic += mdf >= 0 ? affect.hurt.magic * mdf / (mdf + 100) : affect.hurt.magic * mdf / 100;

      if (belonger.stateController.some(StateCache.IME.priority)) {
        affect.reduce.physics = affect.reduce.physics;
        affect.reduce.magic = affect.reduce.magic;
        affect.reduce.real = affect.reduce.real;
      }

      if (belonger.stateController.some(StateCache.URA.priority)) {
        affect.debuffs.length = 0;
      }

    });

    belonger.on('beAffect', e => {
      const affect = e.data[0] as Affect;
      // 获得盾
      if (affect.shield.physics > 0) {
        belonger.var.insertShield(new Shield(affect.shield.physics, ShieldType.physics, affect.from));
      }
      if (affect.shield.magic > 0) {
        belonger.var.insertShield(new Shield(affect.shield.magic, ShieldType.magic, affect.from));
      }
      if (affect.shield.common > 0) {
        belonger.var.insertShield(new Shield(affect.shield.common, ShieldType.common, affect.from));
      }
      // 治疗、回魔
      if (affect.recover.hp > 0) {
        belonger.var.hp += affect.recover.hp;
      }
      if (affect.recover.mp > 0) {
        belonger.var.mp += affect.recover.mp;
      }

      // 掉血掉盾
      belonger.var.recieveHurt(affect);

      // 增益状态
      for (const buff of affect.buffs) {
        if (buff.itemCreater) {
          belonger.stateController.insertStateItem(buff.state, buff.itemCreater!(affect));
        } else {
          belonger.stateController.insertStateItem(buff.state, new StateItem(buff.continue, false));
        }
      }

      // 不良状态
      for (const debuff of affect.debuffs) {
        if (debuff.itemCreater) {
          belonger.stateController.insertStateItem(debuff.state, debuff.itemCreater!(affect));
        } else {
          belonger.stateController.insertStateItem(debuff.state, new StateItem(debuff.continue, false));
        }
      }
    })
  }
}