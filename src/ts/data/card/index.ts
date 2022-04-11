import { generateData } from "../generateData";
import { CardData } from "./Proto";

export const CardDatas = generateData(import.meta.globEager('./data/*')) as CardData[];