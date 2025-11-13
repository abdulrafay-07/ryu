# 🌸 Ryu — A Lightweight Type-Safe Schema Validator

Ryu is a minimal, type-safe validation library inspired by [Zod](https://zod.dev/), built purely for learning and experimentation.

It lets you define schemas for your data, validate inputs, and infer TypeScript types — perfect for Node, Bun, and modern TypeScript projects.

---

## Installation

```bash
bun add ryu-ts
# or
npm install ryu-ts
# or
pnpm add ryu-ts
```

## Quick Start

```ts
import { ryu } from "ryu-ts";

const schema = ryu.object({
  name: ryu.string().min(3),
  age: ryu.number().positive(),
  active: ryu.boolean(),
});

const result = schema.parse({
  name: "Ryu",
  age: 22,
  active: true,
});

console.log(result);
// { name: "Ryu", age: 22, active: true }
```

## Supported Schemas

Ryu supports primitives, arrays, and objects, each with rich validation methods.

1. `ryu.string()`

String validation with multiple constraints:

```ts
const s1 = ryu.string().min(3).max(10);
const s2 = ryu.string().length(5);
const s3 = ryu.string().includes("abc");
const s4 = ryu.string().startsWith("Ryu");
const s5 = ryu.string().endsWith(".js");
const s6 = ryu.string().email();
const s7 = ryu.string().url();
```

**Examples**

```ts
ryu.string().min(3).parse("Hi");
// Error: String must have 3 characters

ryu.string().email().parse("hello@domain.com");
// "hello@domain.com"

ryu.string().url().parse("https://example.com");
// "https://example.com"
```

2. `ryu.number()`

Number validation with range and sign constraints:

```ts
const n1 = ryu.number().min(3);
const n2 = ryu.number().max(10);
const n3 = ryu.number().positive();
const n4 = ryu.number().negative();
```

**Examples**

```ts
ryu.number().min(5).max(10).parse(7);
// 7

ryu.number().positive().parse(-3);
// Error: Should be positive
```

3. `ryu.boolean()`

Boolean validation with optional truth constraints:

```ts
const b1 = ryu.boolean();
const b2 = ryu.boolean().true();
const b3 = ryu.boolean().false();
```

**Examples**

```ts
ryu.boolean().true().parse(true);
// true

ryu.boolean().true().parse(false);
// Error: Should be true
```

4. `ryu.object()`

Define structured objects composed of other Ryu schemas.

```ts
const userSchema = ryu.object({
  name: ryu.string().min(2),
  age: ryu.number().positive(),
  email: ryu.string().email(),
});

userSchema.parse({
  name: "Ryu",
  age: 21,
  email: "ryu@example.com",
});
// { name: "Ryu", age: 21, email: "ryu@example.com" }
```

5. `ryu.array()`

Define arrays containing a specific type:

```ts
const arr = ryu.array(ryu.number());
arr.parse([1, 2, 3]); // [1, 2, 3]
arr.parse(["x", "y"]); // Error: Expected number
```

## Safe Parsing

Use .safeParse() to catch errors instead of throwing them:

```ts
const result = ryu.string().min(3).safeParse("Hi");

if (!result.success) {
  console.error(result.error.message);
} else {
  console.log(result.data);
};
```

**Output**

```bash
String must have 3 characters
```

## Type Inference

Infer TypeScript types directly from your schemas using RyuInfer.

```ts
import { ryu, type RyuInfer } from "ryu-ts";

const schema = ryu.object({
  name: ryu.string(),
  age: ryu.number(),
});

type User = RyuInfer<typeof schema>;
// Equivalent to:
// type User = { name: string; age: number }
```

## Error Handling

Ryu throws rich error objects with path and stack info for nested validations:

```ts
try {
  ryu.object({
    info: ryu.object({
      email: ryu.string().email(),
    }),
  }).parse({
    info: { email: "notanemail" },
  });
} catch (err) {
  console.error(err);
};
```

**Output**

```bash
{
  code: 1,
  message: "Invalid email",
  path: ["info", "email"],
  stack: "Error stack trace..."
}
```

### Inspiration

Ryu is heavily inspired by [Zod](https://zod.dev/)

It’s made as a learning experiment, but it’s fast, functional, and fun to use.
