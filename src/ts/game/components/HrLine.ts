import { Graphics } from "pixi.js";

export class SpanLine extends Graphics {
  constructor(width = 200, height = 5) {
    super();
    this.lineStyle(height, 0xffffff, 0.02);
    let d = 50;
    let d21 = 1 / d;
    for (let i = d; i--;) {
      this.moveTo((d21 * width * (d - i)) >> 1, 0);
      this.lineTo((d21 * width * (d + i)) >> 1, 0);
    }
  }
}