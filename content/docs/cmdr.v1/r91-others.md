---
layout: single
title: "其它特性 (Others)"
date: 2020-07-13T11:35:11+08:00
last-modified: 2020-08-17 12:52:01 +0800
author: hedzr
tags: [commander, command-line, "command-line-parser", command-line-interface,  getops, posix, posix-compatible, hierarchical-configuration, hierarchy, cli, golang]
categories: golang cmdr guide envvars
comments: true
toc: true
header:
  overlay_image: /assets/images/cmdr/help-screen.png
  overlay_filter: rgba(128, 128, 0, 0.3)
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



## Addons

在 `cmdr-addons` 项目中我们收集了一些为 cmdr 做增强的子包。

> [hedzr/cmdr-addons](https://github.com/hedz/cmdr-addons)

### Using `isdelve`

isdelve 几乎被内置于 `cmdr` 中。

几乎，是指如果你会使用到几个特别的 API 调用的话，则 isdelve 会被自动地引用到你的项目中，否则即使你使用了 cmdr 也不会自动包含 isdelve 的相关内容。这几个特别调用是：

1. `cmdr.InDebugging() bool`
2. `cmdr.IsDebuggerAttached() bool`

isdelve 提供的检测函数，目的在于检测 dlv 调试器有否在线。如果你的 app 被启用于一个 dlv 兼容的调试容器中，那么上述检测会返回 true 值。

如同这里所讲的那样使得 isdelve 能够生效：

[here](https://stackoverflow.com/questions/47879070/how-can-i-see-if-the-goland-debugger-is-running-in-the-program)

> In Goland, you can enable this under 'Run/Debug Configurations', by adding the following into 'Go tool arguments:'
>
> ```go
> -tags=delve
> ```
>
> [![Goland Run/Debug Configurations window](/images/cmdr/fPKA2.png)](/images/blog/fPKA2.png)
>
> ------
>
> If you are outside of Goland, running `go run a.go` will report `delve false`, if you want to run dlv on its own, use `dlv debug --build-flags='-tags=delve' a.go`; this will report `delve true`.

#### 和 IsDebugMode() 的区别

`IsDebugMode() bool` 的功能是测试 `cmdr.GetBoolR("debug")` 是否被置位。要设置这个标志，你可以在命令行中输入 `--debug/-D`，这是在 cmdr 中内建的隶属于 RootCommand 的标志，目的就在于预置一个全局的 `调试模式`。

一般来说，所谓的 `调试模式` 就是为了能够输出更多的 app 运行过程中预埋的调试日志，如果你使用了 logx 集成（这是我们提供的一个用于整合 cmdr 和 hedzr/log 的附加库），那么 `cmdr.Logger.Debugf(...)` 将会在 `--debug` 为 true 时自动被输出。

> See also: `WithLogx()`

#### `--debug` vs `~~debug`

要注意的是，`--debug` 是隶属于 RootCommand 的命令行标志，它和 `~~debug` 也有所不同。

`~~debug` 采用 cmdr 特有的标志前缀 `~~`，这会设置一个在 Option Store 中的 `debug` 配置项，而 `--debug` 会设置的是 Option Store 中的 `app.debug` 配置项。

所以通过 `cmdr.GetBoolR("debug")` （或者使用 `cmdr.GetDebugMode()`）能够获取到 `--debug` 的配置值，但你无法通过 cmdr.GetBoolR() 的方式取得 `~~debug` 的值。取而代之的是，你应该用 `cmdr.GetBool("debug")` 来获取 `~~debug` 的配置值。

> GetBool(keyPath) 直接取得 keyPath 对应的配置项的值。
>
> GetBoolR(keyPath) 首先为 keyPath 添加所谓的 OptionsPrefix 前缀，然后再取得新的 keyPath 所对应的配置项的值。
>
> 默认的 OptionsPrefix 为 "app"。

### Using `dex`

(TODO)

## 从 go flag 迁移

请参考：

 [从 flag 迁移到 cmdr | hzSomthing](https://hedzr.github.io/golang/cmdr/others/cmdr-migrating-from-flag/)

## 使用 flag 等价的命令行界面

我们已经熟知 golang 提倡的是短选项类似的命令行界面，每个选项均以短横线引导，选项被建议采用完整的单词而不是缩略语。所以当你使用 flag 时，一个 app 的选项列表往往是这样的风格：

```bash
Usage of flagdemo:
  -age int
     Input Your Age (default 28)
  -flagname int
     Just for demo (default 1234)
  -gender string
     Input Your Gender (default "male")
  -name string
     Input Your Name (default "nick")
```

其源码可以参考这里：

- [On go-playground](https://play.golang.org/p/9I0ZcqJ_oRs)

### 用 cmdr 来模拟

由于 cmdr 允许短选项不必被限制为单个字母，故而当你不愿采用标准的 POSIX CLI 界面，而是想沿循 Golang 惯例时，也是能够做到的。

```go
package main

import (
 "fmt"
 "github.com/hedzr/cmdr"
)

func main() {
 if err := cmdr.Exec(buildRootCmd(),
 ); err != nil {
  fmt.Printf("error: %+v\n", err)
 }
}

func buildRootCmd() (rootCmd *cmdr.RootCommand) {
 root := cmdr.Root(appName, version).
  Copyright(copyright, "hedzr").
  Description(desc, longDesc).
  Examples(examples)
 rootCmd = root.RootCommand()

 cmdr.NewInt(28).
  Titles("age", "age").
  Description("Input Your Age").
  AttachTo(root)

 cmdr.NewInt(1234).
  Titles("flagname", "flagname").
  Description("Just for demo").
  AttachTo(root)

 cmdr.NewString("male").
  Titles("gender", "gender").
  Description("Input Your Gender").
  AttachTo(root)

 cmdr.NewString("nick").
  Titles("name", "name").
  Description("Input Your Name").
  AttachTo(root)

 return
}

const (
 appName   = "flag-demo"
 version   = "1.0.0"
 copyright = "flag-demo is an effective devops tool"
 desc      = "flag-demo is an effective devops tool. It make an demo application for `cmdr`."
 longDesc  = "flag-demo is an effective devops tool. It make an demo application for `cmdr`."
 examples  = ``
)
```

其界面形如下面的输出：

![image-20200724131056493](/images/cmdr/wgFbJzSMeYZ1XNy.png)

可以见到，借助 cmdr 的增强的短选项，我们可以实现和 flag 完全等价的 CLI 界面。

## MetaData at Go Building

在使用 cmdr 时，你可以通过 Golang 的构建过程插入一些元信息，这样将会有利于 cmdr 的基础信息完备。

我们建议你采用如下的过程来进行发布版本的构建：

```bash
APP_NAME=your-app-name
APP_VERSION=your-app-version

CMDR_PKG=github.com/hedzr/cmdr/conf

TIMESTAMP=$(date -u '+%Y-%m-%d_%I:%M:%S%p')
GITHASH=$(git rev-parse HEAD)
GOVERSION=$(go version)

LDFLAGS="-s -w -X '$CMDR_PKG.Buildstamp=$TIMESTAMP' -X '$CMDR_PKG.Githash=$GITHASH' -X '$CMDR_PKG.GoVersion=$GOVERSION' -X '$CMDR_PKG.Version=$APP_VERSION' -X '$CMDR_PKG.AppName=$APP_NAME"

go build -ldflags "$LDFLAGS" -o bin/app-name ./cli
```

你不必无脑拷贝，只需要知道在 `$CMDR_PKG` 中，cmdr 约定了一组元信息变量，向它们提供正确的值将会有利于 cmdr 的运作。例如 cmdr 在输出应用名称标题行时，或者通过 `--version` 打印版本号时，通过 `--build-info` 打印构建信息屏时，都会用到上述的元信息。

所以在构建你的 app 时，你应该通过 CI 工具来完成这些信息的组织，尽管这些变量也可以通过编程方式去设置。但又何必呢？白白损失启动速度，即使只是几十 ns 也没必要。

🔚
