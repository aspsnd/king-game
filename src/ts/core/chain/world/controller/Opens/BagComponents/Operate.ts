import { Container, Graphics, Sprite } from "pixi.js";
import { AnxiEvent } from "../../../../../../aixi/eventer/Event";
import { getProto } from "../../../../../../data/thing";
import { Thing, ThingType } from "../../../../../../data/thing/ThingProto";
import { directStatic } from "../../../../../../util/texture";
import { Role } from "../../../../role/Role";
import { CardWorld } from "../../../CardWorld";

export class Operate extends Graphics {

  btn1 = new Sprite();

  btn2 = new Sprite();

  btn3 = new Sprite();

  textures = Array.from(new Array(8), (_, k) => directStatic(`gui/use${k + 1}.png`));

  constructor(readonly iceParent: Container, readonly handler: (thing: Thing, action: number) => void) {
    super();
    this.lineStyle(1, 0xffffff)
      .beginFill(0x000000, 0.8)
      .drawRoundedRect(0, 0, 86, 120, 10)
      .endFill();

    this.interactive = true;
    this.on('pointerout', () => {
      this.hide();
    });

    this.addChild(this.btn1, this.btn2, this.btn3);
    this.btn1.position.set(8, 11);
    this.btn2.position.set(8, 47);
    this.btn3.position.set(8, 83);

    this.btn1.cursor = 'pointer';
    this.btn2.cursor = 'pointer';
    this.btn3.cursor = 'pointer';

    this.btn1.on('pointertap', () => {
      this.handler(this.thing, 0);
    });

    this.btn2.on('pointertap', () => {
      this.handler(this.thing, 1);
    });

    this.btn3.on('pointertap', () => {
      this.handler(this.thing, 2);
    });

  }

  thing!: Thing
  role!: Role

  show(thing: Thing, world: CardWorld, roleIndex: number) {

    this.thing = thing;

    this.iceParent.addChild(this);

    const role = world.roles[roleIndex];

    this.role = role;

    const hasAnother = world.roles.length > 1;

    const proto = getProto(thing);

    let active = proto.isSuitForVita(role);
    if (proto.kind === ThingType.Material) {
      active = active && proto.canUse;
    }
    this.btn1.texture = (active ? [this.textures[4], this.textures[0]] : [this.textures[5], this.textures[1]])[proto.kind];

    this.btn1.interactive = active;

    let canGive = hasAnother;

    this.btn2.texture = canGive ? this.textures[6] : this.textures[2];

    this.btn2.interactive = canGive;

    this.btn3.texture = this.textures[7];

    this.btn3.interactive = true;

  }

  hide() {
    this.iceParent.removeChild(this);
  }

}