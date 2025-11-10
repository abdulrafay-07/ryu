# 🌸 Ryu — A Lightweight Type-Safe Schema Validator

Ryu is a minimal, type-safe validation library inspired by **Zod**, built for learning (literally). It allows you to define schemas for your data and validate inputs — perfect for Node, Bun, and modern TypeScript projects.

---

## Installation

```bash
bun add ryu
# or
npm install ryu
# or
pnpm add ryu
```

## Usage

```bash
import { ryu } from "ryu";

// Define a schema
const schema = ryu.object({
  name: ryu.string().min(3),
  age: ryu.number().positive(),
});

// Validate data
const result = schema.parse({
  name: "Rafay",
  age: 22,
});

console.log(result);
// => { name: "Rafay", age: 22 }
```

## Handling Validation Errors

```bash
schema.parse({ name: "Ra" });
// Error: String is too short (min 3)
```

## Inspiration

Ryu is heavily inspired by Zod, made for learning shenanigans for now.
