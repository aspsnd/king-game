import { AnxiEvent } from "../../../aixi/eventer/Event";
import { AnxiPlainListener, BEN } from "../../../aixi/eventer/Eventer";
import { Controller } from "../../../anxi/controller/controller";
import { GlobalDowning, GlobalEventCaster } from "../../../util/GlobalCatster";
import { VitaAttribute } from "../../chain/vita/Attribute";
import { Vita } from "../../chain/vita/Vita";
import { Instructs } from "./const";

export const DefaultPlayer1Keys = 'wsadjkyuiol h'.split('');

export const DefaultPlayer2Keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', '1', '2', '8', '4', '5', '6', '3', '0', '7'];

export class InstructEmitter extends Controller {

  declare belonger: Vita<VitaAttribute>

  constructor(vita: Vita<VitaAttribute>, readonly keys: string[]) {
    super(vita, true);
  }

  listeners: AnxiPlainListener<BEN>[] = []

  init(): void {
    super.init();

    const { belonger, keys } = this;

    const { } = belonger;

    const listener1 = GlobalEventCaster.on('realkeydown', e => {
      if (belonger.dead) return true;
      if (!belonger.world?.running) return;

      const key = e.data[0].key as string;

      const index = keys.indexOf(key);

      switch (index) {
        case 2: belonger.emit(new AnxiEvent(Instructs.wantleft)); break;
        case 3: belonger.emit(new AnxiEvent(Instructs.wantright)); break;
        case 4: belonger.emit(new AnxiEvent(Instructs.wantattack)); break;
        case 5: belonger.emit(new AnxiEvent(GlobalDowning[keys[1]] ? Instructs.wantdown : Instructs.wantjump)); break;
        case 6: belonger.emit(new AnxiEvent(Instructs.wantskill, 0)); break;
        case 7: belonger.emit(new AnxiEvent(Instructs.wantskill, 1)); break;
        case 8: belonger.emit(new AnxiEvent(Instructs.wantskill, 2)); break;
        case 9: belonger.emit(new AnxiEvent(Instructs.wantskill, 3)); break;
        case 10: belonger.emit(new AnxiEvent(Instructs.wantskill, 4)); break;
        case 11: belonger.emit(new AnxiEvent(Instructs.wantura, 1)); break;
        case 12: belonger.emit(new AnxiEvent(Instructs.wantskill, /* 法宝技能 */9)); break;
      }
    })
    this.listeners.push(listener1);

    const listener2 = GlobalEventCaster.on('keyup', e => {
      if (belonger.dead) return true;
      if (!belonger.world?.running) return;

      const key = e.data[0].key as string;

      const index = keys.indexOf(key);

      switch (index) {
        case 2: belonger.emit(new AnxiEvent(Instructs.cancelleft)); break;
        case 3: belonger.emit(new AnxiEvent(Instructs.cancelright)); break;
        case 6: belonger.emit(new AnxiEvent(Instructs.cancelskill, 0)); break;
        case 7: belonger.emit(new AnxiEvent(Instructs.cancelskill, 1)); break;
        case 8: belonger.emit(new AnxiEvent(Instructs.cancelskill, 2)); break;
        case 9: belonger.emit(new AnxiEvent(Instructs.cancelskill, 3)); break;
        case 10: belonger.emit(new AnxiEvent(Instructs.cancelskill, 4)); break;
        case 12: belonger.emit(new AnxiEvent(Instructs.cancelskill, /* 法宝技能 */9)); break;
      }
    })
    this.listeners.push(listener2);

  }

  destroy(): void {
    super.destroy();
    for (const listener of this.listeners) {
      GlobalEventCaster.removeListener(listener);
    }
  }
}