import { AnxiEvent } from "../../aixi/eventer/Event";
import { AnxiPlainListener, BEN } from "../../aixi/eventer/Eventer";
import { Controller } from "../../anxi/controller/controller";
import { GlobalDowning, GlobalEventCaster } from "../../util/globalcatster";
import { VitaAttribute } from "../chain/vita/Attribute";
import { Vita } from "../chain/vita/Vita";
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
      if (belonger.dead || !belonger?.world?.running) return true;

      const key = e.data[0].key as string;

      const index = keys.indexOf(key);

      switch (index) {
        case 2: belonger.emit(new AnxiEvent(Instructs.wantleft)); break;
        case 3: belonger.emit(new AnxiEvent(Instructs.wantright)); break;
        case 5: belonger.emit(new AnxiEvent(GlobalDowning[keys[1]] ? Instructs.wantdown : Instructs.wantjump)); break;
      }
    })
    this.listeners.push(listener1);

    const listener2 = GlobalEventCaster.on('keyup', e => {
      if (belonger.dead || !belonger?.world?.running) return true;

      const key = e.data[0].key as string;

      const index = keys.indexOf(key);

      switch (index) {
        case 2: belonger.emit(new AnxiEvent(Instructs.cancelleft)); break;
        case 3: belonger.emit(new AnxiEvent(Instructs.cancelright)); break;
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