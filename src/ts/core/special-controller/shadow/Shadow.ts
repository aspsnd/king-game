import { upgradeConfig } from "@pixi/particle-emitter";
import { Bodies } from "matter-js";
import { Sprite } from "pixi.js";
import { Quark } from "../../../anxi/chain/Quark";
import { ConstViewer } from "../../../anxi/controller/view-const";
import { ParticleViewer } from "../../../anxi/controller/view-partical";
import { PhysicsController } from "../../../anxi/physics/atom";
import { directStatic } from "../../../util/texture";
import { ValueOf } from "../../../util/types";
import { Affect } from "../../affect/Affect";
import { VitaAttribute } from "../../chain/vita/Attribute";
import { Vita } from "../../chain/vita/Vita";
import { StateCache } from "../../controller/state/StateCache";
import config from "./boom.json";

export const ShadowState = {
  common: 0,
  booming: 1,
  weapon: 2
} as const;
export type ShadowState = ValueOf<typeof ShadowState>;

export class Shadow extends Quark {
  state: ShadowState = ShadowState.common
  view: ConstViewer<Sprite>;

  boom() {
    this.state = ShadowState.booming;
    const physics = new PhysicsController<true>(this, {
      isBody: true,
      body: Bodies.circle(this.x, this.y, 60, {
        isSensor: true,
        collisionFilter: {
          group: -2,
          mask: 0b11000000,
          category: 0b00010000
        }
      })
    });
    physics.on('collisionStart', e => {
      const vita = e.data[0].belonger as Vita<VitaAttribute>;
      if (vita.group === this.belonger.group) return;
      const affect = new Affect(this.belonger, vita);
      affect.hurt.physics = 50 + this.belonger.level * 8 + this.belonger.attribute.get('atk') * 0.8;
      affect.debuffs.push({
        state: StateCache.beHitBehind.priority,
        continue: 15
      });
      affect.emit();
    });
    this.view.destroy();
    const view = new ParticleViewer(this, upgradeConfig(config, [directStatic('role/0/shadow/1.png')]));
    this.once(`time_${this.time + 3}`, () => {
      view.emitter.emit = false;
    })
    this.once(`time_${this.time + 10}`, () => {
      this.destroy();
    })
  }

  follow(vita: Vita<VitaAttribute>) {
    this.state = ShadowState.weapon;

  }

  constructor(readonly belonger: Vita<VitaAttribute>, scaleX = 1) {
    super();
    const sprite = new Sprite(directStatic('role/0/shadow/1.png'));
    sprite.anchor.set(.5, .5);
    sprite.scale.x = scaleX;
    this.view = new ConstViewer(this, sprite);
  }
}