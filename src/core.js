/**
 * Binary min-heap backed by a flat array.
 *
 * Children of index i live at 2i+1 and 2i+2; parent at (i-1)/2.
 * Comparisons go through a user-supplied comparator so the same code path
 * serves as a min- or max-heap. The comparator is called with (a, b) and must
 * return a number; the element that compares as "less" is the one kept at the
 * root.
 */

/**
 * Default comparator: ascending numeric / lexicographic.
 *
 * Using a single, boring default keeps the common case predictable and lets
 * callers override only when they need a different ordering.
 *
 * @param {*} a
 * @param {*} b
 * @returns {number}
 */
export function defaultCompare(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/**
 * Binary heap. "front" is always the smallest element under the comparator.
 */
export class Heap {
  /**
   * @param {(a: *, b: *) => number} [compare] Returns <0 if a<b, >0 if a>b, 0 if equal.
   */
  constructor(compare = defaultCompare) {
    this._compare = compare;
    /** @type {*[]} */
    this._data = [];
  }

  /** Number of elements. */
  get size() {
    return this._data.length;
  }

  /**
   * Returns the front element without removing it, or `undefined` when empty.
   *
   * Returning undefined (rather than throwing) matches the behavior of
   * popping an empty Array and avoids forcing callers into try/catch.
   */
  peek() {
    return this._data[0];
  }

  /**
   * Insert a value. O(log n).
   *
   * Sift-up: swap the new element toward the root until it is no longer
   * smaller than its parent.
   *
   * @param {*} value
   * @returns {this} Chainable.
   */
  push(value) {
    const data = this._data;
    data.push(value);
    let i = data.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this._compare(data[i], data[parent]) < 0) {
        [data[i], data[parent]] = [data[parent], data[i]];
        i = parent;
      } else {
        break;
      }
    }
    return this;
  }

  /**
   * Remove and return the front element, or `undefined` if empty. O(log n).
   *
   * Sift-down: move the last element to the root, then swap it down into the
   * smaller child until the heap property is restored.
   */
  pop() {
    const data = this._data;
    if (data.length === 0) return undefined;
    const front = data[0];
    const last = data.pop();
    if (data.length > 0) {
      data[0] = last;
      let i = 0;
      const n = data.length;
      // Half-bound: the parent of the last index has at least a left child.
      while (true) {
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        let smallest = i;
        if (left < n && this._compare(data[left], data[smallest]) < 0) {
          smallest = left;
        }
        if (right < n && this._compare(data[right], data[smallest]) < 0) {
          smallest = right;
        }
        if (smallest === i) break;
        [data[i], data[smallest]] = [data[smallest], data[i]];
        i = smallest;
      }
    }
    return front;
  }

  /**
   * Drop all elements. O(1).
   *
   * Reassigning to a fresh array is O(1) for our purposes and avoids mutating
   * the old backing store if anyone else kept a reference.
   */
  clear() {
    this._data = [];
    return this;
  }

  /**
   * Optional helper: an iterator that drains the heap in sorted order.
   *
   * Implemented as a generator so callers can `for...of` without building an
   * intermediate array. Mutates the heap as it goes — do not resume after a
   * break unless you call clear() first.
   */
  *[Symbol.iterator]() {
    while (this._data.length > 0) {
      yield this.pop();
    }
  }
}
