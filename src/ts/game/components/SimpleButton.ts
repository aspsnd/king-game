import { Graphics, Text, TextStyle } from "pixi.js";

type ButtonOptions = {
  width: number,
  height: number,
  fontSize: number,
  radius: number,
  alpha: number,
  color: number,
  overColor: number,
}

export class SimpleButton extends Graphics {
  static defaultStyle = (): ButtonOptions => false || {
    width: 180,
    height: 40,
    fontSize: 28,
    radius: 3,
    alpha: 1,
    color: 0xffffff,
    overColor: 0xff9900,
  }
  constructor(value = '', style: Partial<ButtonOptions> = {}) {
    super();
    const _style = Object.assign(new.target.defaultStyle(), style);
    this.drawRect(0, 0, _style.width, _style.height);
    let text = new Text(value, new TextStyle({
      fontSize: _style.fontSize,
      fill: _style.color,
    }));
    text.position.set(_style.width >> 1, _style.height >> 1);
    text.anchor.set(0.5, 0.5);
    this.addChild(text);
    this.interactive = true;
    this.cursor = 'pointer';
    this.on('pointerover', () => {
      text.style.fill = _style.overColor;
    });
    this.on('pointerout', () => {
      text.style.fill = _style.color;
    });
  }
}