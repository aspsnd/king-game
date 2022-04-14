import { Role } from "../../core/chain/role/Role";
import { Thing, ThingProto, ThingType } from "./ThingProto";

export interface MaterialProto extends ThingProto {
  kind: typeof ThingType.Material
  canUse: boolean
  useHandler(role: Role): void
}

export interface Material extends Thing {
  count: number
}