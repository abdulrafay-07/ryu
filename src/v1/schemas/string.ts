import { RyuSchema } from "..";

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

  // Declare the compile time type signatures
  min!: MinMethod<State>;
  max!: MaxMethod<State>;
  length!: LengthMethod<State>;

  constructor() {
    super();
    Object.assign(this, {
      min: this._minImpl,
      max: this._maxImpl,
      length: this._lengthImpl,
    });
  };

  /**
   * Sets the minimum length constraint for the string
   *
   * @param len - The minimum required length for the string
   * @param errorMsg - Optional custom error message to display if the constraint is violated.
   * @returns The current instance of RyuString to allow for method chaining.
   */
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

  /**
   * Sets the maximum length constraint for the string schema.
   *
   * @param len - The maximum allowed length for the string.
   * @param errorMsg - Optional custom error message to display if the constraint is violated.
   * @returns The current instance of RyuString to allow for method chaining.
   */
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

  parse(data: unknown): string {
    if (typeof data !== "string") throw new Error("Expected string");
    if (this._min && data.length < this._min.val!) throw new Error(this._min.errorMsg);
    if (this._max && data.length > this._max.val!) throw new Error(this._max.errorMsg);
    if (this._length && data.length !== this._length.val) throw new Error(this._length.errorMsg);

    return data;
  };
};
