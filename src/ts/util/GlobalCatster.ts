import { AnxiEvent } from "../aixi/eventer/Event";
import { AnxiEventer } from "../aixi/eventer/Eventer";

export const GlobalEventCaster = new AnxiEventer();
export const GlobalDowning: Record<string, boolean> = {};

document.addEventListener('keydown', e => {
  GlobalEventCaster.emit(new AnxiEvent('keydown', e, GlobalDowning[e.key]));
  if (GlobalDowning[e.key]) {
    GlobalEventCaster.emit(new AnxiEvent(`dckey_${e.key.toLowerCase()}`, e));
  } else {
    GlobalDowning[e.key] = true;
    GlobalEventCaster.emit(new AnxiEvent('realkeydown', e, GlobalDowning[e.key]));
    GlobalEventCaster.emit(new AnxiEvent(`dkey_${e.key.toLowerCase()}`, e));
  }
})
document.addEventListener('keyup', e => {
  GlobalDowning[e.key] = false;
  GlobalEventCaster.emit(new AnxiEvent('keyup', e));
  GlobalEventCaster.emit(new AnxiEvent(`ukey_${e.key.toLowerCase()}`, e));
})