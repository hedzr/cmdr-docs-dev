---
title: "Guide"
description: "logg/slog logging library"
---


## Guide

### Basics

### Terminal and Cursor, Colors

`Cursor` 包含了常用的终端光标操作和彩色文字输出功能。

现在 `is/term/colors` 也支持光标位置报告功能，只要相应的终端设备支持。该功能是通过写入特定的转义码然后读取终端响应来实现的。

下面的示例程序包含了主要功能的展示，其中 `CursorGet()` 能够获得一个坐标位置，你需要缓存它然后再使用坐标位置。在 TUI 程序中有时候当前光标位置可能非常重要。

> 值得注意的是，`is/term` 下的功能并不向你提供直接编写 TUI app 的能力，我们的目的是在普通 app 中提供足够的终端操作支持，令你能够编写诸如彩色日志，进度条，选择项等简单组件，而非全屏幕操作。

`colors` 包经过历次迭代，现在也已经重写。除了传统的 `Translator` 支持解构简单 HTML 标记为彩色文字的能力之外，现在包含了 `Cursor`, `Color` 等新功能。

`Color` 类型现在从 `int` 变更为 `interface{ ... }`，因此所有的颜色（16 色或者真彩色等等）都可以用 `color.Color` 来代表，这对于你的组件编写会相当有用，你不再需要区别对待不同的终端支持能力，而是借助于 `Color` 来略过这些差异性。

```go
package main

import (
 "context"
 "fmt"

 "github.com/hedzr/is/term/color"
)

func main() { run1() }
func run1() {
 // start a color text builder
 var c = color.New()
 var pos color.CursorPos
 ctx := context.Background() // or with cancel

 // paint and get the result (with ansi-color-seq ready)
 var result = c.Println().
  Color16(color.FgRed).Printf("[1st] hello, %s.", "world").
  Println().
  SavePosNow().
  Println("XX").
  Color16(color.FgGreen).Printf("hello, %s.\n", "world").
  Color256(160).Printf("[160] hello, %s.\n", "world").
  Color256(161).Printf("[161] hello, %s.\n", "world").
  Color256(162).Printf("[162] hello, %s.\n", "world").
  Color256(163).Printf("[163] hello, %s.\n", "world").
  Color256(164).Printf("[164] hello, %s.\n", "world").
  Color256(165).Printf("[165] hello, %s.\n", "world").
  UpNow(4).Echo(" ERASED ").
  RightNow(11).
  CursorGet(ctx, &pos).
  RGB(211, 211, 33).Printf("[16m] hello, %s. pos=%+v", "world", pos).
  Println().
  RestorePosNow().
  Println("ZZ").
  DownNow(8).
  Println("DONE").
  Build()

  // and render the result
 fmt.Println(result)

 // another colorful builfer
 c = color.New()
 fmt.Println(c.Color16(color.FgRed).
  Printf("[2nd] hello, %s.", "world").Println().Build())

 // cursor operations
 c = color.New()
 c.SavePosNow()
 // fmt.Println(c.CursorSavePos().Build())

 fmt.Print(c.
  Printf("[3rd] hello, %s.", "world").
  Println().
  Color256(163).Printf("[163] hello, %s.\n", "world").
  Color256(164).Printf("[164] hello, %s.\n", "world").
  Color256(165).Printf("[165] hello, %s.\n", "world").
  Build())

 fmt.Print("0")         // now, col = 1
 c.UpNow(2)             //
 fmt.Print("ABC")       // embedded "ABC" into "[]"
 c.CursorGet(ctx, &pos) //
 c.RightNow(2)          // to be overwrite "hello"
 fmt.Print("HELLO")     //

 c.RestorePosNow()
 c.DownNow(1)
 fmt.Print("T") // write "T" to beginning of "[163]" line

 c.DownNow(4)

 // color.Down(4)
 // color.Left(1)
 fmt.Printf("\nEND (pos = %+v)\n", pos)
}
```
