import { Texture } from "pixi.js";
import { backs } from "../resources/list";

export const directStatic = (str: string) => Texture.from('static/' + str);

export const directAssets = (str: string) => Texture.from('assets/' + str);

export const directBy = (str: string) => Texture.from(str);

export const directBack = (str: string) => Texture.from('/packed-resources/' + backs[str]);