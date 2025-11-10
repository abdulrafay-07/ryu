import { describe, expect, test } from "bun:test";

import { ryu } from "../../index.js";

describe("RyuString Schema", () => {
  // Basic behaviour
  test("Should return string when valid input is given", () => {
    const schema = ryu.string();
    expect(schema.parse("Hello")).toBe("Hello");
  });

  test("Should throw error when input is not a string", () => {
    const schema = ryu.string();
    expect(() => schema.parse(123)).toThrow("Expected string");
  });

  // min tests
  test("Should throw error if string shorter than min()", () => {
    const schema = ryu.string().min(5);
    expect(() => schema.parse("abc")).toThrow("String must have 5 characters");
  });

  test("Should pass when string meets min() length", () => {
    const schema = ryu.string().min(3);
    expect(schema.parse("abc")).toBe("abc");
  });

  test("Should use custom error message for min()", () => {
    const schema = ryu.string().min(5, "Too short!");
    expect(() => schema.parse("abc")).toThrow("Too short!");
  });

  // max tests
  test("Should throw error if string longer than max()", () => {
    const schema = ryu.string().max(3);
    expect(() => schema.parse("hello")).toThrow("String must be less than 3 characters");
  });

  test("Should pass when string within max() length", () => {
    const schema = ryu.string().max(10);
    expect(schema.parse("hello")).toBe("hello");
  });

  test("Should use custom error message for max()", () => {
    const schema = ryu.string().max(3, "Too long!");
    expect(() => schema.parse("hello")).toThrow("Too long!");
  });

  // length tests
  test("Should throw error if string length not equal to length()", () => {
    const schema = ryu.string().length(4);
    expect(() => schema.parse("hi")).toThrow("String must contain 4 characters");
  });

  test("Should pass if string length matches length()", () => {
    const schema = ryu.string().length(3);
    expect(schema.parse("abc")).toBe("abc");
  });

  test("Should use custom error message for length()", () => {
    const schema = ryu.string().length(2, "Wrong length!");
    expect(() => schema.parse("abcd")).toThrow("Wrong length!");
  });

  // includes tests
  test("Should throw error if string does not include specified substring", () => {
    const schema = ryu.string().includes("abc");
    expect(() => schema.parse("xyz")).toThrow("String must include abc");
  });

  test("Should pass if string includes specified substring", () => {
    const schema = ryu.string().includes("abc");
    expect(schema.parse("xyzabcxyz")).toBe("xyzabcxyz");
  });

  test("Should use custom error message for includes()", () => {
    const schema = ryu.string().includes("abc", "Missing abc!");
    expect(() => schema.parse("xyz")).toThrow("Missing abc!");
  });

  // startsWith tests
  test("Should throw error if string does not start with specified substring", () => {
    const schema = ryu.string().startsWith("Hello");
    expect(() => schema.parse("WorldHello")).toThrow("String must start with Hello");
  });

  test("Should pass if string starts with specified substring", () => {
    const schema = ryu.string().startsWith("Hello");
    expect(schema.parse("HelloWorld")).toBe("HelloWorld");
  });

  test("Should use custom error message for startsWith()", () => {
    const schema = ryu.string().startsWith("Hi", "Must start with Hi!");
    expect(() => schema.parse("Hello")).toThrow("Must start with Hi!");
  });

  // endsWith tests
  test("Should throw error if string does not end with specified substring", () => {
    const schema = ryu.string().endsWith("World");
    expect(() => schema.parse("HelloWorlds")).toThrow("String must end with World");
  });

  test("Should pass if string ends with specified substring", () => {
    const schema = ryu.string().endsWith("World");
    expect(schema.parse("HelloWorld")).toBe("HelloWorld");
  });

  test("Should use custom error message for endsWith()", () => {
    const schema = ryu.string().endsWith("End", "Must end with End!");
    expect(() => schema.parse("Hello")).toThrow("Must end with End!");
  });

  // Constraints test
  test("Should throw when using min() after length()", () => {
    const schema = ryu.string().length(3);
    expect(() => (schema as any).min(2)).toThrow("Cannot use min() when a fixed length() has already been set.");
  });

  test("Should throw when using max() after length()", () => {
    const schema = ryu.string().length(3);
    expect(() => (schema as any).max(10)).toThrow("Cannot use max() when a fixed length() has already been set.");
  });

  test("Should throw when using length() after min()", () => {
    const schema = ryu.string().min(3);
    expect(() => (schema as any).length(5)).toThrow("Cannot use length() when min() or max() has already been set.");
  });

  test("Should throw when using length() after max()", () => {
    const schema = ryu.string().max(5);
    expect(() => (schema as any).length(3)).toThrow("Cannot use length() when min() or max() has already been set.");
  });

  // Combined Constraints
  test("Should enforce both min() and max()", () => {
    const schema = ryu.string().min(2).max(4);
    expect(() => schema.parse("a")).toThrow("String must have 2 characters");
    expect(() => schema.parse("abcde")).toThrow("String must be less than 4 characters");
    expect(schema.parse("abc")).toBe("abc");
  });

  test("Should enforce multiple string content constraints simultaneously", () => {
    const schema = ryu.string().includes("Ry").startsWith("R").endsWith("u");
    expect(() => schema.parse("ryu")).toThrow("String must include Ry");
    expect(() => schema.parse("Yu")).toThrow("String must include Ry");
    expect(() => schema.parse("Ry")).toThrow("String must end with u");
    expect(schema.parse("Ryu")).toBe("Ryu");
  });
});
