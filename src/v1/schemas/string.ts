import { RyuSchema } from "..";

export class RyuString extends RyuSchema<string> {
  private _min?: number;
  private _max?: number;

  min(len: number) {
    this._min = len;
    return this;
  };

  max(len: number) {
    this._max = len;
    return this;
  };

  parse(data: unknown): string {
    if (typeof data !== "string") throw new Error("Expected string");
    if (this._min && data.length < this._min) throw new Error(`String must have ${this._min} characters`);
    if (this._max && data.length > this._max) throw new Error(`String must be less than ${this._max} characters`);

    return data;
  };
};
