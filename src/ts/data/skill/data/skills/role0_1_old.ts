import { Bodies } from "matter-js";
import { Sprite } from "pixi.js";
import { SkillProto } from "../../../../anxi/controller/skill/proto";
import { StateItem } from "../../../../anxi/controller/state/item";
import { ConstViewer } from "../../../../anxi/controller/view-const";
import { Affect } from "../../../../core/affect/Affect";
import type { VitaAttribute } from "../../../../core/chain/vita/Attribute";
import type { Vita } from "../../../../core/chain/vita/Vita";
import { StateCache } from "../../../../core/controller/state/StateCache";
import { Flyer } from "../../../../core/flyer/Flyer";
import { ShadowController } from "../../../../core/special-controller/shadow/ShadowController";
import { directStatic } from "../../../../util/texture";
import { canNotUseSkillCommon } from "../helper/state";

export const SkillRole0_1_old = new SkillProto(9001, '轻斩', {
  intro: '发出自己的残影，对路过敌人造成伤害，并在终点滞留'
})
  .useExtraController(ShadowController)
  .active(true)
  .canExecute(function () {
    const belonger = this.quark as Vita<VitaAttribute>;
    return belonger.var.mp >= 20 && !canNotUseSkillCommon(belonger.stateController);
  })
  .execute(function () {
    const belonger = this.quark as Vita<VitaAttribute>;
    belonger.var.mp -= 20;
    const state = belonger.stateController;
    state.insertStateItem(StateCache.hard.priority, new StateItem(20));
    const flyer = new Flyer({
      body: Bodies.rectangle(0, 0, 40, 80, {
        isSensor: true,
        collisionFilter: {
          group: -2,
          mask: 0b11000000,
          category: 0b00010000
        }
      }),
      speedMode: 'const',
      speed: [10 * belonger.face, 0],
      angleMode: 'const',
      angle: 0,
      checker(vita: Vita<VitaAttribute>) {
        return vita.group !== belonger.group;
      },
      liveTime: 30,
      affectGetter(vita: Vita<VitaAttribute>) {
        const affect = new Affect(belonger, vita);
        affect.hurt.physics = 10 + belonger.attribute.get('atk');
        affect.debuffs.push({
          state: StateCache.beHitBehind.priority,
          continue: 10
        });
        return affect;
      },
    });
    flyer.x = belonger.x;
    flyer.y = belonger.y;

    const sprite = new Sprite(directStatic('role/0/shadow/1.png'));
    sprite.anchor.set(.5, .5);
    sprite.scale.x = belonger.face;
    new ConstViewer(flyer, sprite);
    flyer.land(belonger.world!);

    const face = belonger.face;
    flyer.once('die', () => {
      const constroller = belonger.get(ShadowController);
      const shadow = constroller.create(flyer.x, flyer.y, belonger, face);
      shadow.land(belonger.world!);
    });
  })