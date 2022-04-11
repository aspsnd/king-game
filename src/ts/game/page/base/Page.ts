import { Container } from "pixi.js";
import type { Game } from "../../Game";

export class Page extends Container {

  currentPage?: Page

  childPages: Page[] = []

  addChildPage(page: Page) {
    if (!this.currentPage) this.currentPage = page;
    this.addChild(page);
    page.visible = false;
    this.childPages.push(page);
  }

  constructor(readonly game: Game) {
    super();
    this.visible = false;
  }

  __inited__ = false
  refreshSelf() {

  }
  initSelf() {
    this.__inited__ = true;
  }

  jumpToPage(page: Page) {
    if (this.currentPage) {
      this.currentPage.visible = false;
    }
    this.currentPage = page;
    page.visible = true;
    page.__inited__ || page.initSelf();
    page.refreshSelf();
  }

  closePage(page: Page) {
    page.visible = false;
  }

  openPage(page: Page) {
    page.visible = true;
    page.__inited__ || page.initSelf();
    page.refreshSelf();
  }
}