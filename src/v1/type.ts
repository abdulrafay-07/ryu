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

// Helper to simplify/flatten intersection types
type Simplify<T> = T extends any[]
  ? T
  : { [K in keyof T]: T[K] };

// Helper to check if a value includes undefined
type IsUndefinedIncluded<T> = undefined extends T ? true : false;

// Recursive helper to make properties optional based on whether they include undefined
type MakeOptional<T> = T extends Record<string, any>
  ? T extends any[]
    ? T
    : Simplify<{
        [K in keyof T as IsUndefinedIncluded<T[K]> extends true ? K : never]?: MakeOptional<Exclude<T[K], undefined>>;
      } & {
        [K in keyof T as IsUndefinedIncluded<T[K]> extends true ? never : K]: MakeOptional<T[K]>;
      }>
  : T;

export type RyuInfer<T extends RyuSchema<any>> = T extends RyuSchema<infer U>
  ? MakeOptional<U>
  : never;
