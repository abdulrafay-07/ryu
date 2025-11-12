import { RyuSchema } from "../index.js";
import type { RyuError } from "../type.js";

export class RyuObj<T extends Record<string, RyuSchema<any>>> extends RyuSchema<
  { [K in keyof T]: T[K] extends RyuSchema<infer U> ? U : never }
> {
  constructor(private shape: T) {
    super();
  };

  parse(data: unknown, path: (string | number)[] = []) {
    if (typeof data !== "object" || !data) throw { code: 1, message: "Expected object", path: [ "value" ], stack: new Error().stack } as RyuError;

    const result: any = {};
    for (const key in this.shape) {
      const schema = this.shape[key];
      try {
        // Add current key to path for this field
        result[key] = schema?.parse((data as any)[key], [...path, key]);
      } catch (err: any) {
        if (!err.path) err.path = [...path, key];
        throw err;
      };
    };

    return result as { [K in keyof T]: T[K] extends RyuSchema<infer U> ? U : never };
  };
};
