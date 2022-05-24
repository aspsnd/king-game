import { WorldViewController } from "./WorldViewer";
import { RendererViewController } from "../index";
import { Container } from "pixi.js";
import { Controller } from "../../controller";
import { Quark } from "../../../chain/Quark";

export abstract class ViewController extends Controller {
  container = new Container()
  constructor(quark: Quark, lateInit = false) {
    super(quark, true);
    lateInit || this.init();
  }
  init() {
    super.init();
    this.changeView(!!this.belonger.world);
    this.belonger!.on('getworld', () => this.changeView(true));
    this.belonger!.on('loseworld', () => this.changeView(false));

  }
  onTime(delta: number) {
    this.onRender(delta);
  }


  changeView(add: boolean) {
    if (add) {
      const world = this.belonger.world!;
      const worldViewer = world.get(WorldViewController) || world.get(RendererViewController);
      if(!worldViewer)throw new Error("can not add ViewController on quark whose world hasn't WorldViewController.");
      worldViewer.childContainer.addChild(this.container);
      this.onRender(0);
    } else {
      this.container.parent?.removeChild(this.container);
    };
    return this._destroyed;
  }

  abstract onRender(delta: number): void
  action = undefined

  /**
   * 插入自定义的动画
   */
  abstract insertAction(_action: unknown): number
  abstract removeAction(_index: number): void
  destroy() {
    if (this._destroyed) return;
    this.container.destroy({
      children: true
    });
    super.destroy();
  }
}
