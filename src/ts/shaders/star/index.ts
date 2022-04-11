import { Filter } from "pixi.js";
import frag from "./frag.glsl?raw";

export class StarFilter extends Filter {
  constructor() {
    super(undefined, frag);
    this.uniforms.starColor = [1, 1, 1];
    this.uniforms.size = 26;
    this.uniforms.prob = 0.95;
    this.uniforms.time = 0;
  }
}