import { RyuNum, RyuString, RyuObj, RyuSchema, RyuArr, RyuBool } from "./v1/schema.js";

export type { RyuInfer } from "./v1/type.js";

export const ryu = {
  string: () => new RyuString(),
  email: (errorMsg?: string) => new RyuString().email(errorMsg),
  url: (errorMsg?: string) => new RyuString().url(errorMsg),
  number: () => new RyuNum(),
  boolean: () => new RyuBool(),
  object: <T extends Record<string, RyuSchema<any>>>(shape: T): RyuObj<T> => new RyuObj(shape),
  array: <T extends RyuSchema<any>>(ryuSchema?: T, errorMsg?: string): RyuArr<T> => new RyuArr(ryuSchema, errorMsg),
};
