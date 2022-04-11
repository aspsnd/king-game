import { Filter, Loader, Sprite } from "pixi.js";
import { CommonClock } from "../../../clocks/common";
import { BackProtos } from "../../../data/back";
import { CardData } from "../../../data/card/Proto";
import { backs } from "../../../resources/list";
import { LoadingFilter } from "../../../shaders/loading";
import { directStatic } from "../../../util/texture";
import { Game } from "../../Game";
import { Page } from "../base/Page";

export class LoadPage extends Page {

  card!: CardData

  constructor(game: Game) {
    super(game);
  }

  refreshSelf(): void {
    super.refreshSelf();

    this.removeChildren();

    const bg = new Sprite(directStatic('gui/bg.png'));
    this.addChild(bg);

    const filter = new LoadingFilter();
    bg.filters = [filter];

    const resources = [];
    for (const item of BackProtos[this.card.back].children) {
      resources.push('/packed-resources/' + backs[item.texture]);
    }
    Loader.shared.add(resources).load(() => {
      Loader.shared.onProgress.detach(node);
      this.game.worldPage.jumpToPage(this.game.worldPage.cardPage);
    });
    const node = Loader.shared.onProgress.add((loader) => {
      filter.uniforms.rate = loader.progress * 0.01;
    })

    CommonClock.onTime(() => {
      filter.uniforms.time += 0.008;
      return !this.visible;
    });

  }

}