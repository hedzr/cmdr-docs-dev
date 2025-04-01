---
title: "deepdiff"
description: "Diff deeply"
---

## Usages

### deepdiff

`DeepDiff` can deeply print the differences about two objects.

```go
delta, equal := evendeep.DeepDiff([]int{3, 0, 9}, []int{9, 3, 0}, diff.WithSliceOrderedComparison(true))
t.Logf("delta: %v", delta) // ""

delta, equal := evendeep.DeepDiff([]int{3, 0}, []int{9, 3, 0}, diff.WithSliceOrderedComparison(true))
t.Logf("delta: %v", delta) // "added: [0] = 9\n"

delta, equal := evendeep.DeepDiff([]int{3, 0}, []int{9, 3, 0})
t.Logf("delta: %v", delta)
// Outputs:
//   added: [2] = <zero>
//   modified: [0] = 9 (int) (Old: 3)
//   modified: [1] = 3 (int) (Old: <zero>)

```

`DeepDiff` is a rewrote version
upon [d4l3k/messagediff]([d4l3k/messagediff at v1.2.1 (github.com)](https://github.com/d4l3k/messagediff)). This new
code enables user-defined comparer for you.

#### Ignored Names

[`diff.WithIgnoredFields(names...)`](https://github.com/hedzr/evendeep/blob/master/diff/diff.go#L41) can give a list of
names which should be ignored when comparing.

#### Slice-Order Insensitive

In normal mode, `diff` is slice-order-sensitive, that means, `[1, 2] != [2, 1]`
. [`WithSliceOrderedComparison(b bool)`](https://github.com/hedzr/evendeep/blob/master/diff/diff.go#L41) can unmind the
differences of order and as an equal.

#### Customizing Comparer

For example, `evendeep` ships a `timeComparer`:

```go
type timeComparer struct{}

func (c *timeComparer) Match(typ reflect.Type) bool {
  return typ.String() == "time.Time"
}

func (c *timeComparer) Equal(ctx Context, lhs, rhs reflect.Value, path Path) (equal bool) {
  aTime := lhs.Interface().(time.Time)
  bTime := rhs.Interface().(time.Time)
  if equal = aTime.Equal(bTime); !equal {
    ctx.PutModified(ctx.PutPath(path), Update{Old: aTime.String(), New: bTime.String(), Typ: typfmtlite(&lhs)})
  }
  return
}
```

And it has been initialized into diff info struct. `timeComparer` provides a semantic comparing for `time.Time` objects.

To enable your comparer,
use [`diff.WithComparer(comparer)`](https://github.com/hedzr/evendeep/blob/master/diff/diff.go#L65).
