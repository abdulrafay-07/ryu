import { RyuSchema } from "../index.js";
import type { RyuError } from "../type.js";

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
  _isRootPrimitive = true;

  private constraintType?: "range" | "length";
  private _min?: { val?: number; errorMsg: string; };
  private _max?: { val?: number; errorMsg: string; };
  private _length?: { val?: number; errorMsg: string; };
  private _includes?: { val?: string; errorMsg: string };
  private _startsWith?: { val?: string; errorMsg: string };
  private _endsWith?: { val?: string; errorMsg: string };
  private _email?: { regex: RegExp; errorMsg: string };
  private _url?: { regex: RegExp; errorMsg: string };

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
    if (this.constraintType === "length")
      throw { code: 2, message: "Cannot use min() when a fixed length() has already been set.", path: [], stack: new Error().stack } as RyuError;
    this.constraintType = "range";

    if (!this._min) this._min = { errorMsg: "" };

    this._min.val = len;
    errorMsg
      ? this._min.errorMsg = errorMsg
      : this._min.errorMsg = `String must have ${this._min.val} characters`;

    return this as RyuString<"rangeSet">;
  };

  private _maxImpl(len: number, errorMsg?: string): RyuString<"rangeSet"> {
    if (this.constraintType === "length")
      throw { code: 2, message: "Cannot use max() when a fixed length() has already been set.", path: [], stack: new Error().stack } as RyuError;
    this.constraintType = "range";

    if (!this._max) this._max = { errorMsg: "" };

    this._max.val = len;
    errorMsg
      ? this._max.errorMsg = errorMsg
      : this._max.errorMsg = `String must be less than ${this._max.val} characters`;

    return this as RyuString<"rangeSet">;
  };

  private _lengthImpl(len: number, errorMsg?: string): RyuString<"lengthSet"> {
    if (this.constraintType === "range")
      throw { code: 2, message: "Cannot use length() when min() or max() has already been set.", path: [], stack: new Error().stack } as RyuError;
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
      : this._includes.errorMsg = `String must include ${this._includes.val}`;

    return this;
  };

  /**
    * Adds a constraint that requires the string to **start with** a specific substring.
    *
    * @param val - The substring that the string must start with.
    * @param errorMsg - Optional custom error message if the string does not start with `val`.
    * @returns The current instance of `RyuString` for chaining.
    *
    * @example
    * ```ts
    * const schema = ryu.string().startsWith("Hello");
    * schema.parse("World"); // Error: String must start with Hello
    * ```
    */
  startsWith(val: string, errorMsg?: string) {
    if (!this._startsWith) this._startsWith = { errorMsg: "" };

    this._startsWith.val = val;
    errorMsg
      ? this._startsWith.errorMsg = errorMsg
      : this._startsWith.errorMsg = `String must start with ${this._startsWith.val}`;

    return this;
  };

  /**
    * Adds a constraint that requires the string to **end with** a specific substring.
    *
    * @param val - The substring that the string must end with.
    * @param errorMsg - Optional custom error message if the string does not end with `val`.
    * @returns The current instance of `RyuString` for chaining.
    *
    * @example
    * ```ts
    * const schema = ryu.string().endsWith("World");
    * schema.parse("Hello"); // Error: String must end with World
    * ```
    */
  endsWith(val: string, errorMsg?: string) {
    if (!this._endsWith) this._endsWith = { errorMsg: "" };

    this._endsWith.val = val;
    errorMsg
      ? this._endsWith.errorMsg = errorMsg
      : this._endsWith.errorMsg = `String must end with ${this._endsWith.val}`;

    return this;
  };

  email(errorMsg?: string) {
    this._email = {
      regex: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      errorMsg: errorMsg ?? "Invalid email",
    };

    return this;
  };

  url(errorMsg?: string) {
    this._url = {
      regex: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-./?%&=]*)?$/,
      errorMsg: errorMsg ?? "Invalid url",
    };

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
    * schema.parse("Ryu"); // "Ryu"
    * schema.parse("Yu"); // Error: String must include ry
    * ```
    */
  parse(data: unknown, path: (string | number)[] = ["value"]): string {
    if (typeof data !== "string")
      throw { code: 1, message: "Expected string", path, stack: new Error().stack } as RyuError;

    if (this._min && data.length < this._min.val!)
      throw { code: 1, message: this._min.errorMsg, path, stack: new Error().stack } as RyuError;
    if (this._max && data.length > this._max.val!)
      throw { code: 1, message: this._max.errorMsg, path, stack: new Error().stack } as RyuError;
    if (this._length && data.length !== this._length.val)
      throw { code: 1, message: this._length.errorMsg, path, stack: new Error().stack } as RyuError;
    if (this._includes && !data.includes(this._includes.val!))
      throw { code: 1, message: this._includes.errorMsg, path, stack: new Error().stack } as RyuError;
    if (this._startsWith && !data.startsWith(this._startsWith.val!))
      throw { code: 1, message: this._startsWith.errorMsg, path, stack: new Error().stack } as RyuError;
    if (this._endsWith && !data.endsWith(this._endsWith.val!))
      throw { code: 1, message: this._endsWith.errorMsg, path, stack: new Error().stack } as RyuError;
    if (this._email && !this._email.regex.test(data))
      throw { code: 1, message: this._email.errorMsg, path, stack: new Error().stack } as RyuError;
    if (this._url && !this._url.regex.test(data))
      throw { code: 1, message: this._url.errorMsg, path, stack: new Error().stack } as RyuError;

    return data;
  };
};
