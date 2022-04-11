import { Sprite } from "pixi.js";
import { RecordController } from "../../net/Record";
import { directStatic } from "../../util/texture";
import { SpanLine } from "../components/HrLine";
import { SimpleButton } from "../components/SimpleButton";
import type { Game } from "../Game";
import { Page } from "./base/Page";
import { RecordPage } from "./MainPage/RecordPage";

export class MainPage extends Page {

  recordPage = new RecordPage(this.game);

  constructor(game: Game) {
    super(game);
    for (let k = 0; k < 4; k++) {
      let line = new SpanLine();
      line.position.set(760, 305 + 55 * k);
      this.addChild(line);
    }
    let i = 0;
    let newBegin = new SimpleButton('新的开始');
    newBegin.position.set(770, 258 + (55 * i++));
    let continueGame = new SimpleButton('继续游戏');
    continueGame.position.set(770, 258 + (55 * i++));
    let helpPage = new SimpleButton('游戏帮助');
    helpPage.position.set(770, 258 + (55 * i++));
    let aboutPage = new SimpleButton('关于');
    aboutPage.position.set(770, 258 + (55 * i++));
    let exitLogin = new SimpleButton('退出登录');
    exitLogin.position.set(770, 258 + (55 * i++));
    this.addChild(newBegin, continueGame, helpPage, aboutPage, exitLogin);

    newBegin.on('pointertap', () => {
      this.game.jumpToPage(this.game.modePage);
    });
    continueGame.on('pointertap', () => {
      this.recordPage.actionMode = 'load';
      this.jumpToPage(this.recordPage);
    })
    helpPage.on('pointertap', () => {
      window.open('https://www.baidu.com', '_blank');
    })
    aboutPage.on('pointertap', () => {
      window.open('https://www.baidu.com', '_blank');
    });
    exitLogin.on('pointertap', () => {
      RecordController.logout();
      this.game.jumpToPage(this.game.loginPage);
    });
    const sprite = this.bgSprite;
    sprite.position.set(40, 57);
    this.addChild(sprite);
    this.addChild(this.recordPage);

  }
  bgSprite = new Sprite();
  initSelf(): void {
    super.initSelf();
    this.bgSprite.texture = directStatic('gui/main.png');
  }

  refreshSelf(): void {
    super.refreshSelf();
    if (__DEV__) {
      this.game.selectPage.roleMode = 'single';
      this.game.jumpToPage(this.game.selectPage);
    }
  }
}