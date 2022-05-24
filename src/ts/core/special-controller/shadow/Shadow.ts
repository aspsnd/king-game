import { upgradeConfig } from "@pixi/particle-emitter";
import { Bodies, Body } from "matter-js";
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

  /**
   * @param vita 剑气追向主人
   * @param num 本次剑气总量
   */
  follow(vita: Vita<VitaAttribute>, num: number) {
    this.state = ShadowState.weapon;
    const physics = new PhysicsController<true>(this, {
      isBody: true,
      body: Bodies.rectangle(this.x, this.y, 100, 30, {
        isSensor: true,
        collisionFilter: {
          group: -2,
          mask: 0b11000000,
          category: 0b00010000
        }
      })
    });
    const startTime = this.time;
    const returnTime = 45;
    const shootedVitas: Vita<VitaAttribute>[] = [];
    this.on('time', () => {
      const now = this.time - startTime;
      if (now > 45) {
        this.destroy();
        return true;
      }
      const lastTime = 45 - now;
      const rate = 0.5 - lastTime / returnTime * 0.5;
      if (lastTime < 20) {
        this.sprite.alpha = lastTime * 0.05;
      }
      const vita_x = vita.x;
      const vita_y = vita.y;
      this.x += (vita.x - this.x) * rate;
      this.y += (vita.y - this.y) * rate;
      const rotation = this.sprite.rotation = this.y < vita_y ? -Math.atan((this.x - vita_x) / (this.y - vita_y)) : Math.PI - Math.atan((this.x - vita_x) / (this.y - vita_y));
      Body.setAngle(physics.box, rotation - Math.PI * .5);
    });
    physics.on('collisionStart', e => {
      const enemy = e.data[0].belonger as Vita<VitaAttribute>;
      if (enemy.group === this.belonger.group) return;
      if (shootedVitas.includes(enemy)) return;
      shootedVitas.push(enemy);
      const affect = new Affect(this.belonger, enemy);
      affect.hurt.physics = 20 + (8 + num) * 0.1 * enemy.attribute.get('atk');
      affect.debuffs.push({
        state: StateCache.beHitBehind.priority,
        continue: 15
      });
      affect.emit();
    });
    this.sprite.texture = directStatic('role/0/shadow/2.png');
  }

  sprite: Sprite
  constructor(readonly belonger: Vita<VitaAttribute>, scaleX = 1) {
    super();
    const sprite = this.sprite = new Sprite(directStatic('role/0/shadow/1.png'));
    sprite.anchor.set(.5, .5);
    sprite.scale.x = scaleX;
    this.view = new ConstViewer(this, sprite);
  }
}