import { SkillProto } from "../../anxi/controller/skill/proto";
import { generateDataInstance } from "../generateData";

export const SkillProtos: SkillProto[] = generateDataInstance(import.meta.globEager('./data/**/*'), SkillProto);