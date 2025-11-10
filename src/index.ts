import { RyuNum, RyuString } from "./v1/schema";
import { RyuObj } from "./v1/schemas/object";

export const ryu = {
  string: () => new RyuString(),
  number: () => new RyuNum(),
  object: <T extends Record<string, any>>(shape: T) => new RyuObj(shape),
};
