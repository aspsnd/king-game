import { AnxiEvent } from "../../../aixi/eventer/Event";
import { Controller } from "../../../anxi/controller/controller";
import { Role } from "../../chain/role/Role";

export class LevelController extends Controller {

  declare belonger: Role;

  private _exp: number;

  get exp() {
    return this._exp;
  }

  getExp(v: number) {
    this._exp += v;
    this.belonger.emit(new AnxiEvent('getexp'));
    if (this._exp >= this.fexp) {
      this.checkLevelUp();
    }
  }

  reduceExp(v: number) {
    this._exp -= v;
    this.belonger.emit(new AnxiEvent('reduceexp'));
  }

  fexp: number;
  constructor(role: Role) {
    super(role);
    this._exp = role.savedRole.exp;
    this.fexp = role.proto.fexpGetter(role.level);
    if (this._exp >= this.fexp) {
      this.checkLevelUp();
    }
  }

  checkLevelUp() {
    const { belonger } = this;
    const { attribute } = belonger;
    while (this._exp >= this.fexp) {
      this.reduceExp(this.fexp);
      const grouth = belonger.proto.attrIncreaser(belonger.level + 1);

      for (const key in grouth) {
        belonger.attribute.block[key] += grouth[key]!;
      }

      attribute.needCompute = true;
      attribute.compute();

      belonger.var.hp = belonger.attribute.get('hp');
      belonger.var.mp = belonger.attribute.get('mp');
      belonger.level = belonger.level + 1;
      this.fexp = belonger.proto.fexpGetter(belonger.level);
      belonger.emit(new AnxiEvent('levelup'));

    }
  }

}