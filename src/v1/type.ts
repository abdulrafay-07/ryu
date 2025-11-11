import type { RyuSchema } from "./index.js";

export type RyuError = {
  code: number;
  message: string;
  path?: (string | number)[];
  stack?: string;
};

export type RyuSafeParseResult<T> = {
  data: T | null;
  success: boolean;
  error: RyuError | null;
};

export type RyuInfer<T extends RyuSchema<any>> = T extends RyuSchema<infer U> ? U : never;
