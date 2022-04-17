import { AnxiEventer } from "../../../ts/aixi/eventer/Eventer";

/**
 * 缓存实现Class， 该类的实例默认生命周期为永久，不会被垃圾回收
 * 
 */
export class Storager extends AnxiEventer {
  constructor(public name: string) {
    super();
  }
  save() {
    throw Error('The class Storage is not implement!');
  }
}