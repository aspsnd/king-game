import { Graphics, ITextStyle, Loader, Rectangle, Sprite, Text, Texture } from "pixi.js";
import { CommonClock } from "../../clocks/common";
import { gameHeight, gameWidth } from "../../config";
import { statics } from "../../resources/list";
import { InfernalFilter } from "../../shaders/infernal";
import { Page } from "./base/Page";

export class PreloadPage extends Page {

  progressLine = new Graphics();

  initAnimation() {
    const style: Partial<ITextStyle> = {
      fontFamily: 'Arial',
      fontSize: '150px',
      fontWeight: 'bold',
      fill: 'transparent',
      stroke: '#00dddd',
      strokeThickness: 3,
      dropShadow: true,
      dropShadowColor: '#00ddaa',
      dropShadowAlpha: 0.35,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 13,
      dropShadowBlur: 10,
      wordWrap: false,
    };
    const text = new Text('判若莱宇宙', style);
    text.x = (gameWidth - text.width) >> 1;
    text.y = 100;
    this.addChild(text);
    text.filterArea = new Rectangle(text.x - 150, text.y - 150, text.width + 300, text.height + 300);

    const filter = new InfernalFilter();
    text.filters = [filter];

    CommonClock.onTime(() => {

      filter.uniforms.time += 0.016;

      return this.destroyed || text.destroyed;
    });

    this.progressLine.lineStyle(1, 0xaaaaaa).beginFill(0xff33333).drawRect(0, gameHeight - 180, gameWidth, 10);
    this.addChild(this.progressLine);
    this.progressLine.x = -gameWidth;

  }


  loadResources() {

    return new Promise<void>(resolve => {
      Loader.shared.add(statics.map(str => '/packed-resources/' + str + '.json')).load(() => {
        resolve();
      });
      Loader.shared.onProgress.add((loader) => {
        this.progressLine.x = (loader.progress - 100) * .01 * gameWidth;
      })
    })
  }

}