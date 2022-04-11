import { Texture } from "pixi.js";

export const directStatic = (str: string) => Texture.from('static/' + str);

export const directAssets = (str: string) => Texture.from('assets/' + str);

export const directBy = (str: string) => Texture.from(str);