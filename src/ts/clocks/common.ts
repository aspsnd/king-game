import { ticker60 } from "./base/BaseTicker";
import { Clock } from "./base/Clock";

export const CommonClock = new Clock().injectInTicker(ticker60);