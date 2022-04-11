import { Filter } from "pixi.js";
import { gameHeight, gameWidth } from "../../config";
import frag from "./index.frag.glsl?raw";

export class LoadingFilter extends Filter {
  constructor() {
    super(undefined, frag);
    this.uniforms.time = 0;
    this.uniforms.rate = 0;
    this.uniforms.iResolution = [gameWidth, gameHeight, 1];
  }
}