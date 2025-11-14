import { RyuSchema } from "../index.js";
import type { RyuError } from "../type.js";

type RyuBoolSchemaState = "empty" | "true" | "false";

// Base structure for the methods if the state allow it
type TrueMethod<State extends RyuBoolSchemaState> = State extends "false"
  ? never
  : (errorMsg?: string) => RyuBool<"true">;
type FalseMethod<State extends RyuBoolSchemaState> = State extends "true"
  ? never
  : (errorMsg?: string) => RyuBool<"false">;

export class RyuBool<State extends RyuBoolSchemaState = "empty"> extends RyuSchema<boolean> {
  _isRootPrimitive = true;

  private constraintType?: "true" | "false";
  private _true?: { errorMsg: string };
  private _false?: { errorMsg: string };

  /**
    * Ensures the boolean value is `true`.
    *
    * @param errorMsg - Optional custom error message.
    * @returns The current instance of `RyuBool` for chaining.
    *
    * @example
    * ```ts
    * const schema = ryu.boolean().true();
    * schema.parse(false); // Error: Should be true
    * schema.parse(true);  // true
    * ```
    */
  true!: TrueMethod<State>;
  /**
    * Ensures the boolean value is `false`.
    *
    * @param errorMsg - Optional custom error message.
    * @returns The current instance of `RyuBool` for chaining.
    *
    * @example
    * ```ts
    * const schema = ryu.boolean().false();
    * schema.parse(true);  // Error: Should be false
    * schema.parse(false); // false
    * ```
    */
  false!: FalseMethod<State>;

  constructor() {
    super();
    Object.assign(this, {
      true: this._trueImpl,
      false: this._falseImpl,
    });
  };

  private _trueImpl(errorMsg?: string): RyuBool<"true"> {
    if (this.constraintType === "false")
      throw { code: 2, message: "Cannot use true() when false() is already set", path: [], stack: new Error().stack } as RyuError;
    this.constraintType = "true";

    if (!this._true) this._true = { errorMsg: "" };

    this._true.errorMsg = errorMsg ?? "Should be true";

    return this as RyuBool<"true">;
  };

  private _falseImpl(errorMsg?: string): RyuBool<"false"> {
    if (this.constraintType === "true")
      throw { code: 2, message: "Cannot use false() when true() is already set", path: [], stack: new Error().stack } as RyuError;
    this.constraintType = "false";

    if (!this._false) this._false = { errorMsg: "" };

    this._false.errorMsg = errorMsg ?? "Should be false";

    return this as RyuBool<"false">;
  };

  /**
    * Validates the given value against all defined boolean constraints.
    *
    * @param data - The value to validate.
    * @param path - Optional path for nested object error tracking.
    * @returns The validated boolean value if all constraints pass.
    * @throws Will throw `RyuError` if:
    *   - The value is not a boolean.
    *   - The value violates `.true()` or `.false()` constraints.
    *
    * @example
    * ```ts
    * const schema = ryu.boolean().true();
    * schema.parse(true);  // true
    * schema.parse(false); // Error: Should be true
    * ```
    */
  internalParse(data: unknown, path: (string | number)[] = [ "value" ]): boolean {
    if (typeof data !== "boolean")
      throw { code: 1, message: "Expected boolean", path, stack: new Error().stack } as RyuError;
    if (this._true && data !== true)
      throw { code: 1, message: this._true.errorMsg, path, stack: new Error().stack } as RyuError;

    if (this._false && data !== false)
      throw { code: 1, message: this._false.errorMsg, path, stack: new Error().stack } as RyuError;

    return data;
  };
};
