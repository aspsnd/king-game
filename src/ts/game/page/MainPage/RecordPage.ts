import { Container, Graphics, Sprite, Text, TextStyle } from "pixi.js";
import { Aler } from "../../../aler/aler";
import { gameHeight, gameWidth } from "../../../config";
import { Record, RecordController } from "../../../net/Record";
import { directStatic } from "../../../util/texture";
import { Game } from "../../Game";
import { Page } from "../base/Page";

export class RecordPage extends Page {

  graphics = new Graphics()

  mainContainer = new Container();

  actionMode: 'load' | 'save' = 'load'

  savingRecord?: Record

  constructor(game: Game) {
    super(game);
    this.addChild(this.graphics);
    this.graphics.beginFill(0x272727).drawRect(0, 0, 528, 300).endFill()
      .beginFill(0x5a5a5a).drawRect(0, 0, 528, 47).endFill();
    this.position.set((gameWidth - 528) >> 1, (gameHeight - 300) >> 1);
    let title = new Text('我的存档', new TextStyle({
      fontSize: 25,
      fontWeight: 'bold',
      fill: 0xffffff
    }));
    title.position.set(264, 23);
    title.anchor.set(0.5, 0.5);
    this.addChild(title);
    let close = this.closeBtn;
    close.height = close.width = 33;
    close.position.set(490, 8);
    close.interactive = true;
    close.cursor = 'pointer';
    close.on('pointertap', () => {
      this.game.mainPage.closePage(this);
    })
    this.addChild(close);
    this.mainContainer.position.set(0, 47);
    this.addChild(this.mainContainer);
  }

  closeBtn = new Sprite();

  initSelf(): void {
    super.initSelf();
    this.closeBtn.texture = directStatic('gui/close1.png');
  }

  refreshSelf() {
    super.refreshSelf();
    this.mainContainer.removeChildren();
    const records = RecordController.records;
    for (let index = 0; index < 6; index++) {
      let record = records[index];
      let graphics = new Graphics();
      graphics.position.set((index % 2 == 0) ? 7 : 271, 10 + (index >> 1) * 82);
      graphics.beginFill(0x000000);
      graphics.drawRoundedRect(0, 0, 250, 69, 3);
      graphics.endFill();
      this.mainContainer.addChild(graphics);
      graphics.interactive = true;
      graphics.cursor = 'pointer';
      let indexText = new Text((index + 1) + '', new TextStyle({
        fontSize: 65,
        fill: 0xce6532,
        fontWeight: 'bold'
      }));
      indexText.position.set(35, 34);
      indexText.anchor.set(0.5, 0.5);
      graphics.addChild(indexText);
      graphics.on('pointertap', () => {
        if (this.actionMode === 'load') {

        } else {
          if (record) {
            new Aler({
              content: '确定覆盖当前存档？',
              onSubmit: () => {
                RecordController.saveRecord(index, this.savingRecord!);
                this.game.jumpToPage(this.game.worldPage);
                // gameRouter.pageHandlers['world'].data.record = record;
                // gameRouter.to('world');
              }
            });
          }
        }
      });
      if (!record) continue;
      let namet = record.roles.map(role => role.name).join(' ');
      let nameText = new Text(namet, new TextStyle({
        fontSize: 18,
        fill: record.net ? 0xeeddff : 0xffffff,
        fontWeight: (record.net && !record.isHomer) ? '200' : 'bold'
      }));
      nameText.position.set(75, 20);
      graphics.addChild(nameText);
      let dataText = new Text(record.updateTime + ' ' + (record.net ? (record.isHomer ? 'homer' : 'flower') : ''), new TextStyle({
        fontSize: 12,
        fill: record.net ? 0x00eeff : 0xffffff,
      }));
      dataText.position.set(75, 45);
      graphics.addChild(dataText);
    }
  }

}