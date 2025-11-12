import { RyuNum, RyuString, RyuObj, RyuSchema } from "./v1/schema.js";

export type { RyuInfer } from "./v1/type.js";

export const ryu = {
  string: () => new RyuString(),
  number: () => new RyuNum(),
  email: (errorMsg?: string) => new RyuString().email(errorMsg),
  url: (errorMsg?: string) => new RyuString().url(errorMsg),
  object: <T extends Record<string, RyuSchema<any>>>(shape: T): RyuObj<T> => new RyuObj(shape),
};
