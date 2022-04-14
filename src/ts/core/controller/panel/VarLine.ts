import { Graphics, Text, TextStyle } from "pixi.js";

export interface VarLineOptions {
  background: number
  color: number
  width: number
  height: number
}

export class VarLine extends Graphics {

  set current(v: number) {
    this._cv = v;
    this.refresh();
  }

  set value(v: number) {
    this._v = v;
    this.refresh();
  }

  bar = new Graphics()

  text: Text

  constructor(readonly options: VarLineOptions, private _cv: number, private _v: number) {
    super();
    this.beginFill(0).drawRect(0, 0, options.width, options.height).endFill();
    this.bar.beginFill(options.background).drawRect(0, 0, options.width - 4, options.height - 2);
    this.bar.x = 2;
    this.bar.y = 1;
    this.bar.scale.x = _cv / _v;

    this.text = new Text(`${_cv | 0}/${_v | 0}`, new TextStyle({
      fontWeight: 'bold',
      fontSize: 10,
      fill: options.color
    }));
    this.text.x = options.width >> 1;
    this.text.y = options.height >> 1;
    this.text.anchor.set(.5, .5);

    this.addChild(this.bar, this.text);

  }

  refresh() {
    const { _cv, _v } = this;
    this.bar.scale.x = _cv / _v;
    this.text.text = `${_cv | 0}/${_v | 0}`;
  }
}