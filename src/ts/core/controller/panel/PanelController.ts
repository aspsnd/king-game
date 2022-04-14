import { Sprite, Text, TextStyle } from "pixi.js";
import { Controller } from "../../../anxi/controller/controller";
import { gameWidth } from "../../../config";
import { directBy, directStatic } from "../../../util/texture";
import { Role } from "../../chain/role/Role";
import { CardWorld } from "../../chain/world/CardWorld";
import { BodyCache } from "../../equip/BodyCache";
import { VarLine } from "./VarLine";

export class PanelController extends Controller {
  declare belonger: Role

  constructor(role: Role, readonly index: number) {
    super(role, true);
  }

  init(): void {
    super.init();
    const role = this.belonger;
    const container = (role.world as CardWorld).guiContainer;

    const { index } = this;
    const left = index === 0;
    const mirror = [1, -1][index];

    // avatar
    const avatar = new Sprite(directBy(role.proto.defaultBody[BodyCache.head].texture));
    avatar.anchor.set(.5, .5);
    avatar.scale.set(mirror * 1.4, 1.4);
    avatar.x = left ? 30 : gameWidth - 30;
    avatar.y = 35;
    container.addChild(avatar);

    // level
    const level = new Text(role.level + '', new TextStyle({
      fill: 0xffffff,
      fontSize: 20,
      fontWeight: 'bold',
    }));
    level.x = left ? 45 : gameWidth - 45;
    level.anchor.x = index;
    level.y = 45;
    container.addChild(level);

    // hp
    const hpAttr = role.attribute.getAttr('hp');
    const hp = new VarLine({
      background: 0xff0000,
      color: 0xffffff,
      width: 154,
      height: 10
    }, role.var.hp, hpAttr.value);
    hp.position.set(left ? 80 : gameWidth - 80 - 154, 20);
    container.addChild(hp);

    // mp
    const mpAttr = role.attribute.getAttr('mp');
    const mp = new VarLine({
      background: 0x0085ff,
      color: 0xffffff,
      width: 154,
      height: 10
    }, role.var.mp, mpAttr.value);
    mp.position.set(left ? 80 : gameWidth - 80 - 154, 35);
    container.addChild(mp);

    // exp
    const levelController = role.levelController;
    const exp = new VarLine({
      background: 0xff8500,
      color: 0xffffff,
      width: 154,
      height: 10
    }, levelController.exp, levelController.fexp);
    exp.position.set(left ? 80 : gameWidth - 80 - 154, 50);
    container.addChild(exp);

    role.on('hpchange', () => {
      hp.current = role.var.hp;
      hp.value = hpAttr.value;
    });

    role.attribute.on('hpchange', () => {
      hp.current = role.var.hp;
      hp.value = hpAttr.value;
    })

    role.on('mpchange', () => {
      mp.current = role.var.mp;
      mp.value = mpAttr.value;
    });

    role.attribute.on('mpchange', () => {
      mp.current = role.var.mp;
      mp.value = mpAttr.value;
    })

    role.on('getexp', () => {
      exp.current = levelController.exp;
      exp.value = levelController.fexp;
    });

    role.on('levelup', () => {
      exp.current = levelController.exp;
      exp.value = levelController.fexp;
      level.text = role.level + '';
    });

  }

}