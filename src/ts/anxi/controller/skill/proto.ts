import { AttributeCaculator } from "../attribute/attribute";
import { AnxiEvent } from "../../../aixi/eventer/Event";
import { Skill } from "./skill";
import { Quark } from "../../chain/Quark";
import { Controller } from "../controller";

export interface HandlerGetter<D, T> {
  (quark: Quark, skill: Skill<D, T>): (e: AnxiEvent) => void
}

export class SkillProto<T extends {} = { intro: string }, D extends {} = {}>{

  constructor(readonly index: number, readonly name: string, readonly extra?: T) { }

  _init: ((this: Skill<D>, data: D) => void) = () => { }

  init(_init: (this: Skill<D>, data: D) => void) {
    this._init = _init;
    return this;
  }

  executer: ((this: Skill<D>, ...args: any[]) => void) = () => { }
  execute(executer: (this: Skill<D>, ...args: any[]) => void) {
    this.executer = executer;
    return this;
  }

  canceler: ((this: Skill<D>, ...args: any[]) => void) = () => { }
  cancel(canceler: (this: Skill<D>, ...args: any[]) => void) {
    this.canceler = canceler;
    return this;
  }

  _active = false
  active(bool: boolean = true) {
    this._active = bool;
    return this;
  }


  initedAttrs: {
    [attr: string]: {
      rely: string[],
      caculator: AttributeCaculator,
      annoy: boolean
    }
  } = {}
  initAttr(prop: string, rely: string[], caculator: AttributeCaculator, annoy = false) {
    this.initedAttrs[prop] = {
      rely,
      caculator,
      annoy
    };
    return this;
  }

  exeHelper: ((this: Skill<D>) => boolean) = () => true
  canExecute(helper: ((this: Skill<D>) => boolean)) {
    this.exeHelper = helper;
    return this;
  }

  waitTime = 0
  wait(time: number) {
    this.waitTime = time;
    return this;
  }

  initedListens: {
    event: string,
    handler: HandlerGetter<D, T>
  }[] = []
  initListen(en: string, handlerGetter: HandlerGetter<D, T>) {
    this.initedListens.push({
      event: en,
      handler: handlerGetter
    })
    return this;
  }

  datar: (this: Skill<D, T>) => D = () => ({} as D)
  initData(datar: (this: Skill<D, T>) => D) {
    this.datar = datar;
    return this;
  }

  extraControllers: (new (quark: Quark) => Controller)[] = []
  useExtraController(construct: new (quark: Quark) => Controller) {
    this.extraControllers.push(construct);
    return this;
  }

}