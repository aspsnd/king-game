import { Loader, Rectangle } from "pixi.js";
import { Loading } from "../../../../aler/aler";
import { Controller } from "../../../../anxi/controller/controller";
import { MonstProtos } from "../../../../data/monst";
import { monsts } from "../../../../resources/list";
import { GlobalEventCaster } from "../../../../util/GlobalCatster";
import { DefaultPlayer2Keys, InstructEmitter } from "../../../controller/instruct/InstructEmitter";
import { Monst } from "../../monst/Monst";
import { CardWorld } from "../CardWorld";

export class StepController extends Controller {

  declare belonger: CardWorld

  step = 0

  resting = true

  box!: Rectangle

  limits: Rectangle[] = []

  get limit() {
    return this.resting ? this.box : this.limits[this.step];
  }

  init(): void {
    super.init();

    const cardData = this.belonger.cardData;

    const { box, boxs } = cardData;

    this.box = box;
    this.limits = boxs;

    if (__DEV__) {


      function loadResourceOfMonst(index: number) {
        return new Promise(resolve => {
          const resources: string[] = [];
          for (const str of monsts[String(index)]) {
            const res = '/packed-resources/' + str + '.json';
            if (!Loader.shared.resources[res]) resources.push(res);
          }
          Loader.shared.add(resources).load(resolve);
        })
      }

      GlobalEventCaster.async('keydown', async e => {
        try {
          const { belonger } = this;
          const num = Number(e.data[0].key);
          if (MonstProtos[num]) {
            await loadResourceOfMonst(num);
            console.log(`Dev::loaded resources of monst[${num}]`);
            const monst = new Monst(MonstProtos[num]);
            monst.x = 630 + belonger.backController.offset[0];
            monst.y = 200 + belonger.backController.offset[1];
            monst.land(belonger);

            new InstructEmitter(monst, DefaultPlayer2Keys).init();

          }
        } catch (e) {
          console.error(e);
        };
      })
    }

  }



}