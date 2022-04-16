import { Body } from "matter-js";
import { AnxiEvent } from "../../aixi/eventer/Event";
import { Quark } from "../../anxi/chain/Quark";
import { PhysicsController } from "../../anxi/physics/atom";
import { Affect } from "../affect/Affect";
import { Vita } from "../chain/vita/Vita";

export interface FlyerOptions {
  body: Body
  speedMode: 'const' | 'getter' | 'position'
  speed?: [number, number]
  speedGetter?(time: number): [number, number]
  positionGetter?(time: number): [number, number]

  angleMode: 'const' | 'getter'
  angle?: number
  angleGetter?(time: number): number

  checker(vitas: Vita<any>): boolean

  affectGetter(target: Vita<any>): Affect

  dieAfterHit: boolean

  liveTime: number

  moilTime: number

}

/**
 * 用于检测普通攻击/技能的碰撞
 */
export class Flyer extends Quark {

  static ID = 0

  id = Flyer.ID++

  physics: PhysicsController<true>;

  dead = false

  deadTime = 0

  hitedVitas: Vita<any>[] = []

  constructor(readonly options: FlyerOptions) {
    super();

    const physics = this.physics = new PhysicsController(this, {
      isBody: true,
      body: options.body
    });

    if (options.speedMode === 'const') {
      Body.setVelocity(physics.box, {
        x: options.speed![0],
        y: options.speed![1]
      })
    }

    if (options.angleMode === 'const') {
      Body.setAngle(physics.box, options.angle!);
    }

    physics.on('collisionStart', e => {
      const physics2 = e.data[0] as PhysicsController<true>;
      const vita = physics2.belonger as Vita<any>;

      if (this.hitedVitas.includes(vita)) return;
      if (!options.checker(vita)) return;

      this.hitedVitas.push(vita);

      this.emit(new AnxiEvent('hittarget', vita));

      const affect = options.affectGetter(vita);

      affect.emit();

      if (options.dieAfterHit) {
        this.die();
      }

    });


  }

  onTime(gt: number) {
    super.onTime(gt);
    const { options } = this;
    const now = this.time;
    if (this.dead) {
      if (this.deadTime + options.moilTime <= now) {
        this.destroy();
      }
      return;
    }

    if (options.liveTime < now) {
      this.die();
      return;
    }

    const { physics } = this;

    if (options.speedMode === 'getter') {
      const speed = options.speedGetter!(now);
      Body.setVelocity(physics.box, {
        x: speed![0],
        y: speed![1]
      });
    } else if (options.speedMode === 'position') {
      const position = options.positionGetter!(now);
      Body.setPosition(physics.box, {
        x: position[0],
        y: position[1]
      });
    }

    if (options.angleMode === 'getter') {
      const angle = options.angleGetter!(now);
      Body.setAngle(physics.box, angle);
    }

  }


  die() {
    this.physics.destroy();
    this.deadTime = this.time;
    this.dead = true;
    this.emit(new AnxiEvent('die'));
  }

}