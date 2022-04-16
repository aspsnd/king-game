import { generateData } from "../generateData";
import { EquipProto } from "./EquipProto";
import { ExtraProto } from "./ExtraProto";
import { MaterialProto } from "./MaterialProto";
import { Thing, ThingType } from "./ThingProto";

export const EquipProtos: EquipProto[] = generateData(import.meta.globEager('./data/equip/**/*'));

export const MaterialProtos: MaterialProto[] = generateData(import.meta.globEager('./data/material/**/*'));

export const ExtraProtos: ExtraProto[] = generateData(import.meta.globEager('./data/extra/**/*'));

export const ThingProtos = {
  [ThingType.Equip]: EquipProtos,
  [ThingType.Material]: MaterialProtos,
  [ThingType.Extra]: ExtraProtos
}

export const getProto = (thing: Thing) => {
  return ThingProtos[thing.kind][thing.index];
}