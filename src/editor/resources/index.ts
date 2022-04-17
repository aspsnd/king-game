import { Loader } from "pixi.js";
import { backs, grounds, monsts, statics } from "../../ts/resources/list";

export const loadAllResources = () => {
  const resources: string[] = [];

  resources.push(...statics.map(v => `/packed-resources/${v}.json`));

  for (const back in backs) {
    resources.push(`/packed-resources/${backs[back]}`);
  }

  for (const ground in grounds) {
    resources.push(`/packed-resources/${grounds[ground]}`);
  }

  for (const value of Object.values(monsts)) {
    resources.push(...value.map(v => `/packed-resources/${v}.json`));
  }

  return new Promise(resolve => {
    Loader.shared.add(resources).load(resolve);
  })
}