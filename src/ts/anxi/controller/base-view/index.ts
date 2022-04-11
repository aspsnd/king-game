import { AbstractRenderer, autoDetectRenderer, IRendererOptions } from "pixi.js";
import { World } from "../../chain/World";
import { WorldViewController } from "./view/WorldViewer";

export interface RendererOptions extends IRendererOptions {

}

/**
 * 该组件应当加到根World节点
 */
export class RendererViewController extends WorldViewController {
  renderer: AbstractRenderer
  constructor(world: World, public options: RendererOptions) {
    super(world);
    this.renderer = autoDetectRenderer(options);
  }
  onFrame() {
    this.belonger.on('frame');
    this.renderer.render(this.container);
  }
}