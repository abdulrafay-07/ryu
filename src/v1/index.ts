import type { RyuError, RyuSafeParseResult } from "./type.js";

export abstract class RyuSchema<T> {
  protected _optional = false;

  protected abstract internalParse(data: unknown, path?: (string | number)[]): T;

  optional(): RyuSchema<T | undefined> {
    const clone = Object.create(this) as RyuSchema<T | undefined>;
    clone._optional = true;

    return clone;
  };

  parse(data?: unknown, path: (string | number)[] = []): T | undefined {
    if (this._optional && (data === undefined || data === null)) {
      return undefined;
    };

    return this.internalParse(data, path);
  };

  safeParse(data: unknown): RyuSafeParseResult<T> {
    try {
      const parsed = this.parse(
        data,
        (this as any)._isRootPrimitive ? ["value"]: [],
      );
      return {
        data: parsed ?? null,
        success: true,
        error: null,
      };
    } catch (err: any) {
      const error = err as RyuError;

      return {
        data: null,
        success: false,
        error: {
          code: 1,
          message: error?.message ?? "Unknown error",
          path: error?.path,
          stack: error.stack,
        },
      };
    };
  };
};
