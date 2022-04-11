import { Record } from "../../net/Record";
import { Game } from "../Game";
import { Page } from "./base/Page";
import { CardPage } from "./WorldPage/CardPage";
import { MapPage } from "./WorldPage/MapPage";

export class WorldPage extends Page {

  private _record!: Record

  set record(r: Record) {
    this._record = r;
  }
  get record() {
    return this._record;
  }

  mapPage = new MapPage(this.game);

  cardPage = new CardPage(this.game);

  constructor(game: Game) {
    super(game);
    this.addChild(this.mapPage, this.cardPage);
  }

  refreshSelf(): void {
    super.refreshSelf();
    this.jumpToPage(this.mapPage);
  }

}