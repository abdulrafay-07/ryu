import { RyuNum, RyuString } from "./v1/schema";

export const ryu = {
  string: () => new RyuString(),
  number: () => new RyuNum(),
};
