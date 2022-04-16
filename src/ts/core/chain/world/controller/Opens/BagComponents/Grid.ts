import { Graphics, PI_2, Polygon, Sprite, Text, Texture } from "pixi.js";
import { getProto } from "../../../../../../data/thing";
import { Thing } from "../../../../../../data/thing/ThingProto";
import { directBy } from "../../../../../../util/texture";
import { Detail } from "./Detail";

export class Grid extends Graphics {
  
  private _thing?: Thing

  set thing(v: Thing | undefined) {
    this._thing = v;
    if (!v) {
      this.container.texture = Texture.EMPTY;
      this.interactive = false;
      this.cursor = 'auto';
      if (this.detail) {
        this.detail.destroy();
        this.detail = undefined;
      }
    } else {
      this.container.texture = directBy(getProto(v).disUrl);
      this.interactive = true;
      this.cursor = 'pointer';
    };
  }

  get thing(): Thing | undefined {
    return this._thing;
  }

  container = new Sprite()

  detail?: Detail
  constructor() {
    super();
    this.lineStyle(1, 0xffffff)
      .drawRoundedRect(0, 0, 50, 50, 5);

    this.on('pointerover', () => {
      if (this.detail) this.detail.destroy();
      this.detail = new Detail(this.thing!);
      this.parent.addChild(this.detail);
      this.detail.position.set(this.x + 50, this.y);
    });
    this.on('pointerout', () => {
      if (this.detail) {
        this.detail.destroy();
        this.detail = undefined;
      }
    })
  }
  init() {
    this.addChild(this.container);
  }
}

class Star extends Polygon {
  constructor(x: number, y: number, points: number, radius: number, innerRadius: number = radius * .5, rotation: number = 0) {
    const startAngle = (-1 * Math.PI / 2) + rotation;
    const len = points * 2;
    const delta = PI_2 / len;
    const polygon = [];
    for (let i = 0; i < len; i++) {
      const r = i % 2 ? innerRadius : radius;
      const angle = (i * delta) + startAngle;
      polygon.push(x + (r * Math.cos(angle)), y + (r * Math.sin(angle)));
    }
    super(polygon);
  }
}

export class StarGrid extends Grid {
  constructor() {
    super();
    this.beginFill(0x00aaaa, 0.1);
    this.drawPolygon(new Star(25, 25, 6, 25));
    this.endFill();
    this.init();
  }
}

export class TextGrid extends Grid {
  constructor(_text: string) {
    super();
    let text = new Text(_text, {
      fill: 0xffffff,
      fontSize: 12
    });
    text.position.set(25, 25);
    text.anchor.set(0.5, 0.5);
    this.addChild(text);
    this.init();
  }
}