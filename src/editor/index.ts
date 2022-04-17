import { Application } from "pixi.js"
import { loadAllResources } from "./resources";

window.onload = async () => {
  const app = new Application({
    view: appCanvas
  });
  

  await loadAllResources();
}