import { VitaAttribute } from "../../../../core/chain/vita/Attribute";
import { Vita } from "../../../../core/chain/vita/Vita";
import { EquipCache } from "../../../../core/controller/equip/EquipCache";
import { BodyCache } from "../../../../core/equip/BodyCache";
import { EquipProto } from "../../EquipProto";
import { QualityType, ThingType } from "../../ThingProto";

export const weapon1_1: EquipProto = {
  index: 0,
  kind: ThingType.Equip,
  type: EquipCache.Weapon,
  props: {
    atk: [3, 5]
  },
  views: {
    [BodyCache.weapon]: {
      texture: "static/equip/weapon/1.png",
      anchor: [2 / 3, 1 / 6]
    }
  },
  extraSkills: [],
  name: "普通的一把剑",
  intro: "看起来像是在路边捡的",
  quality: QualityType.white,
  money: 0,
  disUrl: 'static/equip/weapon/01.png',
  dropUrl: "static/equip/weapon/1.png",
  isSuitForVita: function (vita: Vita<VitaAttribute>): boolean {
    return vita.proto.index === 0;
  }
};

export const body1_1: EquipProto = {
  kind: ThingType.Equip,
  type: EquipCache.Body,
  props: {
    def: [1, 3]
  },
  views: {
    [BodyCache.body]: {
      texture: "static/equip/body/1.png",
      anchor: [.5, .5]
    }
  },
  index: 1,
  name: "普通的铠甲",
  intro: "看起来也是捡的",
  quality: QualityType.white,
  disUrl: "static/equip/body/01.png",
  dropUrl: "static/equip/body/1.png",
  isSuitForVita: function (vita: Vita<VitaAttribute>): boolean {
    return vita.proto.index === 0;
  }
}