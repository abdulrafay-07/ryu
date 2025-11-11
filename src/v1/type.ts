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
