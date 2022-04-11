export function generateData(res: { [k: string]: { [k: string]: { index: number } } }): any[] {
  const result = [];
  for (const mod of Object.values(res)) {
    for (const proto of Object.values(mod)) {
      result[proto.index] = proto;
    }
  }
  return result;
}