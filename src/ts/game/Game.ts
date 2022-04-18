import { Application } from "pixi.js";
import { AnxiEventer } from "../aixi/eventer/Eventer";
import { StateController } from "../anxi/controller/state";
import { StateCache } from "../core/controller/state/StateCache";
import { Page } from "./page/base/Page";
import { LoginPage } from "./page/LoginPage";
import { MainPage } from "./page/MainPage";
import { ModePage } from "./page/ModePage";
import { PreloadPage } from "./page/PreloadPage";
import { SelectPage } from "./page/SelectPage";
import { WorldPage } from "./page/WorldPage";

export class Game extends AnxiEventer {

  static instance: Game;

  preloadPage = new PreloadPage(this);

  loginPage = new LoginPage(this);

  mainPage = new MainPage(this);

  modePage = new ModePage(this);

  worldPage = new WorldPage(this);

  selectPage = new SelectPage(this);

  currentPage: Page = this.preloadPage;

  constructor(readonly app: Application) {
    super();
    Game.instance = this;
    this.app.stage.addChild(this.preloadPage, this.loginPage, this.mainPage, this.modePage, this.selectPage, this.worldPage);
    this.currentPage.visible = true;
    this.currentPage.__inited__ || this.currentPage.initSelf();
    this.currentPage.refreshSelf();
    StateController.useStateMap(StateCache);
  }

  async preload() {
    this.app.stage.addChild(this.preloadPage);
    this.preloadPage.initAnimation();
    await this.preloadPage.loadResources();
    this.jumpToPage(this.loginPage);
    this.preloadPage.destroy();
  }

  jumpToPage(page: Page) {
    this.currentPage.visible = false;
    this.currentPage = page;
    page.visible = true;
    page.__inited__ || page.initSelf();
    page.refreshSelf();
  }

}