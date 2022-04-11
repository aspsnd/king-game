import { AnxiEvent } from "../aixi/eventer/Event";
import { AnxiEventer } from "../aixi/eventer/Eventer";

export const GlobalEventCaster = new AnxiEventer();
export const GlobalDowning: Record<string, boolean> = {};

document.addEventListener('keydown', e => {
  GlobalEventCaster.on(new AnxiEvent('keydown', e, GlobalDowning[e.key]));
  if (GlobalDowning[e.key]) {
    GlobalEventCaster.on(new AnxiEvent(`dckey_${e.key.toLowerCase()}`, e));
  } else {
    GlobalDowning[e.key] = true;
    GlobalEventCaster.on(new AnxiEvent('realkeydown', e, GlobalDowning[e.key]));
    GlobalEventCaster.on(new AnxiEvent(`dkey_${e.key.toLowerCase()}`, e));
  }
})
document.addEventListener('keyup', e => {
  GlobalDowning[e.key] = false;
  GlobalEventCaster.on(new AnxiEvent('keyup', e));
  GlobalEventCaster.on(new AnxiEvent(`ukey_${e.key.toLowerCase()}`, e));
})