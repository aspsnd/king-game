import { Graphics } from "pixi.js";
import { ConstViewer } from "../../../../anxi/controller/view-const";
import { Affect } from "../../../affect/Affect";
import { VitaAttribute } from "../../vita/Attribute";
import { Vita } from "../../vita/Vita";

export class HpBarController extends ConstViewer<Graphics> {

  declare belonger: Vita<VitaAttribute>

  constructor(vita: Vita<VitaAttribute>) {
    const graphics = new Graphics();
    super(vita, graphics);
    graphics.lineStyle(1, 0, 0.25).drawRect(0, 0, 50, 4);
    graphics.x = -25;
    graphics.y = -((vita.proto.displayHeight ?? vita.proto.height) >> 1) - 20;

    const bar = new Graphics();
    bar.beginFill(0xff0000).drawRect(1, 1, 48, 2).endFill();
    graphics.addChild(bar);

    this.eventer.on('beAffect', e => {
      const affect = e.data[0] as Affect;
      if (affect.finalHurt > 0 || affect.positive) {
        this.show(120);
      }
    });
    this.eventer.on('hpchange', () => {
      bar.scale.x = vita.var.hp / vita.attribute.get('hp');
    })
    bar.scale.x = vita.var.hp / vita.attribute.get('hp');
  }

  showUntil = 0

  show(time: number) {
    this.showUntil = Math.max(this.showUntil, this.belonger.time + time);
  }

  onTime(delta: number): void {
    super.onTime(delta);
    const showing = this.showUntil > this.belonger.time;
    if (showing) {
      this.container.visible = true;
    } else {
      this.container.visible = false;
    }
  }
}