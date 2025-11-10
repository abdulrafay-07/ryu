import { RyuSchema } from "../index.js";

export class RyuNum extends RyuSchema<number> {
  private _min?: number;
  private _max?: number;
  private _positive?: boolean;

  min(len: number) {
    this._min = len;
    return this;
  };

  max(len: number) {
    this._max = len;
    return this;
  };

  positive() {
    this._positive = true;
    return this;
  };

  parse(data: unknown): number {
    if (typeof data !== "number") throw new Error("Expected number");
    if (this._min && data < this._min) throw new Error(`Too small (min ${this._min})`);
    if (this._max && data > this._max) throw new Error(`Too large (max ${this._max})`);
    if (this._positive && data < 0) throw new Error("Should be positive");

    return data;
  }
};
