import { WorldViewController } from "../../../anxi/controller/base-view/view/WorldViewer";
import { CommonClock } from "../../../clocks/common";
import { CardWorld } from "../../../core/chain/world/CardWorld";
import { CardData } from "../../../data/card/Proto";
import { Page } from "../base/Page";

export class CardPage extends Page {

  card!: CardData

  cardWorld!: CardWorld

  refreshSelf(): void {
    super.refreshSelf();
    this.removeChildren();
    const world = this.cardWorld = new CardWorld(this.game.app, this.card, this.game.worldPage.record);
    const renderer = world.get(WorldViewController);
    this.addChild(renderer.container);
    let index = 0;
    CommonClock.onTime(() => {
      // if (index++ % 10 > 0) return;
      world.onTime(1);
      return world._destroyed;
    });
  }

}