import { Thing, ThingProto, ThingType } from "./ThingProto";

export interface ExtraProto extends ThingProto {
  kind: typeof ThingType.Extra
}

export interface Extra extends Thing {

}