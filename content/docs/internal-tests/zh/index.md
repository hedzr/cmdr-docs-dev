---
title: "v1.x"
---

## 立即使用 `cmdr`

立即使用 [`cmdr`](https://github.com/hedzr/cmdr).

运行下面的微型示例程序：

```go
package main

import (
 "fmt"
 "github.com/hedzr/cmdr"
 "github.com/hedzr/cmdr/tool"
)

func main() {
 if err := cmdr.Exec(buildRootCmd()); err != nil {
  fmt.Printf("error: %+v\n", err)
 }
}

func buildRootCmd() (rootCmd *cmdr.RootCommand) {
 root := cmdr.
  Root("test-app", "1.1").
  Copyright("test-app is powered by cmdr", "hedzr").
  Description("desc", "longDesc").
  Examples("examples")
  //.Action(func(cmd *cmdr.Command, args []string) (err error) { return; )
 rootCmd = root.RootCommand()

 cmdr.NewBool(false).
  Titles("enable-ueh", "ueh").
  EnvKeys("ENABLE_UEH").
  Description("Enables the unhandled exception handler?").
  AttachTo(root)

 cmdr.NewCmd().
  Titles("soundex", "snd", "sndx", "sound").
  Description("soundex test").
  Group("Test").
  TailPlaceholder("[text1, text2, ...]").
  Action(func(cmd *cmdr.Command, args []string) (err error) {
   for ix, s := range args {
    fmt.Printf("%5d. %s => %s\n", ix, s, tool.Soundex(s))
   }
   return
  }).
  AttachTo(root)
 return
}
```

运行的效果是这样的：

![image-20210920154132341](/cmdr/image-20210920154132341.png)

就是如此简单。

## X

```plain
home: true
heroImage:
actionText: 快速上手 →
actionLink: /zh/cmdr/getting-started.html
features:

- title: 简洁至上
  details: 采用简单的流式调用方式进行命令行参数定义，便于组织和管理。
- title: 符合标准
  details: 完全符合 POSIX 命令行界面兼容性标准。
- title: 宽泛兼容
  details: 你可以非常简单地从 `flag` 代码直接迁移到 `cmdr 方案，几乎无需任何修改。
- title: 强力的参数管理
  details: 内置 `Option Store` 管理应用程序的一切参数，层级化它们的逻辑结构。
- title: 有用的调试信息
  details: 使用命令行参数 `~~tree`, `~~debug` 打印完整的命令表。
- title: 多种拦截点
  details: 在多个关键节点处都可以埋入回调函数从而定制 cmdr 的相关行为
footer: MIT Licensed | Copyright © 2018-2021 by hedzr
```
