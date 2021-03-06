import { Bodies } from "matter-js";
import { Matrix, RenderTexture, Sprite } from "pixi.js";
import { SkillProto } from "../../../../anxi/controller/skill/proto";
import { ConstViewer } from "../../../../anxi/controller/view-const";
import type { VitaAttribute } from "../../../../core/chain/vita/Attribute";
import type { Vita } from "../../../../core/chain/vita/Vita";
import type { CardWorld } from "../../../../core/chain/world/CardWorld";
import { Flyer } from "../../../../core/flyer/Flyer";
import { ShadowController } from "../../../../core/special-controller/shadow/ShadowController";
import { canNotUseSkillCommon } from "../helper/state";

export const SkillRole0_2 = new SkillProto(1002, '影攻心', {
  intro: '【被动】残影会在3秒后爆炸造成伤害并消失。\n【主动】与前方最远的单位互换位置,对路径上最多三个敌人的位置生成一个残影'
}).active(true)
  .useExtraController(ShadowController)
  .init(function () {
    this.quark.get(ShadowController).endBoom = true;
  })
  .canExecute(function () {
    const belonger = this.quark as Vita<VitaAttribute>;
    return belonger.var.mp >= 60 && !canNotUseSkillCommon(belonger.stateController);
  })
  .execute(function () {
    const belonger = this.quark as Vita<VitaAttribute>;
    const world = belonger.world as CardWorld;

    const face = belonger.face;
    const oldX = belonger.x;
    const oldY = belonger.y;
    let max = 0;
    let target = undefined;
    for (const vita of world.vitas) {
      const value = (vita.x - oldX) * face;
      if (value > max) {
        max = value;
        target = vita;
      }
    }
    if (!target) return;
    belonger.var.mp -= 60;
    const yOffset = (belonger.proto.height - target.proto.height) >> 1;
    belonger.x = target.x;
    belonger.y = target.y - yOffset;
    target.x = oldX;
    target.y = oldY + yOffset;

    const container = belonger.viewController.container;
    const renderTexture = RenderTexture.create({
      width: 300,
      height: 300,
    });

    world.app.renderer.render(container, {
      renderTexture,
      skipUpdateTransform: false,
      transform: new Matrix().translate(-oldX + 150, -oldY + 150)
    });
    const sprite = new Sprite(renderTexture);
    sprite.anchor.set(.5, .5);

    const behaveTime = 15;
    const speedX = (belonger.x - oldX) / behaveTime;
    const speedY = (belonger.y - oldY) / behaveTime;

    let hasReach = 0;
    const flyer = new Flyer({
      speedMode: 'const',
      angleMode: 'const',
      liveTime: behaveTime,
      speed: [speedX, speedY],
      angle: 0,
      body: Bodies.circle(0, 0, 50, {
        collisionFilter: {
          group: -2,
          mask: 0b11000000,
          category: 0b00010000
        }
      }),
      checker(target) {
        return target.group !== belonger.group;
      }
    });

    const shadowController = belonger.get(ShadowController);

    flyer.on('hittarget', e => {
      if (hasReach++ >= 3) return true;
      const enemy = e.data[0];
      const shadow = shadowController.create(enemy.x, enemy.y, belonger, belonger.face);
      shadow.land(belonger.world!);
    })

    flyer.on('time', () => {
      sprite.alpha = 0.8 - 0.3 * flyer.time / behaveTime;
    })

    flyer.x = oldX;
    flyer.y = oldY;
    new ConstViewer(flyer, sprite);

    flyer.land(belonger.world!);

  })