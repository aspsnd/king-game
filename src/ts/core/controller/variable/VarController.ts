import { AnxiEvent } from "../../../aixi/eventer/Event";
import { Controller } from "../../../anxi/controller/controller";
import { Affect } from "../../affect/Affect";
import { VitaAttribute } from "../../chain/vita/Attribute";
import { Vita } from "../../chain/vita/Vita";
import { Shield, ShieldType } from "./Shield";

export class VarController extends Controller {

  private _hp: number

  get hp() {
    return this._hp;
  }

  set hp(v: number) {
    const oldV = this._hp;
    const newV = Math.max(0, v);
    this._hp = newV;
    this.belonger.emit(new AnxiEvent('hpchange', oldV, newV));
  }

  private _mp: number

  get mp() {
    return this._mp;
  }

  set mp(v: number) {
    const oldV = this._mp;
    const newV = Math.max(0, v);
    this._mp = newV;
    this.belonger.emit(new AnxiEvent('mpchange', oldV, newV));
  }

  shields: Shield[] = []

  constructor(vita: Vita<VitaAttribute>) {
    super(vita);
    this._hp = vita.attribute.get('hp');
    this._mp = vita.attribute.get('mp');
  }

  insertShield(shield: Shield) {
    this.shields.push(shield);
  }

  recieveHurt(affect: Affect) {
    let physics = affect.hurt.physics - affect.reduce.physics;
    let magic = affect.hurt.magic - affect.reduce.magic;
    let real = affect.hurt.real - affect.hurt.real;

    for (const shield of this.shields) {
      switch (shield.type) {
        case ShieldType.physics: {
          let cost = Math.min(physics, shield.left);
          shield.left -= cost;
          physics -= cost;
          break;
        }
        case ShieldType.magic: {
          let cost = Math.min(magic, shield.left);
          shield.left -= cost;
          magic -= cost;
          break;
        }
        case ShieldType.common: {
          let cost1 = Math.min(real, shield.left);
          shield.left -= cost1;
          real -= cost1;

          let cost2 = Math.min(magic, shield.left);
          shield.left -= cost2;
          magic -= cost2;

          let cost3 = Math.min(physics, shield.left);
          shield.left -= cost3;
          physics -= cost3;

          break;

        }
      }
    }

    this.refreshShields();

    const needReducedHp = physics + magic + real;

    this.hp -= needReducedHp;

  }

  refreshShields() {
    this.shields = this.shields.filter(s => s.left > 0);
  }

}