import { Emitter, EmitterConfigV3 } from "@pixi/particle-emitter";
import { Quark } from "../../chain/Quark";
import { ViewController } from "../base-view/view";

export interface ParticleViewerOptions extends EmitterConfigV3 {

}
export class ParticleViewer extends ViewController {

  insertAction(_action: unknown): never {
    throw new Error("Method not implemented.");
  }
  removeAction(_index: number): never {
    throw new Error("Method not implemented.");
  }
  readonly emitter: Emitter
  constructor(public quark: Quark, config: ParticleViewerOptions) {
    super(quark, true);
    this.emitter = new Emitter(this.container, config);
    this.emitter.emit = true;
    this.init();
  }
  private _lastTime = 0
  onRender(_: number): void {
    const delta = this.belonger.time - this._lastTime;
    this._lastTime = this.belonger.time;
    this.container.x = this.belonger!.x;
    this.container.y = this.belonger!.y;
    this.emitter.update(delta / 60);
  }
  private _x = 0
  /**
   * set emitter position for better behavior.
   */
  set x(v: number) {
    this._x = v;
    this.emitter.updateOwnerPos(v, this._y);
  }
  get x() {
    return this._x;
  }
  private _y = 0
  /**
   * set emitter position for better behavior.
   */
  set y(v: number) {
    this._y = v;
    this.emitter.updateOwnerPos(this._x, v);
  }
  get y() {
    return this._y;
  }
}