# binary-heap

A minimal binary min-heap for JavaScript. `peek()` is O(1); `push()` and `pop()` are O(log n). Backed by a flat array; no nodes, no pointers, no dependencies.

## Usage

```js
import { Heap } from 'binary-heap';

const h = new Heap();           // numbers, ascending
h.push(5).push(1).push(3);
h.peek();                       // 1
h.pop();                         // 1

// Max-heap by passing a comparator:
const max = new Heap((a, b) => b - a);
max.push(5).push(1).push(9);
max.pop();                      // 9
```

Exports:
- `Heap` — the class. Constructor takes an optional `(a, b) => number` comparator.
- `defaultCompare(a, b)` — ascending numeric/lexicographic comparator, used when none is given.

Methods: `push(v)` (chainable), `pop()` (returns `undefined` when empty), `peek()`, `clear()`, and a `[Symbol.iterator]` that drains the heap in sorted order (mutating it as it goes).

## Why

When you need repeated smallest-element extraction, a binary heap is the boring, correct answer: simpler than a Fibonacci heap, faster than a sorted array for mixed insert/remove workloads. This library is the smallest version of that — a single class, a flat array, a comparator. Use it for scheduling, priority queues, or any "give me the next minimum" loop where you don't want to reach for a full data-structure package.

## Edge to know about

`pop()` and `peek()` return `undefined` on an empty heap rather than throwing. If `undefined` is a legitimate element in your heap, distinguish empty-state with `size === 0` instead of checking the return value. The comparator must be a total order over the values you store; a comparator that returns `0` for unequal values will not deduplicate — both stay in the heap.
