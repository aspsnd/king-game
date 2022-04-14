import { ValueOf } from "../../util/types";

export const BodyCache = {
  body: 0,
  head: 1,
  hand_l: 2,
  hand_r: 3,
  leg_l: 4,
  leg_r: 5,
  weapon: 6,
  wing: 7
} as const;

export type BodyCache = ValueOf<typeof BodyCache>;