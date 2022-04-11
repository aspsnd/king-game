import { Sprite } from "pixi.js";
import { Aler, SingleAler } from "../../aler/aler";
import { directStatic } from "../../util/texture";
import { SpanLine } from "../components/HrLine";
import { SimpleButton } from "../components/SimpleButton";
import type { Game } from "../Game";
import { Page } from "./base/Page";

export class ModePage extends Page {
  constructor(game: Game) {
    super(game);

    for (let k = 0; k < 4; k++) {
      let line = new SpanLine();
      line.position.set(760, 305 + 55 * k);
      this.addChild(line);
    }
    let i = 0;
    let singleRole = new SimpleButton('单人模式');
    singleRole.position.set(770, 258 + (55 * i++));
    let doubleRole = new SimpleButton('双人模式');
    doubleRole.position.set(770, 258 + (55 * i++));
    let netRecord = new SimpleButton('联机存档');
    netRecord.position.set(770, 258 + (55 * i++));
    let joinNet = new SimpleButton('加入联机');
    joinNet.position.set(770, 258 + (55 * i++));
    let toMainPage = new SimpleButton('返回主页');
    toMainPage.position.set(770, 258 + (55 * i++));
    this.addChild(singleRole, doubleRole, netRecord, joinNet, toMainPage);

    singleRole.on('pointertap', () => {
      this.game.selectPage.roleMode = 'single';
      this.game.jumpToPage(this.game.selectPage);
    });
    doubleRole.on('pointertap', () => {
      this.game.selectPage.roleMode = 'double';
      this.game.jumpToPage(this.game.selectPage);
    })
    netRecord.on('pointertap', () => {
      new SingleAler({ content: '该功能在开发中' })
    })
    joinNet.on('pointertap', () => {
      new SingleAler({ content: '该功能在开发中' })
    });
    toMainPage.on('pointertap', () => {
      this.game.jumpToPage(this.game.mainPage);
    });

  }

  initSelf(): void {
    super.initSelf();
    let sprite = new Sprite(directStatic('gui/main.png'));
    sprite.position.set(40, 57);
    this.addChild(sprite);
  }
}