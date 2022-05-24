import { Application, Container, Graphics } from "pixi.js"
import { WorldViewController } from "../ts/anxi/controller/base-view/view/WorldViewer";
import { StateController } from "../ts/anxi/controller/state";
import { StateItem } from "../ts/anxi/controller/state/item";
import { MatrixViewer } from "../ts/anxi/controller/view";
import { Vita } from "../ts/core/chain/vita/Vita";
import { ActionStruct } from "../ts/anxi/controller/view/action";
import { CommonClock } from "../ts/clocks/common";
import { EmptySavedMonst } from "../ts/core/chain/monst/Monst";
import { EmptySavedRole } from "../ts/core/chain/role/Role";
import { VitaAttribute } from "../ts/core/chain/vita/Attribute";
import { CardWorld } from "../ts/core/chain/world/CardWorld";
import { TextButton } from "../ts/core/chain/world/controller/Opens/BagComponents/button";
import { StateCache } from "../ts/core/controller/state/StateCache";
import { CardData0 } from "../ts/data/card/data/0";
import { MonstProtos } from "../ts/data/monst";
import { RoleProtos } from "../ts/data/role";
import { RecordController } from "../ts/net/Record";
import { loadAllResources } from "./resources";
import { storage } from "./sto";
import { skillRole0_4Action } from "../ts/data/skill/data/skills/role0_4";
declare const timeInput: HTMLInputElement;
// @ts-ignore
window.__DEV__ = false
window.onload = async () => {
  const app = new Application({
    view: appCanvas,
    width: 960,
    height: 590
  });

  await loadAllResources();

  StateController.useStateMap(StateCache);
  const world = new CardWorld(app, CardData0, RecordController.createRecord(
    [EmptySavedRole(0)]
  ));

  const worldView = world.get(WorldViewController);

  const container = worldView.afterContainer;

  const graphics = new Graphics().lineStyle(1, 0xff0000, 0.2).moveTo(100, 300).lineTo(300, 300)
    .lineStyle(1, 0x0000ff, 0.2).moveTo(200, 200).lineTo(200, 400).lineStyle(1, 0x000000, 0.2).drawCircle(200, 300, 80);
  container.addChild(graphics);

  world.roles[0].destroy();

  CommonClock.onTime(() => {
    world.onTime(0);
  })

  app.stage.addChild(worldView.container);

  let vita: Vita<VitaAttribute>;
  let updateState: (time: number) => void;
  Vita.prototype.initControllers = function () {

    this.stateController = new StateController(this, StateCache);

    if (StateController.stateMap[storage.targetState]) {
      const item = new StateItem(0, true)
      this.stateController.insertStateItem(storage.targetState, item);
      const state = this.stateController.get(storage.targetState)!;
      updateState = (time: number) => {
        state.headTime = time;
      }
    } else {
      this.stateController.setStateInfinite(storage.targetState, true);
      const state = this.stateController.get(storage.targetState)!;
      updateState = (time: number) => {
        state.headTime = time;
      }
    }

    this.viewController = new MatrixViewer(this, this.proto.actions, StateCache.common);
    this.viewController.fromBaseBodyStruct(this.proto.defaultBody);

  }

  if (storage.targetEdit === 'role') {
    vita = new Vita(EmptySavedRole(storage.targetEditId), RoleProtos[storage.targetEditId]);
  } else {
    vita = new Vita(EmptySavedMonst(storage.targetEditId), MonstProtos[storage.targetEditId]);
  }

  const btnContainer = new Container;
  btnContainer.position.set(860, 20);
  container.addChild(btnContainer);

  const baseActions = (vita.proto.actions.struct ? vita.proto.actions.struct : vita.proto.actions) as ActionStruct;
  let _index = 0;
  for (const state in baseActions) {
    const name = StateController.stateNameMap[state as unknown as number];
    const btn = new TextButton(name, 0, _index++ * 40, {}, 100);
    btnContainer.addChild(btn);
    btn.on('pointertap', () => {
      storage.targetState = Number(state);
      reload();
    });
  }

  world.once('time_1', e => {
    world.running = false;
    renderTime(storage.time);
    timeInput.value = storage.time + '';
  });

  timeInput.oninput = () => {
    const time = timeInput.valueAsNumber || 0;
    renderTime(time);
    storage.time = time;
  }

  function renderTime(time: number) {
    updateState(time);
    vita.time = time;
    vita.viewController.onRender();
  }

  // @ts-ignore
  window.vita = vita;
  vita.x = 200;
  vita.y = 300;

  vita.viewController.insertAction(skillRole0_4Action.standard.emit);

  vita.land(world);

  function reload() {
    location.reload();
  }

  const action = baseActions[storage.targetState];
  const standard = vita.viewController.baseAction[storage.targetState];
  console.log(action);
  console.log(standard);


}