---
layout: single
title: "响应函数 (Actions)"
date: 2020-07-13T11:18:11+08:00
last-modified: 2020-08-17 01:40:01 +0800
author: hedzr
tags: [commander, command-line, "command-line-parser", command-line-interface,  getops, posix, posix-compatible, hierarchical-configuration, hierarchy, cli, golang]
categories: golang cmdr guide actions
comments: true
toc: true
header:
  overlay_image: /assets/images/cmdr/help-screen.png
  overlay_filter: rgba(128, 128, 0, 0.41)
excerpt: >-
  Guide and References for cmdr ...
#header:
#  overlay_image: /assets/images/unsplash-image-1.jpg
#  overlay_filter: rgba(0, 0, 0, 0.15)
#  caption: "Photo credit: [**Unsplash**](https://unsplash.com)"
#  actions:
#    - label: "More Info"
#      url: "https://unsplash.com"


---



## Actions

### 响应函数（Action）

Action 函数将会提供一个响应函数。

当一个命令被命中时，它的 Action 响应函数将会获得控制权。

值得注意的是，一旦定义了 Action 函数，那么应用程序运行时就不会自动显示帮助屏了，除非你使用 `wget-cover --help` （或者 `-h`, `-?` 等）等方式（这也是 POSIX 兼容的方案）。

对于标志来说，Action 也可以被用于响应，但更多的情况是通过标志的 OnSet 来完成自定义的标志值的校验。

```go
 cmdr.NewBool().
  Titles("background", "b", "bg").
  Description("go to background after startup").
  Group(cStartup).
  OnSet(func(keyPath string, value interface{}) {
   if value == true {
    panic("unexpected value: true")
   }
  }).
  AttachTo(root)
```

:::tip

See Also: [hedzr/cmdr-examples](https://github.com/hedzr/cmdr-examples/blob/master/examples/actions)

:::

### 关于 `PreAction` 和 `PostAction`

对于 RootCommand 来说，除了能够定义应用程序级别的信息，例如 appName，version，banner 等等之外，需要注意的就是它的 `PreAction` 和 `PostAction` 函数了。在 RootCommand 的  Action 函数被调用之前和之后，这两个函数会分别获得执行控制权。

它们的特殊之处在于，对于子命令的 Action 函数被执行的情况，除了子命令的 PreAction 和 PostAction 会有机会被执行之外，RootCommand 的 PreAction 和 PostAction 也会被执行。所以它们隐含着全局的前置和后置调用的含义——全局的 Pre/PostAction。

#### AddGlobalPreAction & AddGlobalPostAction

进一步地，你可以反复多次指定所谓的全局 Pre/PostAction。例如 examples/actions 中的[片段](https://github.com/hedzr/cmdr-examples/blob/master/examples/actions/main.go#L21)：

```go
func buildRootCmd() (rootCmd *cmdr.RootCommand) {
 root := cmdr.Root(appName, cmdr_examples.Version).
  AddGlobalPreAction(func(cmd *cmdr.Command, args []string) (err error) {
   fmt.Println("# global pre-action 1")
   return
  }).
  AddGlobalPreAction(func(cmd *cmdr.Command, args []string) (err error) {
   fmt.Println("# global pre-action 2")
   return
  }).
  AddGlobalPostAction(func(cmd *cmdr.Command, args []string) {
   fmt.Println("# global post-action 1")
  }).
  AddGlobalPostAction(func(cmd *cmdr.Command, args []string) {
   fmt.Println("# global post-action 2")
  }).
  Copyright(copyright, "hedzr").
  Description(desc, longDesc).
  Examples(examples)
 rootCmd = root.RootCommand()

 cmdr.NewBool(false).
  Titles("enable-ueh", "ueh").
  Description("Enables the unhandled exception handler?").
  AttachTo(root)

 soundex(root)
 panicTest(root)

 return
}
```

### `OnSet`

在上文中已经提到过 `OnSet` 的用法：

```go
  OnSet(func(keyPath string, value interface{}) {
   if value == true {
    panic("unexpected value: true")
   }
  }).
```

除了可以被用于完成校验任务之外，OnSet 也可以被用于设置有关系的全局变量，翻转某些特定业务逻辑等。

🔚
