import { Quark } from "../../chain/Quark";
import { Matrix, Sprite, Texture } from "pixi.js";
import { getCurrent } from "./util";
import { ActionStruct, StandardActionStruct, ActionData, StandardActionValue } from "./action";
import { StateController } from "../state";
import { ViewController } from "../base-view/view";
import { EquipController } from "../../../core/controller/equip/EquipController";
import { EquipCache } from "../../../core/controller/equip/EquipCache";
import { EquipProtos } from "../../../data/thing";
import { BodyCache } from "../../../core/equip/BodyCache";

export type MatrixBaseAction = ActionStruct;

export type BodyStruct = {
  [bodyIndex: number]: Sprite
  [bodyIndex: string]: Sprite
}

export type BaseBodyStruct = {
  [bodyIndex: number | string]: {
    texture: string
    anchor: [number, number]
  }
}

export const enum MatrixViewerRenderType {
  FromState = 0,
  FromGetter = 1
}

export class MatrixViewer extends ViewController {

  actionSelector?: (quark: Quark, viewer: MatrixViewer) => [number, number]

  transform = new Matrix()
  baseAction: StandardActionStruct

  constructor(quark: Quark, baseAction: ActionData | ActionStruct, readonly defaultStateIndex: number) {
    super(quark);
    this.baseAction = baseAction instanceof ActionData ? baseAction.standard : new ActionData(baseAction).standard;
  }

  bodys: BodyStruct = {}
  bindEquipController(equipController: EquipController) {
    equipController.signal[EquipCache.Weapon].get.add(this.reloadViewWithEquipments);
    equipController.signal[EquipCache.Weapon].lose.add(this.reloadViewWithEquipments);

    equipController.signal[EquipCache.Body].get.add(this.reloadViewWithEquipments);
    equipController.signal[EquipCache.Body].lose.add(this.reloadViewWithEquipments);

    equipController.signal[EquipCache.Dcrt].get.add(this.reloadViewWithEquipments);
    equipController.signal[EquipCache.Dcrt].lose.add(this.reloadViewWithEquipments);

    equipController.signal[EquipCache.Wing].get.add(this.reloadViewWithEquipments);
    equipController.signal[EquipCache.Wing].lose.add(this.reloadViewWithEquipments);

    this.reloadViewWithEquipments();

  }
  unbindEquipController(equipController: EquipController) {
    equipController.signal[EquipCache.Weapon].get.delete(this.reloadViewWithEquipments);
    equipController.signal[EquipCache.Weapon].lose.delete(this.reloadViewWithEquipments);

    equipController.signal[EquipCache.Body].get.delete(this.reloadViewWithEquipments);
    equipController.signal[EquipCache.Body].lose.delete(this.reloadViewWithEquipments);

    equipController.signal[EquipCache.Dcrt].get.delete(this.reloadViewWithEquipments);
    equipController.signal[EquipCache.Dcrt].lose.delete(this.reloadViewWithEquipments);

    equipController.signal[EquipCache.Wing].get.delete(this.reloadViewWithEquipments);
    equipController.signal[EquipCache.Wing].lose.delete(this.reloadViewWithEquipments);
  }
  reloadViewWithEquipments = () => {
    const controller = this.belonger.get(EquipController);
    const baseBodyStruct = { ...this.baseBodyStruct };
    for (const key of [EquipCache.Weapon, EquipCache.Body, EquipCache.Dcrt, EquipCache.Wing]) {
      const struct = controller.data[key];
      if (!struct) continue;
      const proto = EquipProtos[struct.index];
      for (const body in proto.views) {
        baseBodyStruct[body] = proto.views[body as unknown as BodyCache]!;
      }
    };
    for (const [name, struct] of Object.entries(baseBodyStruct)) {
      const body = this.bodys[name];
      body.texture = Texture.from(struct.texture);
      body.anchor.set(...struct.anchor);
      this.container.addChild(body);
    }
  }

  baseBodyStruct!: BaseBodyStruct
  fromBaseBodyStruct(...bodies: BaseBodyStruct[]) {
    const origin: BaseBodyStruct = {};
    Object.assign(origin, ...bodies);
    this.baseBodyStruct = origin;
    for (const [name, struct] of Object.entries(origin)) {
      const body = this.bodys[name] = new Sprite(Texture.from(struct.texture));
      body.anchor.set(...struct.anchor);
      this.container.addChild(body);
    }
  }
  renderType: MatrixViewerRenderType = MatrixViewerRenderType.FromState
  onRender(): void {
    this.container.transform.setFromMatrix(new Matrix().translate(this.belonger!.x, this.belonger!.y).append(this.transform));
    let stateIndex!: string | number, time!: number;
    if (this.renderType === MatrixViewerRenderType.FromState) {
      const state = this.belonger.get(StateController).headState!;
      stateIndex = state.index;
      time = state.headTime;
    } else if (this.renderType === MatrixViewerRenderType.FromGetter) {
      [stateIndex, time] = this.actionSelector!(this.belonger, this);
    }
    for (const bodyIndex in this.bodys) {
      let sprite = this.bodys[bodyIndex];
      const useInserted = !!this.insertedAction?.[bodyIndex];
      let action = this.insertedAction?.[bodyIndex] || this.baseAction[stateIndex]?.[bodyIndex] || this.baseAction[this.defaultStateIndex][bodyIndex];
      if (!action) continue;
      let current: StandardActionValue;
      if (action.frameSelector) {
        const belonger = this.belonger;
        const stateController = belonger.get(StateController);
        current = action.value[action.frameSelector(useInserted ? this.belonger.time - this.insertTime : time, stateController, belonger)];
      } else {
        current = getCurrent(action, this.insertedAction?.[bodyIndex] ? this.belonger.time - this.insertTime : time);
      }
      let result = current instanceof Function ? current(time, this.belonger!.get(StateController), this.belonger) : current;
      sprite.transform.setFromMatrix(result);
    }
  }
  private _insertedActionIndex = 0
  private insertedAction?: StandardActionStruct[number | string]

  private insertTime = 0
  insertAction(action: StandardActionStruct[number | string]): number {
    this.insertTime = this.belonger.time;
    this._insertedActionIndex++;
    this.insertedAction = action;
    return this._insertedActionIndex;
  }
  removeAction(index: number): void {
    if (index !== this._insertedActionIndex) return;
    this.insertedAction = undefined;
  }

}