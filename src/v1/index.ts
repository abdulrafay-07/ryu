import type { RyuError, RyuSafeParseResult } from "./type.js";

export abstract class RyuSchema<T> {
  abstract parse(data: unknown, path?: (string | number)[]): T;

  safeParse(data: unknown): RyuSafeParseResult<T> {
    try {
      const parsed = this.parse(
        data,
        (this as any)._isRootPrimitive ? ["value"]: [],
      );
      return {
        data: parsed,
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
