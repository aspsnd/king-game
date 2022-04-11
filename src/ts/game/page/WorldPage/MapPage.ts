import { Sprite } from "pixi.js";
import { CommonClock } from "../../../clocks/common";
import { CardDatas } from "../../../data/card";
import { StarFilter } from "../../../shaders/star";
import { directBy, directStatic } from "../../../util/texture";
import { Game } from "../../Game";
import { Page } from "../base/Page";

export class MapPage extends Page {
  constructor(game: Game) {
    super(game);
  }

  refreshSelf(): void {
    super.refreshSelf();

    let bg = new Sprite(directStatic('map/bg.png'));

    const filter = new StarFilter();
    bg.filters = [filter];

    CommonClock.onTime(() => {
      filter.uniforms.time += 0.0005;
      return !this.visible;
    })

    this.addChild(bg);

    for (const cardData of CardDatas) {
      const t0 = directBy(cardData.card[0]);
      const t1 = directBy(cardData.card[1]);
      const cardBtn = new Sprite(t0);
      cardBtn.anchor.set(.5, .5);
      cardBtn.position.set(...cardData.position);
      this.addChild(cardBtn);
      cardBtn.interactive = true;
      cardBtn.cursor = 'pointer';
      const record = this.game.worldPage.record;
      const opened = this.game.worldPage.record.opened.includes(cardData.index);
      if (opened) {
        cardBtn.on('pointerover', () => {
          cardBtn.texture = t1;
        });
        cardBtn.on('pointerout', () => {
          cardBtn.texture = t0;
        })
      }
      cardBtn.on('pointertap', () => {
        // 进入关卡
        if (!opened) return;
        if (record.net) {

        } else {
          this.game.worldPage.cardPage.card = cardData;
          this.game.worldPage.jumpToPage(this.game.worldPage.cardPage);
        }
      })


    }

  }

}