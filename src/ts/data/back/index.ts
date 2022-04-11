import { generateData } from "../generateData";
import { BackProto } from "./Proto";

export const BackProtos: BackProto[] = generateData(import.meta.globEager('./data/*'));