import { Controller } from "../../../../anxi/controller/controller";
import { CommonClock } from "../../../../clocks/common";
import { GlobalEventCaster } from "../../../../util/GlobalCatster";
import { CardWorld } from "../CardWorld";
import { BagPanel } from "./Opens/BagPanel";
import { OpenPanel } from "./Opens/base/OpenPanel";

export const OpenType = {
  Bag: 0,
  Skill: 1,
  Setting: 2
} as const;

export type OpenType = typeof OpenType[keyof typeof OpenType];

export class OpenController extends Controller {
  declare belonger: CardWorld;

  panels = {
    [OpenType.Bag]: new BagPanel(),
    [OpenType.Skill]: new BagPanel(),
    [OpenType.Setting]: new BagPanel()
  }

  current?: OpenPanel

  init(): void {
    super.init();
    const { belonger } = this;
    belonger.toolContainer.addChild(
      this.panels[OpenType.Bag],
      this.panels[OpenType.Skill],
      this.panels[OpenType.Setting]
    )
    CommonClock.onTime(() => {
      if (this.current) this.current.onTime();
      return belonger._destroyed;
    })
  }

  wantToggle(type: OpenType) {
    const { belonger } = this;
    if (!this.current) {
      this.current = this.panels[type];
      this.current.visible = true;
      belonger.running = false;
      this.current.refresh(belonger);
    } else {
      const target = this.panels[type];
      if (target !== this.current) return;
      this.current = undefined;
      target.visible = false;
      belonger.running = true;
    }
  }

  listenKeyboard() {
    GlobalEventCaster.on('realkeydown', e => {
      switch (e.data[0].key) {
        case 'c': {
          this.wantToggle(OpenType.Bag);
          break;
        }
        case 'v': {
          this.wantToggle(OpenType.Skill);
          break;
        }
        case 'z': {
          this.wantToggle(OpenType.Setting);
          break;
        }
      }
    })
  }

}