import { MonstProtos } from "../../../data/monst";
import { VitaAttribute } from "../vita/Attribute";
import { Vita } from "../vita/Vita";
import { MonstProto } from "./Proto";
import { SavedMonst } from "./SavedMonst";

export const EmptySavedMonst = (index: number): SavedMonst => ({
  index,
  attr: { ...MonstProtos[index].attr },
  skills: [...MonstProtos[index].skills],
  talentStars: MonstProtos[index].talentStars,
  talents: [...MonstProtos[index].talents]
})

export class Monst extends Vita<VitaAttribute>{

  constructor(proto: MonstProto) {
    super(EmptySavedMonst(proto.index), proto);
    if(__DEV__){
      // @ts-ignore
      window.monst = this;
    }

  }

}