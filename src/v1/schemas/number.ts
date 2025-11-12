import { RyuSchema } from "../index.js";
import type { RyuError } from "../type.js";

type RyuNumSchemaState = "empty" | "positive" | "negative";

// Base structure for the methods if the state allow it
type PositiveMethod<State extends RyuNumSchemaState> = State extends "negative"
  ? never
  : (errorMsg?: string) => RyuNum<"positive">;
type NegativeMethod<State extends RyuNumSchemaState> = State extends "positive"
  ? never
  : (errorMsg?: string) => RyuNum<"negative">;

export class RyuNum<State extends RyuNumSchemaState = "empty"> extends RyuSchema<number> {
  _isRootPrimitive = true;

  private constraintType?: "positive" | "negative";
  private _min?: { val?: number; errorMsg: string; };
  private _max?: { val?: number; errorMsg: string; };
  private _positive?: { val?: boolean; errorMsg: string; };
  private _negative?: { val?: boolean; errorMsg: string };

  // Compile time type signatures

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
  positive!: PositiveMethod<State>;
  /**
    * Ensures the number is negative (< 0).
    *
    * @param errorMsg - Optional custom error message.
    * @returns The current instance of `RyuNum` for chaining.
    *
    * @example
    * ```ts
    * const schema = ryu.number().negative();
    * schema.parse(5); // Error: Should be negative
    * schema.parse(-10); // -10
    * ```
    */
  negative!: NegativeMethod<State>;

  constructor() {
    super();
    Object.assign(this, {
      positive: this._positiveImpl,
      negative: this._negativeImpl,
    });
  };

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

  private _positiveImpl(errorMsg?: string): RyuNum<"positive"> {
    if (this.constraintType === "negative")
      throw { code: 2, message: "Cannot use positive() when negative() has already been set", path: [], stack: new Error().stack } as RyuError;
    this.constraintType = "positive";

    if (!this._positive) this._positive = { errorMsg: "" };

    this._positive.val = true;
    errorMsg
      ? this._positive.errorMsg = errorMsg
      : this._positive.errorMsg = "Should be positive";

    return this as RyuNum<"positive">;
  };

  private _negativeImpl(errorMsg?: string): RyuNum<"negative"> {
    if (this.constraintType === "positive")
      throw { code: 2, message: "Cannot use negative() when positive() has already been set", path: [], stack: new Error().stack } as RyuError;
    this.constraintType = "negative";
    if (!this._negative) this._negative = { errorMsg: "" };

    this._negative.val = true;
    errorMsg
      ? this._negative.errorMsg = errorMsg
      : this._negative.errorMsg = "Should be positive";

    return this as RyuNum<"negative">;
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
    if (this._negative && data >= 0)
      throw { code: 1, message: this._negative.errorMsg, path, stack: new Error().stack } as RyuError;

    return data;
  }
};
