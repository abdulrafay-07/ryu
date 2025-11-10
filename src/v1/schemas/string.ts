import { RyuSchema } from "../index.js";

type RyuStringSchemaState = "empty" | "rangeSet" | "lengthSet";

// Base structure for the methods if the state allow it
type MinMethod<State extends RyuStringSchemaState> = State extends "lengthSet"
  ? never
  : (len: number, errorMsg?: string) => RyuString<"rangeSet">;
type MaxMethod<State extends RyuStringSchemaState> = State extends "lengthSet"
  ? never
  : (len: number, errorMsg?: string) => RyuString<"rangeSet">;
type LengthMethod<State extends RyuStringSchemaState> = State extends "rangeSet"
  ? never
  : (len: number, errorMsg?: string) => RyuString<"lengthSet">;

export class RyuString<State extends RyuStringSchemaState = "empty"> extends RyuSchema<string> {
  private constraintType?: "range" | "length";
  private _min?: { val?: number; errorMsg: string; };
  private _max?: { val?: number; errorMsg: string; };
  private _length?: { val?: number; errorMsg: string; };
  private _includes?: { val?: string; errorMsg: string };

  // Compile time type signatures

  /**
    * Sets the **minimum length constraint** for the string.
    *
    * - Throws an error if `.length()` has already been called (mutually exclusive).
    * - Can be chained with `.max()` for defining ranges.
    *
    * @param len - The minimum allowed length for the string.
    * @param errorMsg - Optional custom error message if the constraint is violated.
    * @returns A new instance of `RyuString` with the constraint applied.
    *
    * @example
    * ```ts
    * const schema = ryu.string().min(3);
    * schema.parse("Hi"); // Error: String must have 3 characters
    * ```
    */
  min!: MinMethod<State>;
  /**
    * Sets the **maximum length constraint** for the string.
    *
    * - Throws an error if `.length()` has already been called (mutually exclusive).
    * - Can be chained with `.min()` for defining ranges.
    *
    * @param len - The maximum allowed length for the string.
    * @param errorMsg - Optional custom error message if the constraint is violated.
    * @returns A new instance of `RyuString` with the constraint applied.
    *
    * @example
    * ```ts
    * const schema = ryu.string().max(5);
    * schema.parse("HelloWorld"); // Error: String must be less than 5 characters
    * ```
    */
  max!: MaxMethod<State>;
  /**
    * Sets a **fixed length constraint** for the string.
    *
    * - Throws an error if `.min()` or `.max()` has already been called.
    * - Ensures the string length matches exactly the given value.
    *
    * @param len - The exact required string length.
    * @param errorMsg - Optional custom error message if the constraint is violated.
    * @returns A new instance of `RyuString` with the constraint applied.
    *
    * @example
    * ```ts
    * const schema = ryu.string().length(4);
    * schema.parse("Ryu"); // Error: String must contain 4 characters
    * ```
    */
  length!: LengthMethod<State>;

  constructor() {
    super();
    Object.assign(this, {
      min: this._minImpl,
      max: this._maxImpl,
      length: this._lengthImpl,
    });
  };

  private _minImpl(len: number, errorMsg?: string): RyuString<"rangeSet"> {
    if (this.constraintType === "length") throw new Error("Cannot use min() when a fixed length() has already been set.");
    this.constraintType = "range";

    if (!this._min) this._min = { errorMsg: "" };

    this._min.val = len;
    errorMsg
      ? this._min.errorMsg = errorMsg
      : this._min.errorMsg = `String must have ${this._min.val} characters`;

    return this as RyuString<"rangeSet">;
  };

  private _maxImpl(len: number, errorMsg?: string): RyuString<"rangeSet"> {
    if (this.constraintType === "length") throw new Error("Cannot use max() when a fixed length() has already been set.");
    this.constraintType = "range";

    if (!this._max) this._max = { errorMsg: "" };

    this._max.val = len;
    errorMsg
      ? this._max.errorMsg = errorMsg
      : this._max.errorMsg = `String must be less than ${this._max.val} characters`;

    return this as RyuString<"rangeSet">;
  };

  private _lengthImpl(len: number, errorMsg?: string): RyuString<"lengthSet"> {
    if (this.constraintType === "range") throw new Error("Cannot use length() when min() or max() has already been set.");
    this.constraintType = "length";

    if (!this._length) this._length = { errorMsg: "" };

    this._length.val = len;
    errorMsg
      ? this._length.errorMsg = errorMsg
      : this._length.errorMsg = `String must contain ${this._length.val} characters`;

    return this as RyuString<"lengthSet">;
  };

  /**
    * Adds a constraint that requires the string to **include** a specific substring.
    *
    * @param val - The substring that must be present within the string.
    * @param errorMsg - Optional custom error message if the substring is not found.
    * @returns The current instance of `RyuString` for chaining.
    *
    * @example
    * ```ts
    * const schema = ryu.string().includes("abc");
    * schema.parse("xyz"); // ❌ Error: String must include abc
    * ```
    */
  includes(val: string, errorMsg?: string) {
    if (!this._includes) this._includes = { errorMsg: "" };

    this._includes.val = val;
    errorMsg
      ? this._includes.errorMsg = errorMsg
      : this._includes.errorMsg = `String must include ${this._includes.val}`

    return this;
  };

  /**
    * Validates the provided input against all defined string constraints.
    *
    * - Checks that the input is a string.
    * - Verifies min, max, length, and includes constraints.
    * - Throws descriptive errors if validation fails.
    *
    * @param data - The value to validate.
    * @returns The validated string if all constraints pass.
    *
    * @throws Will throw an error if:
    * - The value is not a string.
    * - The length constraints fail.
    * - The `includes` constraint fails.
    *
    * @example
    * ```ts
    * const schema = ryu.string().min(3).includes("ry");
    * schema.parse("Ryu"); // ✅ "Ryu"
    * schema.parse("Yu"); // ❌ Error: String must include ry
    * ```
    */
  parse(data: unknown): string {
    if (typeof data !== "string") throw new Error("Expected string");
    if (this._min && data.length < this._min.val!) throw new Error(this._min.errorMsg);
    if (this._max && data.length > this._max.val!) throw new Error(this._max.errorMsg);
    if (this._length && data.length !== this._length.val) throw new Error(this._length.errorMsg);
    if (this._includes && !data.includes(this._includes.val!)) throw new Error(this._includes.errorMsg);

    return data;
  };
};
