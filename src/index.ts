import { RyuNum, RyuString, RyuObj, RyuSchema } from "./v1/schema.js";
import { RyuBool } from "./v1/schemas/boolean.js";

export type { RyuInfer } from "./v1/type.js";

export const ryu = {
  string: () => new RyuString(),
  email: (errorMsg?: string) => new RyuString().email(errorMsg),
  url: (errorMsg?: string) => new RyuString().url(errorMsg),
  number: () => new RyuNum(),
  boolean: () => new RyuBool(),
  object: <T extends Record<string, RyuSchema<any>>>(shape: T): RyuObj<T> => new RyuObj(shape),
};
