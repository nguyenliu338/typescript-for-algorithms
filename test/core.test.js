import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Heap, defaultCompare } from '../src/index.js';

test('push then pop returns in ascending order', () => {
  const h = new Heap();
  for (const v of [5, 3, 8, 1, 9, 2, 7, 4, 6, 0]) h.push(v);
  const out = [];
  while (h.size > 0) out.push(h.pop());
  assert.deepEqual(out, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('peek is O(1) and does not remove', () => {
  const h = new Heap();
  h.push(5).push(3).push(8);
  assert.equal(h.peek(), 3);
  assert.equal(h.size, 3);
  assert.equal(h.peek(), 3);
});

test('peek on empty heap returns undefined', () => {
  const h = new Heap();
  assert.equal(h.peek(), undefined);
});

test('pop on empty heap returns undefined', () => {
  const h = new Heap();
  assert.equal(h.pop(), undefined);
  assert.equal(h.size, 0);
});

test('push and pop on single element', () => {
  const h = new Heap();
  h.push(42);
  assert.equal(h.peek(), 42);
  assert.equal(h.pop(), 42);
  assert.equal(h.size, 0);
  assert.equal(h.pop(), undefined);
});

test('duplicate values are preserved', () => {
  const h = new Heap();
  for (const v of [4, 4, 4, 1, 1, 9]) h.push(v);
  const out = [];
  while (h.size > 0) out.push(h.pop());
  assert.deepEqual(out, [1, 1, 4, 4, 4, 9]);
});

test('custom comparator turns it into a max-heap', () => {
  const h = new Heap((a, b) => b - a);
  for (const v of [5, 1, 9, 3]) h.push(v);
  const out = [];
  while (h.size > 0) out.push(h.pop());
  assert.deepEqual(out, [9, 5, 3, 1]);
});

test('objects ordered by a key via comparator', () => {
  const h = new Heap((a, b) => a.priority - b.priority);
  h.push({ priority: 5, name: 'a' });
  h.push({ priority: 1, name: 'b' });
  h.push({ priority: 3, name: 'c' });
  assert.equal(h.peek().name, 'b');
  assert.equal(h.pop().name, 'b');
  assert.equal(h.pop().name, 'c');
  assert.equal(h.pop().name, 'a');
});

test('interleaved push and pop keeps invariant', () => {
  const h = new Heap();
  h.push(7); h.push(2); h.push(9);
  assert.equal(h.pop(), 2);
  h.push(1); h.push(5);
  assert.equal(h.pop(), 1);
  assert.equal(h.pop(), 5);
  assert.equal(h.pop(), 7);
  assert.equal(h.pop(), 9);
  assert.equal(h.pop(), undefined);
});

test('clear empties the heap', () => {
  const h = new Heap();
  h.push(1).push(2).push(3);
  h.clear();
  assert.equal(h.size, 0);
  assert.equal(h.peek(), undefined);
  assert.equal(h.pop(), undefined);
  h.push(10);
  assert.equal(h.peek(), 10);
});

test('iterator drains in sorted order', () => {
  const h = new Heap();
  for (const v of [5, 1, 3, 2, 4]) h.push(v);
  const out = [...h];
  assert.deepEqual(out, [1, 2, 3, 4, 5]);
  assert.equal(h.size, 0);
});

test('defaultCompare orders numbers ascending', () => {
  assert.equal(defaultCompare(1, 2), -1);
  assert.equal(defaultCompare(2, 1), 1);
  assert.equal(defaultCompare(3, 3), 0);
});

test('defaultCompare orders strings lexicographically', () => {
  assert.equal(defaultCompare('a', 'b'), -1);
  assert.equal(defaultCompare('b', 'a'), 1);
  assert.equal(defaultCompare('x', 'x'), 0);
});

test('heap maintains invariant after many random-shaped operations', () => {
  const h = new Heap();
  const ops = [
    'push', 3, 'push', 1, 'pop', 'push', 4, 'push', 1,
    'pop', 'push', 2, 'pop', 'pop', 'pop', 'pop', 'push', 5, 'pop',
  ];
  const out = [];
  for (let i = 0; i < ops.length; i++) {
    if (ops[i] === 'push') h.push(ops[++i]);
    else out.push(h.pop());
  }
  assert.deepEqual(out, [1, 1, 2, 3, 4, undefined, 5]);
});

test('does not mutate pushed values array identity semantics', () => {
  const h = new Heap();
  const obj = { p: 1 };
  h.push(obj);
  assert.equal(h.pop(), obj);
});
