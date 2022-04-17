import { ActionData, ActionStruct } from "../ts/anxi/controller/view/action";
import { StateCache } from "../ts/core/controller/state/StateCache";
import { ImmediateStorager } from "./storage";

interface EditorStorage {
  targetEdit: 'role' | 'monst',
  targetEditId: number
  targetState: number
  time: number
  actionData?: ActionStruct
}


export const storage = new ImmediateStorager<EditorStorage>('parallel:editor', {
  targetEdit: 'role',
  targetEditId: 0,
  targetState: StateCache.common,
  time: 0,
  actionData: undefined
})