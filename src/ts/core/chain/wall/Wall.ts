import { Quark } from "../../../anxi/chain/Quark";
import { WallProto } from "./Proto";

export class Wall extends Quark {
  constructor(readonly proto: WallProto) {
    super();
  }
}