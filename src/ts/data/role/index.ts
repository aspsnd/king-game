import type { RoleProto } from "../../core/chain/role/Proto";
import { generateData } from "../generateData";

export const RoleProtos: RoleProto[] = generateData(import.meta.globEager('./data/*'));
