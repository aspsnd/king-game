import { Body } from "matter-js";
import { AnxiEvent } from "../../aixi/eventer/Event";
import { Quark } from "../../anxi/chain/Quark";
import { PhysicsController } from "../../anxi/physics/atom";
import { Affect } from "../affect/Affect";
import { Vita } from "../chain/vita/Vita";

export interface FlyerOptions {
  body?: Body
  speedMode: 'const' | 'getter' | 'position'
  speed?: [number, number]
  speedGetter?(time: number): [number, number]
  positionGetter?(time: number): [number, number]

  angleMode: 'const' | 'getter'
  angle?: number
  angleGetter?(time: number): number

  checker?(vitas: Vita<any>): boolean

  affectGetter?(target: Vita<any>): Affect

  dieAfterHit?: boolean

  liveTime: number

  moilTime?: number

}

/**
 * 用于检测普通攻击/技能的碰撞
 */
export class Flyer extends Quark {

  static ID = 0

  id = Flyer.ID++

  physics?: PhysicsController<true>;

  dead = false

  deadTime = 0

  hitedVitas: Vita<any>[] = []

  constructor(readonly options: FlyerOptions) {
    super();

    if (options.body) {
      const physics = this.physics = new PhysicsController(this, {
        isBody: true,
        body: options.body
      });

      if (options.angleMode === 'const') {
        Body.setAngle(physics.box, options.angle!);
      }

      physics.on('collisionStart', e => {
        const physics2 = e.data[0] as PhysicsController<true>;
        const vita = physics2.belonger as Vita<any>;

        if (this.hitedVitas.includes(vita)) return;
        if (!options.checker?.(vita)) return;

        this.hitedVitas.push(vita);

        this.emit(new AnxiEvent('hittarget', vita));

        if (options.affectGetter) {

          const affect = options.affectGetter(vita);
          affect.emit();

        }

        if (options.dieAfterHit) {
          this.die();
        }

      });
    }

  }

  onTime(gt: number) {
    super.onTime(gt);
    const { options } = this;
    const now = this.time;
    if (this.dead) {
      if (this.deadTime + (options.moilTime || 0) <= now) {
        this.destroy();
      }
      return;
    }

    if (options.liveTime < now) {
      this.die();
      return;
    }

    if (options.speedMode === 'const') {
      const speed = options.speed!;
      this.x += speed[0];
      this.y += speed[1];
    }
    else if (options.speedMode === 'getter') {
      const speed = options.speedGetter!(now);
      this.x += speed[0];
      this.y += speed[1];
    } else if (options.speedMode === 'position') {
      const position = options.positionGetter!(now);
      this.x = position[0];
      this.y = position[1];
    }

    if (options.angleMode === 'getter') {
      const angle = options.angleGetter!(now);
      this.angle = angle;
    }

  }

  set angle(v: number) {

  }


  die() {
    this.physics?.destroy();
    this.deadTime = this.time;
    this.dead = true;
    this.emit(new AnxiEvent('die'));
  }

}