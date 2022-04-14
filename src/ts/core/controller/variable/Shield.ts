import { AnxiEvent } from "../../../aixi/eventer/Event";
import { AnxiEventer } from "../../../aixi/eventer/Eventer";
import { VitaAttribute } from "../../chain/vita/Attribute";
import { Vita } from "../../chain/vita/Vita";

export const ShieldType = {
  common: 0,
  physical: 1,
  magic: 2
} as const;

export type ShieldType = typeof ShieldType[keyof typeof ShieldType];


export class Shield extends AnxiEventer<'lost'>{
  private _left: number;
  constructor(readonly value: number, readonly type: ShieldType = ShieldType.common, readonly vita: Vita<VitaAttribute>) {
    super();
    this._left = value;
  }

  get left() {
    return this._left;
  }

  set left(v: number) {
    this._left = v;
    if (v <= 0) {
      this.emit(new AnxiEvent('lost'));
      this.destroy();
    }
  }

  destroy() {
    this.removeListeners();
  }

}