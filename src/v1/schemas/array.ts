import { RyuSchema } from "../index.js";
import type { RyuError } from "../type.js";

export class RyuArr<T extends RyuSchema<any>> extends RyuSchema<
  Array<T extends RyuSchema<infer U> ? U : never>
> {
  private _ryuSchema?: T;
  private _errorMsg?: string;

  constructor(ryuSchema?: T, errorMsg?: string) {
    super();

    this._ryuSchema = ryuSchema;
    this._errorMsg = errorMsg ?? "Expected array";
  };

  internalParse(data: unknown, path: (string | number)[] = [ "value" ]) {
    if (!Array.isArray(data)) throw { code: 1, message: this._errorMsg, path, stack: new Error().stack } as RyuError;

    const result = data.map((v, i) => {
      try {
        return this._ryuSchema?.parse(v, [...path, i]);
      } catch (err: any) {
        if (!err.path) err.path = [...path, i];
        throw err;
      };
    });

    return result as Array<T extends RyuSchema<infer U> ? U : never>;
  };
};
