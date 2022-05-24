import { Bodies } from "matter-js";
import { Graphics, Sprite } from "pixi.js";
import { SkillProto } from "../../../../anxi/controller/skill/proto";
import { ConstViewer } from "../../../../anxi/controller/view-const";
import { ActionData } from "../../../../anxi/controller/view/action";
import { a2r } from "../../../../anxi/math";
import { Affect } from "../../../../core/affect/Affect";
import { VitaAttribute } from "../../../../core/chain/vita/Attribute";
import { Vita } from "../../../../core/chain/vita/Vita";
import { StateCache } from "../../../../core/controller/state/StateCache";
import { BodyCache } from "../../../../core/equip/BodyCache";
import { Flyer } from "../../../../core/flyer/Flyer";
import { ShadowController } from "../../../../core/special-controller/shadow/ShadowController";
import { directStatic } from "../../../../util/texture";
import { listenAvoidInterruptOnce, useInterrupt } from "../helper/beInterrupt";
import { canNotUseSkillCommon } from "../helper/state";

export const skillRole0_4Action = new ActionData({
  prepare: {
    [BodyCache.body]: {
      frameSelector(time: number) {
        return Math.min(time, 59)
      },
      frames: [0, 60],
      value: [
        [-1, 11],
        [12, 15, 50]
      ]
    },
    [BodyCache.leg_r]: {
      frameSelector(time: number) {
        return Math.min(time, 59)
      },
      frames: [0, 60],
      value: [
        [3, 28, -30],
        [3, 30, -50]
      ]
    },
    [BodyCache.leg_l]: {
      frameSelector(time: number) {
        return Math.min(time, 59)
      },
      frames: [0, 60],
      value: [
        [-2, 28, 30],
        [-2, 30, 50]
      ]
    },
    [BodyCache.hand_l]: {
      frameSelector(time: number) {
        return Math.min(time, 59)
      },
      frames: [0, 60],
      value: [
        [0, -5, 105],
        [22, 10, 15],
      ]
    },
    [BodyCache.hand_r]: {
      frameSelector(time: number) {
        return Math.min(time, 59)
      },
      frames: [0, 60],
      value: [
        [0, -3, 15],
        [22, 10, 175],
      ]
    },
    [BodyCache.head]: {
      frameSelector(time: number) {
        return Math.min(time, 59)
      },
      frames: [0, 60],
      value: [
        [2, -20],
        [37, -2, 45]
      ]
    },
    [BodyCache.weapon]: {
      frameSelector(time: number) {
        return Math.min(time, 59)
      },
      frames: [0, 10, 20, 30, 60],
      value: [
        [20, 0, 185],
        [20, 10, 185 + 41],
        [18, 18, 185 + 41 * 2],
        [13, 24, 185 + 41 * 3],
        [-2, 14, 72 + 360],
      ]
    },
  },
  emit: {
    [BodyCache.body]: {
      value: [
        [12, 15, 50],
      ]
    },
    [BodyCache.leg_r]: {
      value: [
        [3, 30, -50],
      ]
    },
    [BodyCache.leg_l]: {
      value: [
        [-2, 30, 50],
      ]
    },
    [BodyCache.hand_l]: {
      frames: [0, 12],
      value: [
        [22, 10, 15],
        [22, 10, 90],
      ]
    },
    [BodyCache.hand_r]: {
      frames: [0, 6, 7, 12],
      value: [
        [22, 10, 175],
        [22, 10, 175, 0, 1],
        [22, 10, 175 + 180, 0, 1],
        [22, 10, 175 + 180],
      ]
    },
    [BodyCache.head]: {
      value: [
        [37, -2, 45]
      ]
    },
    [BodyCache.weapon]: {
      frames: [0, 6, 7, 12],
      value: [
        [-2, 14, 72 + 360],
        [20, 10, 72 + 360, 1, 0.35],
        [20, 10, 72 + 180, 1, 0.35],
        [44, 7, 72 + 180],
      ]
    },
  }
})

