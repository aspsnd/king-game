import { Graphics, ITextStyle, Text } from "pixi.js";
import { getProto } from "../../../../../../data/thing";
import { Material } from "../../../../../../data/thing/MaterialProto";
import { Equip } from "../../../../../../data/thing/EquipProto";
import { QualityColor, QualityText, QualityType, Thing, ThingType } from "../../../../../../data/thing/ThingProto";
import { AttrNames, AttrText, VitaAttribute } from "../../../../vita/Attribute";

export class Detail extends Graphics {
  constructor(thing: Thing) {
    super();

    const proto = getProto(thing);

    const name = new Text(proto.name, {
      fontSize: 18,
      fill: 0xffffff
    });

    name.position.set(20, 15);

    const quality = new Text('', {
      fontSize: 18,
      dropShadow: true,
      dropShadowDistance: 1,
      dropShadowAlpha: 0.8,
      dropShadowBlur: 2
    });

    quality.position.set(20, 40);

    switch (thing.kind) {
      case ThingType.Equip: {
        quality.text = `品质：${QualityText[proto.quality]}`;
        name.style.fill = QualityColor[proto.quality];
        quality.style.fill = QualityColor[proto.quality];
        break;
      }
      case ThingType.Material: {
        console.log("????")
        quality.text = `数量：${(thing as Material).count}`;
        break;
      }
    }

    this.addChild(name, quality);

    let offsetY = 65;

    switch (thing.kind) {
      case ThingType.Equip: {
        const equip = thing as Equip;
        const propStyle = {
          fill: 0xff9830,
          fontSize: 18
        }
        for (const p in equip.props) {
          const v = equip.props[p];
          const text = new Text(`${AttrText[p as AttrNames]}:${['crt', 'dod'].includes(p) ? `${(v * 100) | 0}%` : v}`, propStyle);
          text.position.set(20, offsetY);
          this.addChild(text);
          offsetY += 25;
        }
        const skillStyle: Partial<ITextStyle> = {
          fill: 0xff5050,
          fontSize: 16,
          fontWeight: 'bold'
        }
        for (const intro in equip.extraIntro) {
          const text = new Text(intro, skillStyle);
          text.position.set(20, offsetY);
          offsetY += 25;
          this.addChild(text);
        }
        break;
      }
      case ThingType.Material: {
        break;
      }
    }

    const intro = new Text(proto.intro, {
      fill: 0xffffff,
      fontSize: 14,
      wordWrap: true,
      breakWords: true,
      wordWrapWidth: 135,
      letterSpacing: 2,
      lineHeight: 1
    });

    intro.position.set(20, offsetY);
    offsetY += intro.height * 1.5;
    this.addChild(intro);

    const sale = new Text(`售价: ${proto.money ?? 0}`, {
      fill: 0xffffff,
      fontSize: 16
    });
    sale.position.set(20, offsetY + 8);
    offsetY += 28;
    this.addChild(sale);

    this.lineStyle(1, 0xffffff)
      .beginFill(0x000000, 0.7)
      .drawRect(0, 0, 175, offsetY + 8)
      .endFill();

  }

}