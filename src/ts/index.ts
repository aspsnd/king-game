import { Application } from "pixi.js"
import { gameHeight, gameWidth } from "./config";
import { Game } from "./game/Game";

declare const appCanvas: HTMLCanvasElement;

export const init = async () => {
  try {
    const app = new Application({
      view: appCanvas,
      width: gameWidth,
      height: gameHeight,
      antialias: true
    });

    const game = new Game(app);
    await game.preload();
  }catch(e){
    console.error(e);
  }
};