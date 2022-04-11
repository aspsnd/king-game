export class AnxiEvent<EventName extends string | number | symbol = string | number | symbol, D extends any[] = any>{
  intercepted = false
  data
  constructor(public name: EventName, ...data: D) {
    this.data = data;
  }
  intercept() {
    this.intercepted = true;
  }
}