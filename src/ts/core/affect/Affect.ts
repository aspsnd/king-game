import { AnxiEvent } from "../../aixi/eventer/Event";
import { StateItem } from "../../anxi/controller/state/item";
import { Vita } from "../chain/vita/Vita";

export class Affect {

  canCrt: boolean = false

  crtInc: number = 1

  canDod: boolean = false

  shield = {
    physics: 0,
    magic: 0,
    common: 0
  }

  recover = {
    hp: 0,
    mp: 0
  }

  hurt = {
    physics: 0,
    magic: 0,
    real: 0
  }

  reduce = {
    physics: 0,
    magic: 0,
    real: 0
  }

  finalHurt = 0

  buffs: Array<{
    state: number,
    continue: number,
    itemCreater?(affect: Affect): StateItem
  }> = []

  debuffs: Array<{
    state: number,
    continue: number,
    itemCreater?(affect: Affect): StateItem
  }> = []

  positive = false

  constructor(readonly from: Vita<any>, readonly to: Vita<any>) { }

  crted = false

  crtCaculated = false

  doded = false

  dodCaculated = false

  emit() {

    // 预添加额外效果，给技能注入
    this.from.emit(new AnxiEvent('preAffect', this));

    // 计算特殊闪避、减免，给技能注入
    this.to.emit(new AnxiEvent('preBeAffect0', this));

    // 计算通用闪避、减伤，给Vita注入
    this.to.emit(new AnxiEvent('preBeAffect1', this));

    if (this.hurt.physics < this.reduce.physics) {
      this.reduce.physics = this.hurt.physics;
    }
    if (this.hurt.magic < this.reduce.magic) {
      this.reduce.magic = this.hurt.magic;
    }
    if (this.hurt.real < this.reduce.real) {
      this.reduce.real = this.hurt.real;
    }

    /**
     * 应掉血量
     */
    this.finalHurt = Math.round(this.hurt.physics + this.hurt.real + this.hurt.magic - this.hurt.magic - this.reduce.physics - this.reduce.real);

    // 受到效果
    if (!this.doded) {
      this.to.emit(new AnxiEvent('beAffect', this));
    }

    // 结算
    this.from.emit(new AnxiEvent('endAffect', this));

  }

}