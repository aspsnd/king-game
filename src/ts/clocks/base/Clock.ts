import { AnxiEvent } from "../../aixi/eventer/Event";
import { AnxiEventer, AnxiPlainHandler, BEN } from "../../aixi/eventer/Eventer";
import { Ticker } from "./Ticker";

export class Clock extends AnxiEventer {

  time = 0;

  injectInTicker(ticker: Ticker) {
    ticker.add(this.update);
    return this;
  }

  destroyFromTicker(ticker: Ticker) {
    ticker.remove(this.update);
    return this;
  }

  update = () => {
    this.time++;
    this.emit(new AnxiEvent('time'));
    this.emit(new AnxiEvent(`time_${this.time}`));
  }

  nextTick(func: AnxiPlainHandler<BEN>) {
    return this.addEventListener(`time_${this.time++}`, func);
  }

  wait(time: number, func: AnxiPlainHandler<BEN>) {
    return this.addEventListener(`time_${this.time + time}`, func);
  }

  onTime(func: AnxiPlainHandler<BEN>) {
    return this.addEventListener('time', func);
  }

}