import { AlerFactory } from "./core";
import "./game.scss";
import tipModel from "./templete/GTip.html?raw";
import dangerModel from "./templete/GDanger.html?raw";

const TipModel = document.createElement('div');
TipModel.innerHTML = tipModel;

export const GTip = AlerFactory.create({
  model: TipModel,
  cover: 'ax-cover game',
  baseAlerOption: {
    content: '',
    time: 1000,
    autoClose: true
  },
  onCreate() {
    this.option.autoClose && setTimeout(() => {
      this.remove();
    }, this.option.time);
  }
})

const DangerModel = document.createElement('div');
DangerModel.innerHTML = dangerModel;

export const GDanger = AlerFactory.create({
  model: DangerModel,
  cover: 'ax-cover game',
  baseAlerOption: {
    content: '',
    time: 1000,
    autoClose: true
  },
  onCreate() {
    this.option.autoClose && setTimeout(() => {
      this.remove();
    }, this.option.time);
  }
})