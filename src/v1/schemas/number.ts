import { RyuSchema } from "../index.js";
import type { RyuError } from "../type.js";

export class RyuNum extends RyuSchema<number> {
  _isRootPrimitive = true;

  private _min?: { val?: number; errorMsg: string; };
  private _max?: { val?: number; errorMsg: string; };
  private _positive?: { val?: boolean; errorMsg: string; };

  /**
    * Sets a minimum value constraint for the number.
    *
    * @param len - The minimum allowed value.
    * @param errorMsg - Optional custom error message.
    * @returns The current instance of `RyuNum` for chaining.
    *
    * @example
    * ```ts
    * const schema = ryu.number().min(5);
    * schema.parse(3); // Error: Too small (min 5)
    * schema.parse(10); // 10
    * ```
    */
  min(len: number, errorMsg?: string) {
    if (!this._min) this._min = { errorMsg: "" };

    this._min.val = len;
    errorMsg
      ? this._min.errorMsg = errorMsg
      : this._min.errorMsg = `Too small (min ${this._min.val})`;

    return this;
  };

  /**
    * Sets a maximum value constraint for the number.
    *
    * @param len - The maximum allowed value.
    * @param errorMsg - Optional custom error message.
    * @returns The current instance of `RyuNum` for chaining.
    *
    * @example
    * ```ts
    * const schema = ryu.number().max(10);
    * schema.parse(15); // Error: Too large (max 10)
    * schema.parse(5);  // 5
    * ```
    */
  max(len: number, errorMsg?: string) {
    if (!this._max) this._max = { errorMsg: "" };

    this._max.val = len;
    errorMsg
      ? this._max.errorMsg = errorMsg
      : this._max.errorMsg = `Too large (max ${this._max.val})`;

    return this;
  };

  /**
    * Ensures the number is positive (> 0).
    *
    * @param errorMsg - Optional custom error message.
    * @returns The current instance of `RyuNum` for chaining.
    *
    * @example
    * ```ts
    * const schema = ryu.number().positive();
    * schema.parse(-5); // Error: Should be positive
    * schema.parse(10); // 10
    * ```
    */
  positive(errorMsg?: string) {
    if (!this._positive) this._positive = { errorMsg: "" };

    this._positive.val = true;
    errorMsg
      ? this._positive.errorMsg = errorMsg
      : this._positive.errorMsg = "Should be positive";

    return this;
  };

  /**
    * Validates the given value against all defined number constraints.
    *
    * @param data - The value to validate.
    * @param path - Optional path for nested object error tracking.
    * @returns The validated number if all constraints pass.
    * @throws Will throw `RyuError` if:
    *   - The value is not a number.
    *   - The value violates min, max, or positive constraints.
    *
    * @example
    * ```ts
    * const schema = ryu.number().min(3).max(10).positive();
    * schema.parse(5);  // 5
    * schema.parse(2);  // Error: Too small (min 3)
    * schema.parse(-4); // Error: Should be positive
    * ```
    */
  parse(data: unknown, path: (string | number)[] = [ "value" ]): number {
    if (typeof data !== "number")
      throw { code: 1, message: "Expected number", path, stack: new Error().stack } as RyuError;

    if (this._min && data < this._min.val!)
      throw { code: 1, message: this._min.errorMsg, path, stack: new Error().stack } as RyuError;
    if (this._max && data > this._max.val!)
      throw { code: 1, message: this._max.errorMsg, path, stack: new Error().stack } as RyuError;
    if (this._positive && data < 0)
      throw { code: 1, message: this._positive.errorMsg, path, stack: new Error().stack } as RyuError;

    return data;
  }
};
