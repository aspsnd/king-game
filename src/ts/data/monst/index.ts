import { MonstProto } from "../../core/chain/monst/Proto";
import { generateData } from "../generateData";

export const MonstProtos: MonstProto[] = generateData(import.meta.globEager('./data/**/'));