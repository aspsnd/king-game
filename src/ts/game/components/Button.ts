import { Graphics, Text, TextStyle } from "pixi.js";

type ButtonOptions = {
  width: number,
  height: number,
  fontSize: number,
  backgroundColor: number,
  radius: number,
  alpha: number,
  color: number,
  border: number,
  borderWidth: number
}

export class Button extends Graphics {
  static defaultStyle = (): ButtonOptions => ({
    width: 300,
    height: 36,
    fontSize: 14,
    backgroundColor: 0xffffff,
    radius: 3,
    alpha: 1,
    color: 0x111111,
    border: 0x111111,
    borderWidth: 1
  })
  constructor(value: string = '', style: Partial<ButtonOptions> = {}) {
    super();
    const _style = Object.assign(new.target.defaultStyle(), style);
    this.lineStyle(_style.borderWidth, _style.border);
    this.beginFill(_style.backgroundColor, _style.alpha);
    this.drawRoundedRect(0, 0, _style.width, _style.height, _style.radius);
    this.endFill();
    let text = new Text(value, new TextStyle({
      fontSize: _style.fontSize,
      fill: _style.color,
    }));
    text.position.set(_style.width >> 1, _style.height >> 1);
    text.anchor.set(0.5, 0.5);
    this.addChild(text);
    this.interactive = true;
    this.cursor = 'pointer';
  }
}