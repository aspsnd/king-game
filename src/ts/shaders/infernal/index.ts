import { Filter } from "pixi.js";
import frag from "./index.frag.glsl?raw";

export class InfernalFilter extends Filter {
  constructor() {
    super(undefined, frag);
    this.uniforms.time = 0;
    this.uniforms.rate = 0.01;
    this.uniforms.dis = 3;
  }
}