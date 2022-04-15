import { generateData } from "../generateData";
import { EquipProto } from "./EquipProto";
import { ExtraProto } from "./ExtraProto";
import { MaterialProto } from "./MaterialProto";

export const EquipProtos: EquipProto[] = generateData(import.meta.globEager('./data/equip/**/*'));

export const MaterialProtos: MaterialProto[] = generateData(import.meta.globEager('./data/material/**/*'));

export const ExtraProtos: ExtraProto[] = generateData(import.meta.globEager('./data/extra/**/*'));