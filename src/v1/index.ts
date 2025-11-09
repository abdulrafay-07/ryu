export abstract class RyuSchema<T> {
  abstract parse(data: unknown): T;
};
