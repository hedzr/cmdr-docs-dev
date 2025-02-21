---
sidebarDepth: 3
#layout: single
title: "News"
date: 2020-07-13 09:15:11 +0800
last-modified: 2020-08-16 09:12:12 +0800
Author: hedzr
tags: [commander, command-line, "command-line-parser", command-line-interface,  getops, posix, posix-compatible, hierarchical-configuration, hierarchy, cli, golang]
categories: golang cmdr home
comments: true
toc: true
header:
  overlay_image: /cmdr/help-screen.png
  overlay_filter: rgba(128, 128, 0, 0.3)
excerpt: >-
  Index to cmdr, a golang library to interpret/parse the command-line input with POSIX-compliant mode ...
#header:
#  overlay_image: /unsplash-image-1.jpg
#  overlay_filter: rgba(0, 0, 0, 0.15)
#  caption: "Photo credit: [**Unsplash**](https://unsplash.com)"
#  actions:
#    - label: "More Info"
#      url: "https://unsplash.com"
---





## 概要（Overview）

`cmdr` 是一个解释命令行输入内容的兼容于 POSIX 命令行风格代码库，以 Golang 编写。

作为 Golang 标准库 `flag` 的一个好的替代品，`cmdr`还提供一个层级式的参数管理器，用于管理应用程序的一切配置参数。

## 特性（Features）

- 对开发者友好的多种编程界面：流式调用风格，`flag` 兼容风格，以及旧式的结构数据定义风格等

- POSIX-兼容（Unix [*getopt*(3)](http://man7.org/linux/man-pages/man3/getopt.3.html)）的命令行界面：短参数，长参数，以及额外提供的 `别名`

  - 短参数可以组合：`-aux` = `-a -u -x`
  - 短参数可以不限于单个字符：`-aurpx` = `-a -u -rp -x`
  - 布尔标志允许 `+`/`-` 后缀：`-v-` = `-v=false`

- 可多级嵌套的命令和子命令

  *多级子命令允许下级标志参数覆盖上级同名参数，免除设计时的headache*

- 直接支持多种数据类型的命令行参数。*例如：bool, int, uint, string, string slice, ...*

- 可分组、可排序的命令列表、参数列表。

- 提供预制的 [内建命令以及标志组](./r15-adv#builtin-commands-and-flags)

- 用户错误输入时的智能建议与提示：  

  *从 v1.1.3 起，使用更强大的 [Jaro-Winkler distance](https://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance) 算法来提供更精准的建议*

- 用户输入时的命令行界面更鲁棒：

  - 使用 `app commands options arguments` 输入结构，用户可以打乱参数输入顺序如 `./my-cli cmd1 subcmd2 -a subcmd3 -b --c11`。但我们建议将标志全部后置，并在其后在放置剩余参数
  - 多级子命令的相关标志可以打乱顺序输入，自动识别上级命令的标志，同名的上级命令的标志被自动遮盖。无需在挑拣字母和单词时痛苦。
  - 组合的短参数输入：非单字符的短参数在组合形式中被自动识别

- 可从环境变量自动获得参数值

- 完整全面的外部配置文件支持

  可以智能合并外部配置文件中的参数集合  

  *开箱即用的符合 Linux/macOS 惯例的配置文件布局方案*

- 自动输出可读性强的帮助屏幕

- 提供一系列调试性工具帮助你管理大量的命令行参数定义：`~~tree`, `--debug`, ....

- 内置集成了 `Options Store`，从而提供层级化的配置参数管理功能，不要再定义一堆的全局变量了，好的编码风格从此开始

- 支持动态扩充命令和标志：[动态扩充命令](./guide/r15-adv#动态扩充命令)

  - 提供内置的可插拔的扩展（Extensions）支持

    *自动合并外部程序到 `Extensions 子命令分组`*
  
    > 从 v1.7.21 起，主程序能够扫描扩展文件夹中的可执行的外部程序作为自己的 Extensions 子命令分组，从而允许动态扩展子命令集合、建立统一的 CLI 界面。
    >
    > ![image-20200920174339255](/cmdr/bdvhoMjH6elENOT.png)
    >
    > 可参考：[子命令 - Extentsions 子命令分组](./guide/r05-subcommand#extensions-子命令分组) 有关章节。

  - 支持 `cmdr-addons` Golang 插件：[cmdr-addons 插件](./guide/r15-adv#_2-通过-golang-插件机制进行扩充) （*since v1.7.23*）
  
  - 支持从配置文件中加载命令定义：[命令别名](./guide/r15-adv#_3-通过配置文件定义别名段) （*since v1.7.25*）
  
## 示例（Examples）

```go
package main

import (
 "fmt"
    // !callout[/cmdr/] To import hedzr/cmdr v1
 "github.com/hedzr/cmdr"
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
 root.NewSubCommand("soundex", "snd", "sndx", "sound").
  Description("soundex test").
  Group("Test").
  TailPlaceholder("[text1, text2, ...]").
  Action(func(cmd *cmdr.Command, args []string) (err error) {
   for ix, s := range args {
    fmt.Printf("%5d. %s => %s\n", ix, s, cmdr.Soundex(s))
   }
   return
  })
 return
}
```

[Play on Go Playground](https://play.golang.org/p/1yDj-dCJ0bB)

### 更多的示例（More）

我们已经准备了一组样板性的小型项目，用以演示 cmdr 的某一个或者多个特性有何用途、如何使用。你可以在 [hedzr/cmdr-examples](https://github.com/hedzr/cmdr-examples) 中找到它们。

## 许可证（LICENSE）

Apache 2.0！最大限度自行取用

🔚
