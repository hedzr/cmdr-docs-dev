---
title: "deepequal"
description: "Equal test deeply"
---

## Usages

### deepequal

Our `DeepEqual` is shortcut to `DeepDiff`:

```go
equal := evendeep.DeepEqual([]int{3, 0, 9}, []int{9, 3, 0}, diff.WithSliceOrderedComparison(true))
if !equal {
  t.Errorf("expecting equal = true but got false")
}
```

For the unhandled types and objects, DeepEqual and DeepDiff will fallback to `reflect.DeepEqual()`. It's no need to
call `reflect.DeepEqual` explicitly.
