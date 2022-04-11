import { DotFilter, GodrayFilter } from "pixi-filters";
import { Sprite } from "pixi.js";
import { CommonClock } from "../../clocks/common";
import { EmptySavedRole, Role } from "../../core/chain/role/Role";
import { SavedRole } from "../../core/chain/role/SavedRole";
import { RoleProtos } from "../../data/role";
import { RecordController } from "../../net/Record";
import { directStatic } from "../../util/texture";
import type { Game } from "../Game";
import { Page } from "./base/Page";

export class SelectPage extends Page {

  roleMode: 'single' | 'double' | 'nethomer' | 'netflower' = 'single'

  constructor(game: Game) {
    super(game);
  }
  refreshSelf(): void {
    super.refreshSelf();
    this.removeChildren();
    if (__DEV__) {
      let record = RecordController.createRecord([new Role(EmptySavedRole(0)).toJson()]);
      this.game.worldPage.record = record;
      this.game.jumpToPage(this.game.worldPage);
    }

    let filters1 = [new DotFilter(1, 5)];
    let filters2 = [new GodrayFilter({
      parallel: false
    })];
    CommonClock.onTime(() => {
      filters2[0].time += 0.016;
      return !this.visible;
    })

    const roles: SavedRole[] = [];

    for (let i = 0; i < 2; i++) {
      let sprite = new Sprite(directStatic(`role/face/role${i + 1}.png`));
      sprite.position.set(240 * i, 0);
      sprite.filters = filters1;
      sprite.interactive = true;
      sprite.cursor = 'pointer';
      sprite.on('pointerover', () => {
        sprite.filters = filters2;
      })
      sprite.on('pointerout', () => {
        sprite.filters = filters1;
      })
      sprite.on('pointertap', () => {
        // let role = 
        let role = new Role(EmptySavedRole(i));

        roles.push(role.toJson());

        switch (this.roleMode) {
          case 'single': {
            let record = RecordController.createRecord(roles);
            this.game.worldPage.record = record;
            this.game.jumpToPage(this.game.worldPage);
            break;
          }
        }
      });
      this.addChild(sprite);
    }
    this.addChild(new Sprite(directStatic('role_select_bg.png')));
  }
}