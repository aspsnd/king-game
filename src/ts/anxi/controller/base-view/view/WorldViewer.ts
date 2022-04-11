import { Container } from "pixi.js"
import { World } from "../../../chain/World"
import { Controller } from "../../controller"

export class WorldViewController extends Controller<World> {
  container = new Container()
  beforeContainer = new Container()
  childContainer = new Container()
  afterContainer = new Container()
  constructor(world: World) {
    super(world);
    this.container.addChild(this.beforeContainer, this.childContainer, this.afterContainer);
  }

}