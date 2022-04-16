import { Loader, Sprite } from "pixi.js";
import { CommonClock } from "../../../clocks/common";
import { BackProtos } from "../../../data/back";
import { CardData } from "../../../data/card/Proto";
import { WallProtos } from "../../../data/wall";
import { backs, monsts } from "../../../resources/list";
import { LoadingFilter } from "../../../shaders/loading";
import { directStatic } from "../../../util/texture";
import { Game } from "../../Game";
import { Page } from "../base/Page";

export class LoadPage extends Page {

  card!: CardData

  constructor(game: Game) {
    super(game);
  }

  loadedAssets = new Set<string>()

  filterAssets(assets: string[]) {
    const result = assets.filter(v => !this.loadedAssets.has(v));
    for (const a of assets) {
      this.loadedAssets.add(a);
    }
    return result;
  }

  refreshSelf(): void {
    super.refreshSelf();

    this.removeChildren();

    const bg = new Sprite(directStatic('gui/bg.png'));
    this.addChild(bg);

    const filter = new LoadingFilter();
    bg.filters = [filter];

    const resources: string[] = [];
    for (const item of BackProtos[this.card.back].children) {
      resources.push('/packed-resources/' + backs[item.texture]);
    }

    for (const item of this.card.walls) {
      if (WallProtos[item[0]].texture.startsWith('assets')) resources.push(WallProtos[item[0]].texture);
    }

    const monstSet = new Set<number>();
    for (const step of this.card.monsts) {
      for (const monst of step) {
        monstSet.add(monst[0]);
      }
    }
    for (const boss of this.card.boss) {
      monstSet.add(boss[0]);
    }
    for (const monst of monstSet) {
      for (const index of monsts[String(monst)]) {
        resources.push('/packed-resources/' + index + '.json');
      }
    }

    Loader.shared.add(this.filterAssets(resources)).load(() => {
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