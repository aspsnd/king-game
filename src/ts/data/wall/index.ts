import { WallProto } from "../../core/chain/wall/Proto";
import { generateData } from "../generateData";

export const WallProtos: WallProto[] = generateData(import.meta.globEager('./data/*'));