export const SkillRole0_4 = new SkillProto(1004, '居合掠影', {
  intro: '蓄力一秒以施展居合领域，之后对进入领域的第一个敌人释放九次剑锋，并留下残影。若三秒后未触发会将剑气均匀向前释放'
}).active(true)
  .init(function () {
    useInterrupt(this.quark as Vita<VitaAttribute>, this);
  })
  .useExtraController(ShadowController)
  .canExecute(function () {
    const belonger = this.quark as Vita<VitaAttribute>;
    return belonger.var.mp >= 100 && !canNotUseSkillCommon(belonger.stateController);
  })
  .execute(function () {
    const belonger = this.quark as Vita<VitaAttribute>;
    belonger.var.mp -= 100;
    belonger.stateController.setStateLeft(StateCache.attack, 241);
    const startTime = belonger.time;

    const actionIndex = belonger.viewController.insertAction(skillRole0_4Action.standard.prepare);

    const sprite = new Graphics();
    sprite.lineStyle(1, 0xff0000).beginFill(0xff0000, 0.3).drawCircle(0, 0, 120).endFill();
    const view = new ConstViewer(belonger, sprite);
    sprite.alpha = 0;
    view.eventer.on('time', () => {
      const now = belonger.time - startTime;
      sprite.alpha = (now / 60) ** 2;
      return now > 60;
    });

    const shadowController = belonger.get(ShadowController);

    listenAvoidInterruptOnce(belonger, `time_${startTime + 60}`, () => {
      const flyer = new Flyer({
        body: Bodies.circle(0, 0, 120, {
          collisionFilter: {
            group: -2,
            mask: 0b11000000,
            category: 0b00010000
          }
        }),
        speedMode: 'const',
        speed: [0, 0],
        angleMode: 'const',
        angle: 0,
        liveTime: 180,
        checker(target) {
          return target.group !== belonger.group;
        }
      });
      flyer.x = belonger.x;
      flyer.y = belonger.y;
      flyer.land(belonger.world!);
      flyer.once('hittarget', e => {
        const enemy = e.data[0];
        const enemy_x = enemy.x;
        const enemy_y = enemy.y;
        const vita_x = belonger.x;
        const vita_y = belonger.y;
        const angle = enemy_y < vita_y ? -Math.atan((enemy_x - vita_x) / (enemy_y - vita_y)) : Math.PI - Math.atan((enemy_x - vita_x) / (enemy_y - vita_y));
        view.destroy();
        belonger.viewController.removeAction(actionIndex);
        belonger.stateController.removeState(StateCache.attack);
        for (let i = 0; i < 9; i++) {
          const offsetAngle = (i % 3) - 1;
          const angle_this = angle + offsetAngle * a2r(10);
          const baseSpeedX = Math.sin(angle_this) * 5;
          const baseSpeedY = -Math.cos(angle_this) * 5;
          const speedOffset = Math.floor(i / 3) - 1 + .35 * Math.abs(offsetAngle);
          const flyer = new Flyer({
            body: Bodies.rectangle(vita_x, vita_y, 30, 100, {
              collisionFilter: {
                group: -2,
                mask: 0b11000000,
                category: 0b00010000
              }
            }),
            speedMode: 'const',
            speed: [baseSpeedX * (speedOffset + 3), baseSpeedY * (speedOffset + 3)],
            angleMode: 'const',
            angle: angle,
            liveTime: 30,
            checker(target) {
              return target.group !== belonger.group;
            },
            affectGetter(enemy) {
              const affect = new Affect(belonger, enemy);

              affect.hurt.physics = belonger.attribute.get('atk') + enemy.attribute.get('atk');
              affect.debuffs.push({
                state: StateCache.beHitBehind.priority,
                continue: 25
              });
              affect.canCrt = true;

              return affect;
            }
          });
          flyer.x = vita_x;
          flyer.y = vita_y;
          const sprite = new Sprite(directStatic('role/0/shadow/2.png'));
          sprite.anchor.set(.5, .5);
          sprite.rotation = angle + Math.PI;
          new ConstViewer(flyer, sprite);
          flyer.land(belonger.world!)
          flyer.on('die', () => {
            const shadow = shadowController.create(flyer.x, flyer.y, belonger, 1);
            shadow.land(belonger.world!);
          })
        }
        const emitAction = belonger.viewController.insertAction(skillRole0_4Action.standard.emit);
        belonger.stateController.setStateLeft(StateCache.attack, 12);
        belonger.stateController.get(StateCache.attack)!.once('lost', () => {
          belonger.viewController.removeAction(emitAction);
        })
      })
    }, () => {
      // 蓄力中被打断
      view.destroy();
      belonger.viewController.removeAction(actionIndex);
    });

    listenAvoidInterruptOnce(belonger, `time_${startTime + 240}`, () => {
      view.destroy();
      belonger.viewController.removeAction(actionIndex);
      // 蓄力完到达三秒
      const vita_x = belonger.x;
      const vita_y = belonger.y;
      for (let i = 0; i < 9; i++) {
        const angle_this = Math.PI * 2 / 9 * i;
        const baseSpeedX = Math.sin(angle_this) * 8;
        const baseSpeedY = -Math.cos(angle_this) * 8;
        const flyer = new Flyer({
          body: Bodies.rectangle(vita_x, vita_y, 30, 100, {
            collisionFilter: {
              group: -2,
              mask: 0b11000000,
              category: 0b00010000
            }
          }),
          speedMode: 'const',
          speed: [baseSpeedX, baseSpeedY],
          angleMode: 'const',
          angle: angle_this,
          liveTime: 30,
          checker(target) {
            return target.group !== belonger.group;
          },
          affectGetter(enemy) {
            const affect = new Affect(belonger, enemy);

            affect.hurt.physics = 100 + 5 * belonger.level;
            affect.debuffs.push({
              state: StateCache.beHitBehind.priority,
              continue: 10
            });
            affect.canCrt = true;

            return affect;
          }
        });
        flyer.x = vita_x;
        flyer.y = vita_y;
        const sprite = new Sprite(directStatic('role/0/shadow/2.png'));
        sprite.anchor.set(.5, .5);
        sprite.rotation = angle_this + Math.PI;
        new ConstViewer(flyer, sprite);
        flyer.land(belonger.world!)
        flyer.on('die', () => {
          const shadow = shadowController.create(flyer.x, flyer.y, belonger, 1);
          shadow.land(belonger.world!);
        })
      }
      const emitAction = belonger.viewController.insertAction(skillRole0_4Action.standard.emit);
      belonger.stateController.setStateLeft(StateCache.attack, 12);
      belonger.stateController.get(StateCache.attack)!.once('lost', () => {
        belonger.viewController.removeAction(emitAction);
      })
    }, () => {
      // 蓄力后被打断
      view.destroy();
      belonger.viewController.removeAction(actionIndex);
    })

  });