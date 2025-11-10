import { RyuSchema } from "..";

export class RyuObj<T extends Record<string, RyuSchema<any>>> extends RyuSchema<
  { [K in keyof T]: ReturnType<T[K]["parse"]> }
> {
  constructor(private shape: T) {
    super();
  };

  parse(data: unknown) {
    if (typeof data !== "object" || !data) throw new Error("Expected object");

    const result: any = {};
    for (const key in this.shape) {
      const schema = this.shape[key];
      result[key] = schema?.parse((data as any)[key]);
    };

    return result;
  };
};
