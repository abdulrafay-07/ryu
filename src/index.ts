import { RyuNum, RyuString, RyuObj } from "./v1/schema.js";

export const ryu = {
  string: () => new RyuString(),
  number: () => new RyuNum(),
  object: <T extends Record<string, any>>(shape: T) => new RyuObj(shape),
};
