---
#sidebar: 'auto'
#sidebarDepth: 3
#layout: single
title: "快速起步 (Getting Started)"
date: 2020-07-13T10:15:11+08:00
last-modified: 2020-08-17 01:40:01 +0800
author: hedzr
tags: [commander, command-line, "command-line-parser", command-line-interface,  getops, posix, posix-compatible, hierarchical-configuration, hierarchy, cli, golang]
categories: golang cmdr getting-start

#comments: true
#toc: true
#header:
#  overlay_image: /assets/images/cmdr/help-screen.png
#  overlay_filter: rgba(128, 128, 0, 0.3)
#excerpt: >-
#  Getting Start for cmdr ...
#header:
#  overlay_image: /assets/images/unsplash-image-1.jpg
#  overlay_filter: rgba(0, 0, 0, 0.15)
#  caption: "Photo credit: [**Unsplash**](https://unsplash.com)"
#  actions:
#    - label: "More Info"
#      url: "https://unsplash.com"
---

## 安装

`go get -v github.com/hedzr/cmdr`

无论你有否使用 Go Modules，上述命令都能够有效地安装 `cmdr` 到你的项目中，请在你的项目的根目录中执行该命令。

> 当前，`cmdr` 兼容于 go 1.11 及其以上的版本。理论上我们可以兼容更低的 Golang 版本而无需任何修改，然而请注意更低的版本并未获得更多的测试。
>
> 要查看 cmdr 的 golang 版本兼容性矩阵，请直达 [go.yml](https://github.com/hedzr/cmdr/blob/master/.github/workflows/go.yml)。

## 基本用法

这里有一个极简单的应用程序：

```go main.go

import (
 "fmt"
// !callout[/cmdr/] To import hedzr/cmdr v1
 "github.com/hedzr/cmdr"
 cmdrexamples "github.com/hedzr/cmdr-examples"
 "github.com/hedzr/cmdr/tool"
 "github.com/hedzr/log"
)

func main() {
 if err := cmdr.Exec(buildRootCmd(),
  cmdr.WithLogx(log.NewStdLogger()),
 ); err != nil {
  cmdr.Logger.Printf("error: %+v\n", err)
 }
}

func buildRootCmd() (rootCmd *cmdr.RootCommand) {
 root := cmdr.
  Root(appName, cmdrexamples.Version).
  Copyright(copyright, "hedzr").
  Description(desc, longDesc).
  Examples(examples)
 rootCmd = root.RootCommand()
 soundex(root)
 return
}

func soundex(root cmdr.OptCmd) {
 root.NewSubCommand("soundex", "snd", "sndx", "sound").
  Description("soundex test").
  Group("Test").
  TailPlaceholder("[text1, text2, ...]").
  Action(func(cmd *cmdr.Command, args []string) (err error) {
   for ix, s := range args {
    fmt.Printf("%5d. %s => %s\n", ix, s, tool.Soundex(s))
   }
   return
  })
}

const (
 appName   = "getting-start"
 copyright = "getting-start is an effective devops tool"
 desc      = "getting-start is an effective devops tool. It make an demo application for `cmdr`."
 longDesc  = "getting-start is an effective devops tool. It make an demo application for `cmdr`."
 examples  = `
$ {{.AppName}} gen shell [--bash|--zsh|--auto]
  generate bash/shell completion scripts
$ {{.AppName}} gen man
  generate linux man page 1
$ {{.AppName}} --help
  show help screen.
`
)
```

其完成的源码可以在 [here](https://github.com/hedzr/cmdr-examples/blob/master/examples/getting-start) 中找到。

### 显示帮助屏

运行上面的程序以显示自动生成的帮助屏：

```bash
go run ./examples/getting-start
```

结果应该和下图基本上无差别：

![image-20200713140513668](/images/cmdr/HwWo1v2JczCEat7.png)

### 运行一个子命令

现在我们可以试试运行子命令 `soundex` 了：

```bash
$ go run ./examples/getting-start sndx fish bird
    0. fish => f12
    1. bird => b163
```

### 搞定了

上面走过，就可以知道 cmdr 能够干点什么了。

🔚
