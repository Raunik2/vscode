type Item = {
  weight: number;
  value: number;
};
type Specification = {
  maximumWeight: number;
  items: Item[];
};
type Result = [maxValue: number, select: () => Item[]];
const hasOwnProperty = Object.prototype.hasOwnProperty;
function knapsack({ maximumWeight, items }: Specification): Result {
  const maxItemIndex = items.length - 1;
  const totalCapacity = maximumWeight;
  const memo: number[] = [];
  return [value(maxItemIndex, totalCapacity), select];
  function value(itemIndex: number, capacity: number): number {
    if (itemIndex < 0 || capacity <= 0) return 0;
    const key = totalCapacity * itemIndex + (capacity - 1);
    if (hasOwnProperty.call(memo, key)) return memo[key];
    return (memo[key] = calculateValue(itemIndex, capacity));
  }
  function calculateValue(itemIndex: number, capacity: number): number {
    const { weight: itemCost, value: itemValue } = items[itemIndex];
    const vPrevious = value(itemIndex - 1, capacity);
    if (itemCost > capacity) return vPrevious;
    const vCombined = value(itemIndex - 1, capacity - itemCost) + itemValue;
    return vCombined > vPrevious ? vCombined : vPrevious;
  }
  function select(): Item[] {
    const bag: Item[] = [];
    for (let i = maxItemIndex, capacity = totalCapacity; i >= 0; i -= 1) {
      if (value(i, capacity) <= value(i - 1, capacity)) continue;
      const item = items[i];
      capacity -= item.weight;
      bag.push(item);
    }
    return bag;
  }
}
const maximumValue: (s: Specification) => number = (spec) => knapsack(spec)[0];
export { knapsack, maximumValue };
// -------------------------------------------------------
// Show your work:
//
// This solution is based on the "0-1 knapsack problem"
// discussion found at:
//
//     https://en.wikipedia.org/wiki/Knapsack_problem#0-1_knapsack_problem
//
// The `Item` type holds an item's `weight`
// (the "cost") and its `value` (to offset
// the "cost").
//
// The `Specification` type aggregates the input
// information for the `knapsack()` (and by extension
// `maximumValue()`) function. `maximumWeight` reflects
// the capacity (or constraint) while `items` can
// hold multiple items of value that consume
// that capacity. The objective is to optimize
// the value gained within the constraint by choosing
// the best items.
//
// The `Result` type respresents `knapsack()`'s
// return type. The tuple's (pair's) first element
// is the maximum value that can be achieved with
// the specified `maximumWeight`, the second
// element is a (`select()`) function that selects
// items that will yield that value and returns
// them in an array.
//
// The `hasOwnProperty` function is simply a
// direct reference to
// `Object.prototype.hasOwnProperty` which is
// used together with `Function.prototype.call()`
// to satisfy the ESLint `no-prototype-builtins`
// rule:
//     https://eslint.org/docs/rules/no-prototype-builtins
//
// The `knapsack()` function returns a `Result` tuple
// with the maximum value and a solution selection
// function for achieving that particular value for
// the `Specification` passed to it.
//
// - there are `n` `items` to choose from indexed
//   from `0` to `maxItemIndex`.
// - the `totalCapacity` (`maximumWeight`) is
//   broken down into `unit` increments from
//   `capacity` `1` up to `totalCapacity`.
//
// This yields an (imaginary) matrix of
// `n` rows (one for each item) each
// with `totalCapacity` slots (note that
// the `capacity` `1` slot is at index `0`
// for that particular row).
//
// Each "slot" holds the maximum value that
// can be achieved at that "capacity level"
// which may or may not include *that* item `i`.
//
// (Capacity level `0` is uninteresting as it
// will always yield `0` value - hence the
// shifted index).
//
// We are attempting to find
// `value(maxItemIndex, totalCapacity)` — the best
// value that can be achieved given these `n` items
// and a limited `totalCapacity`.
//
// The `value()` function determines these
// (matrix) values for the specific `Specification`
// value within its closure. The `value()` function
// also uses the `memo` array to memioze any previously
// calculated values. `memo` is used as a
// sparse array:
//     https://remysharp.com/2018/06/26/an-adventure-in-sparse-arrays
//
//     https://2ality.com/2015/09/holes-arrays-es6.html
//
// i.e. it will have more "holes" than values.
// `memo` is kept as a single dimension array so it
// is necessary to convert the two indices to a
// single one:
// - `itemIndex` varies from `0` to `maxItemIndex`.
// - `capacity` varies from `1` to `totalCapacity`,
//   i.e. there are `totalCapacity` slots in each
//   "row" with indices varying from
//   `0` to `totalCapacity - 1`;
//    i.e. we need `(capacity - 1)`, not `capacity`.
//
// leading to:
//
//     const key = totalCapacity * itemIndex + (capacity - 1);
//
// for the `key` the `memo[itemIndex, capacity]` value.
//
// Returning zero on `itemIndex < 0` means we can
// be sloppy with our `value(itemIndex - 1, capacity)`
// calls when `itemIndex` is already `0`.
// And `capacity <= 0` will always yield a "value" of zero.
//
// `hasOwnProperty.call(memo, key)` is used to
// determine whether `memo[key]` is a "value"
// or a "hole". If it's a "value" the memoized
// value is returned.
// Otherwise `calculateValue()` is invoked to
// determine the value which is then memoized
// and returned.
//
// `calculateValue()` references `items[itemIndex]` to
// determine the current item's cost and value.
// `vPrevious` is the value at the current
// `capacity` level considering the previous item.
//
// If the current item's cost exceeds the current
// `capacity` level then the value remains the
// same as before (`vPrevious`).
//
// Otherwise the value at the *remaining*
// capacity level (`capacity - itemCost`)
// for the previous item is added to the current
// item's value (`vCombined`) to become the best
// value at the current capacity level,
// provided it exceeds `vPrevious`.
//
// Note obtaining `vPrevious` and `vCombined`
// involve mutual recursion with the
// `value()` function.
//
// The `select` function performs the additional
// work of "selecting" `items` that will
// yield the maximum value.
//
// It iterates through the items in reverse
// only choosing an item when its value
// exceeds the upcoming item (i.e. value
// is a larger `vCombined` instead of a `vPrevious`).
// Whenever an item is chosen the `capacity`
// is reduced by the item's cost - the remaining
// item(s) have to fit inside that remainder.
//
// The `select()` functionality was delayed from
// the other `knapsack()` work so that its
// performance cost is only incurred when it
// is actually required - and in the case of the
// `maximumValue` function it isn't required.
//
// The `maximumValue()` function delegates
// to the `knapsack()` function but discards
// the returned `select()` function,
// returning only the "maximum value"
// from the `Result`.
//
// References:
//
// Tuple Types
// https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types
//
// Labeled tuple Elements
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#labeled-tuple-elements
//
// Object.prototype.hasOwnProperty()
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
//
// Function.prototype.call()
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
//
// continue
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/continue
//
// -------------------------------------------------------
