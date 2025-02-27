---
layout: single
title: "CLI App 代码布局 (App Layout)"
date: 2020-07-13T11:16:11+08:00
author: hedzr
tags: [commander, command-line, "command-line-parser", command-line-interface,  getops, posix, posix-compatible, hierarchical-configuration, hierarchy, cli, golang]
categories: golang cmdr guide cli
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

# CLI app 及其代码布局

---


## Intro

> 本章节首先介绍一个 CLI 应用程序的命令行界面中，各种元素的概念。
>
> 如同想要立即查看我们推荐的 `cmdr` CLI app 的 main 函数结构（也即 `代码布局`），可直达 [应用程序结构](#应用程序结构（app-layout）)。
>
> 在本章末尾，包含一个 [精选 With 函数列表](#精选-with-函数列表) 供你查阅。
>
> 另外，本章节中也包含一个 [POSIX简介](#posix-约定)。

## 命令行界面（CLI API）

> 关于命令行界面，你需要了解 getopt 以及 POSIX。请跳转到相关章节获知一个概要介绍：
>
> [POSIX 约定](#posix-约定)

一个 CLI 应用程序有如下的命令行操作界面（Command-Line API）：

```bash
app [commands] [flags] [arguments]
```

`app` 表示这个应用程序的文件名。

在可能的情况下，cmdr 会尝试尽可能地宽松识别用户输入。这意味着：

```bash
app cmd1 -a -b cmd2 cmd3 -c -d -e file1 file2 file3
```

是能够正确识别出：

1. Commands: cmd1 cmd2 cmd3 三级子命令
2. Flags: -a -b -c -d -e 一系列标志
3. Tailed Args: file1 file2 file3 等尾部参数

其中，识别出的标志可以属于任意命令：三级子命令以及根命令。并且，它们的输入顺序没有限定，可前可后。

同样道理，对于短标志组合情形来说，单个字母或多个字母的短参数可以自由地组合，只要没有歧义，则 cmdr 将会如你预期般地识别到它们：

```bash
-avraz == -a -v -ra -z
-raavz == -ra -a -v -z
```

### 帮助屏

对于用户输入的子命令解析完成后，如果识别出的命令（子命令）尚有下级命令存在，那么将会自动打印帮助屏到标准输出设备。

否则，你可以添加 `--help` 标志来要求帮助屏输出。

在支持环境变量映射的情况下，`HELP=1` 前缀和 `--help` 是等价的。

```bash
# 由于 cmd1 有多个下级子命令，所以下一行命令导致帮助屏自动被显示
$ app cmd1
# 显式要求帮助屏
$ app cmd1 cmd2 -a -bc --help
# 或者借助环境变量
$ HELP=1 app cmd1 cmd2 -a -bc
```

`-h` / `--help`

对于多级子命令，我们会依次打印出每一级子命令的相关标志，使得层次结构更为分明：

[//]: # (![image-20200923093647372]&#40;/cmdr/EQXubFar3lJw8y5.png&#41;)

![image-20201001205505876](/cmdr/tPyIJ6HjK9xRmbQ.png)

### 构建信息

`-#` / `--build-info`

例如：

[//]: # (![image-20200923094041802]&#40;/cmdr/nY8r9hpIPCBw25T.png&#41;)

![image-20201001210250357](/cmdr/TXBnF1CLau2lIbN.png)

### 版本信息

`-V` / `--version`

你也可以使用内建命令：

```bash
your_cmdr_app versions
your_cmdr_app version
your_cmdr_app ver
```

例如：

[//]: # (![image-20200923094011091]&#40;/cmdr/KRbUv6m9NyFxnlk.png&#41;)

![image-20201001210402211](/cmdr/REGkj3QC9FVd4Ls.png)

### `SetCustomShowBuildInfo(fn func())`，`SetCustomShowVersion(fn func())`

`cmdr` 自动提供 ShowBuildInfo 和 ShowVersion 实现，用于打印 编译信息屏 和 版本信息屏。

[SetCustomShowBuildInfo(fn func())](https://godoc.org/github.com/hedzr/cmdr#SetCustomShowBuildInfo) 和 [SetCustomShowVersion(fn func())](https://godoc.org/github.com/hedzr/cmdr#SetCustomShowVersion) 则允许你自行提供你的实现。

## 命令和子命令（Commands）

对于 `cmdr` 构建的 CLI 应用程序来说，`commands` 是由你定义的子命令构成，例如：

- `app ca print`
- `app ca create`
- `app cert create`

## 标志（Flags）

`flags` 由任意多个标志组成。例如：

- `app list --retry 5 -rv -n "front-end" --help`

你可以混合多级子命令的任何 `flags`，`cmdr` 将会采用从底层到顶层的顺序去尝试完成 `flags` 的匹配。如果你在具有从属关系的子命令层级中定义了相同的标志的话，要注意到顶层的标志将无法被匹配到。

但对于同一个子命令来说，它的所有直接标志是不可以重复的。对于这类重复定义的标志，`cmdr` 会打印一条警告信息，提醒你判断是否需要调整相关设计。

> 直接属于同一个命令的子命令彼此之间也不能重复，同样地会有一个警告信息输出。

### 内建标志

像 `--help` (HELP)，`--version`，`--version-simu`，`--verbose` (VERBOSE)，`--debug` (DEBUG) 等标志，是如此的常用，因而 cmdr 已经内建了它们。

可以参考 [高级特性 - 内建命令和标志](r15-adv#builtin-commands-and-flags) 获得完整的描述。

由于环境变量的可用性，所以像 `--help` 这样的查看命令、标志用法的专用标志，可以使用前置环境变量赋值的方式来代替：

```bash
app cmd1 cmd2 -v --help
HELP=1 app cmd1 cmd2 -v
```

上述两条命令是等价的。

## 尾部参数（`non_option_args`）

`non_option_args` 表示当 `commands`, `flags` 被匹配和处理完毕之后，命令行的剩余参数列表。例如你需要一个像 gcc 一样所的文件列表。在 `cmdr` 中，往往会将其称作 `remained args` 或者 `tail argument`，你可以在 Action 所定义的回调函数中直接取得这个数组：

```go
 root.NewSubCommand("soundex", "snd", "sndx", "sound").
  Action(func(cmd *cmdr.Command, args []string) (err error) {
   for ix, s := range args {
    fmt.Printf("%5d. %s => %s\n", ix, s, cmdr.Soundex(s))
   }
   return
  })
```

你会发现，我们在定义一条命令的同时，也通过 Action 为其指定响应函数。该函数被回调时，能够得到一个 `cmd` 对象以及 `remained args` 数组。

> 此时得到的 `cmd` 对象实际上就是 "soundex" 这个 `*cmdr.Command` 对象。
>
> 对于非 inline 方式单独定义的 Action 函数来说，`cmd` 可能是有用的。考虑几个命令共用同一个 Action 回调函数的情况，`cmd` 将有助于区别是哪一个 Command 对象被命中了。

## 选项（Options）

选项，在 cmdr 中是一个特别的术语，它表示两种东西：

1. 来自命令行的 标志（Flags）
2. 来自配置文件的 配置项（Config Items）

这两种不同来源的键值对被统一地称作选项（Options），它们被存储在 Option Store 中，可以采用统一的访问方式进行读写。

```go
var debugMode bool = cmdr.GetR("debug", false)
var stringVal string = cmdr.GetStringR("test.vals.string-val", "hello, world")
var intVal int = cmdr.GetIntR("test.vals.int-val", -1)
var uintVal uint = cmdr.GetUintR("test.vals.uint-val", 99)
var sslice []int64 = cmdr.GetIntSliceR("test.vals.int-slice-val", 5,6,7)
```

> `keyPath` 是一个句点（'.'）分隔的多级字符串，每一个片段代表一个层级，对应着YAML 的树状层级结构：
>
> ```yaml
> app:
>   debug: true
>   test:
>     vals:
>       string-val:
>       int-val: 9
>       uint-val: 
>       string-slice-val: []
>       int-slice-val: [7,8,9,10]
>       uint-slice-val: []
> ```
>
>

你可以使用 Option Store 提供的标准类型抽取函数来读写一个 `keyPath` 的值，也可以将一个 `keyPath` 及其下级节点整体抽出为一个 Map，甚至是直接抽出为结构：

```go
var m map[string]interface{} = cmdr.GetMapR("test.vals")
var i interface{} = cmdr.Get("test.vals")

type ServerConfig struct {
  Port int
  HttpMode int
  EnableTLS bool
}
var serverConfig = new(ServerConfig)
cmdr.GetSectionFrom("server", &serverConfig)
assert serverConfig.Port == 7100
```

## 应用程序结构（App Layout）

综上，一个 CLI 应用程序的典型编码布局可以是这样：

```go
package main

import (
 "fmt"
 "github.com/hedzr/cmdr"
 cmdr_examples "github.com/hedzr/cmdr-examples"
 "gopkg.in/hedzr/errors.v2"
)

func main() {
 Entry()
}

func Entry() {
 if err := cmdr.Exec(buildRootCmd(), 
      cmdr.WithUnhandledErrorHandler(onUnhandledErrorHandler),
                      // ... more WithXXX(),
  ); err != nil {
  fmt.Printf("error: %+v\n", err)
 }
}

func onUnhandledErrorHandler(err interface{}) {
 if cmdr.GetBoolR("enable-ueh") {
  dumpStacks()
  return
 }

 panic(err)
}

func dumpStacks() {
 fmt.Printf("=== BEGIN goroutine stack dump ===\n%s\n=== END goroutine stack dump ===\n", errors.DumpStacksAsString(true))
}

func buildRootCmd() (rootCmd *cmdr.RootCommand) {
 root := cmdr.Root(appName, cmdr_examples.Version).
  Copyright(copyright, "hedzr").
  Description(desc, longDesc).
  Examples(examples)
 rootCmd = root.RootCommand()

 cmdr.NewBool(false).
  Titles("enable-ueh", "ueh").
  EnvKeys("ENABLE_UEH").
  Description("Enables the unhandled exception handler?").
  AttachTo(root)

 soundex(root)
 panicTest(root)

 return
}

func soundex(root cmdr.OptCmd) {
 // soundex

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
}

func panicTest(root cmdr.OptCmd) {
 // panic test

 pa := root.NewSubCommand("panic-test", "pa").
  Description("test panic inside cmdr actions", "").
  Group("Test")

 val := 9
 zeroVal := zero

 pa.NewSubCommand("division-by-zero", "dz").
  Description("").
  Group("Test").
  Action(func(cmd *cmdr.Command, args []string) (err error) {
   fmt.Println(val / zeroVal)
   return
  })

 pa.NewSubCommand("panic", "pa").
  Description("").
  Group("Test").
  Action(raisePanic)
}

func raisePanic(cmd *cmdr.Command, args []string) (err error) {
  panic(9)
  return
}

const (
 appName   = "simple"
 copyright = "simple is an effective devops tool"
 desc      = "simple is an effective devops tool. It make an demo application for `cmdr`."
 longDesc  = "simple is an effective devops tool. It make an demo application for `cmdr`."
 examples  = `
$ {{.AppName}} gen shell [--bash|--zsh|--auto]
  generate bash/shell completion scripts
$ {{.AppName}} gen man
  generate linux man page 1
$ {{.AppName}} --help
  show help screen.
`
 overview = ``

 zero = 0
)
```

这个示例可以在 [Here](https://github.com/hedzr/cmdr-examples/blob/master/examples/simple/main.go) 被找到。

## POSIX 约定

[POSIX](https://zh.wikipedia.org/wiki/POSIX) 表示 **可移植操作系统接口**（英语：Portable Operating System Interface，缩写为 **POSIX**）是 [IEEE](https://zh.wikipedia.org/wiki/IEEE)（电气和电子工程师协会，Institute of Electrical and Electronics Engineers）为要在各种 [UNIX](https://zh.wikipedia.org/wiki/UNIX) [操作系统](https://zh.wikipedia.org/wiki/操作系统) 上运行软件，而定义 [API](https://zh.wikipedia.org/wiki/API) 的一系列互相关联的标准的总称，其正式称呼为 IEEE Std 1003，而国际标准名称为 [ISO](https://zh.wikipedia.org/wiki/ISO)/[IEC](https://zh.wikipedia.org/wiki/IEC) 9945。此标准源于一个大约开始于1985年的项目。POSIX 这个名称是由 [理查德·斯托曼](https://zh.wikipedia.org/wiki/理查德·斯托曼)（RMS）应IEEE的要求而提议的一个易于记忆的名称。它基本上是 Portable Operating System Interface（可移植操作系统接口）的缩写，而 **X** 则表明其对 Unix API 的传承。电气和电子工程师协会（Institute of Electrical and Electronics Engineers，IEEE）最初开发 POSIX 标准，是为了提高 UNIX 环境下应用程序的可移植性。然而，POSIX 并不局限于 UNIX。许多其它的操作系统，例如 DEC OpenVMS 和 Microsoft Windows NT，都支持 POSIX 标准。

下面是 POSIX 标准中关于程序名、参数的约定：

- 程序名不宜少于 2 个字符且不多于 9 个字符；
- 程序名应只包含小写字母和阿拉伯数字；
- 选项名应该是单字符活单数字，且以短横 ‘-‘ 为前綴；
- 多个不需要选项参数的选项，可以合并。（譬如：`foo -a -b -c ---->foo -abc`）
- 选项与其参数之间用空白符隔开；
- 选项参数不可选。
- 若选项参数有多值，要将其并为一个字串传进来。譬如：`myprog -u "arnold,joe,jane"`。这种情况下，需要自己解决这些参数的分离问题。
- 选项应该在操作数出现之前出现。
- 特殊参数 `‘--'` 指明所有参数都结束了，其后任何参数都认为是操作数。
- 选项如何排列没有什么关系，但对互相排斥的选项，如果一个选项的操作结果覆盖其他选项的操作结果时，最后一个选项起作用；如果选项重复，则顺序处理。
- 允许操作数的顺序影响程序行为，但需要作文档说明。
- 读写指定文件的程序应该将单个参数 '-' 作为有意义的标准输入或输出来对待。

### GNU长选项约定

- 对于已经遵循 POSIX 约定的 GNU 程序，每个短选项都有一个对应的长选项。
- 额外针对 GNU 的长选项不需要对应的短选项，仅仅推荐要有。
- 长选项可以缩写成保持惟一性的最短的字串。
- 选项参数与长选项之间或通过空白字符或通过一个 '=' 来分隔。
- 选项参数是可选的（只对短选项有效）。
- 长选项允许以一个短横线为前缀。

### getopt 界面

以下对 Unix [*getopt*(3)](http://man7.org/linux/man-pages/man3/getopt.3.html) 以及 getopt\_long 提供的界面进行描述，`cmdr` 具备相同的能力。

在以下的行文中，`短参数`和`短选项`是等同的概念，其它词汇也类似如此，不再赘述。

#### 短参数

单个短横线引导的单个字符的参数，被称为短参数。例如：`-v`，`-d`，等等。有的时候，短参数也可能有两个字符甚至更多个字母。然而，短参数的用意就在于缩略，因此多字符的短参数很少见，且通常被用于组合，更像是典型的单字符短参数后缀以一个取值。例如 rar 的选项中有 -ep, -ep1, -ep3：

```bash
  ep            Exclude paths from names
  ep1           Exclude base directory from names
  ep3           Expand paths to full including the drive letter
```

然而在实现其处理器时，我们可以提供 `-ep<n>` 的处理器就够了，所以你仍然可以将其视为 `-ep` 短参数的变形。

#### 长参数

两个短横线引导的多个字符的参数，被称为长参数。例如：`—debug`，`--version` 等等。

一般来说，长参数更具备描述性，通常使用单词、词组来构成长参数。例如 docker 的子命令 `docker checkpoint create` ：

```bash
$ docker checkpoint create --help

Usage:    docker checkpoint create [OPTIONS] CONTAINER CHECKPOINT

Create a checkpoint from a running container

Options:
      --checkpoint-dir string   Use a custom checkpoint storage directory
      --leave-running           Leave the container running after checkpoint
```

#### 参数描述

每条命令或参数选项可以被一段文件以描述。

#### 参数重复堆叠

无论长短参数，可以以任意顺序出现，也可以任意出现多次。对于多次出现的参数，一般来说是最后一次出现的为准，之前出现过的会被覆盖。

例如命令行：`-1 -a yy -a dd -a cc`，则对于参数a来说，其有效值为 ”cc“，此前出现的都被覆盖了。

#### bool型短参数的组合

对于getopt不带值的参数，例如 `"1abc"` ，以下的命令行都是有效的：

- `-1 -a -b -c`
- `-abc1`
- `-ac -1b`
- ...

顺序是不敏感的，组合是任意的。

#### 必须带值的参数

getopt的定义是参数后加一个冒号，例如 `“1a:b::"` 中的参数 `a`，对它你需要指定命令行形如 `-1 -a xxx`。

#### 可选值的参数

getopt的定义是参数后加两个冒号，例如 `“1a:b::"` ​中的参数 `b`，对它你需要指定命令行形如 `-1 -b` 或者 `-1 -bvalue`。

## 精选 With 函数列表

在应用程序结构 章节中，你已经看到了 cmdr 的主要（也是其唯一）入口为 `cmdr.Exec(rootCmd *cmdr.Command, opts ...cmdr.ExecOption)`。此入口允许你指定一个可变的 options 列表，这些 options 是由 `cmdr.WithXXX()` 函数构成的。

完整的 WithXXX 函数文档可以访问：

[On go.dev](https://pkg.go.dev/github.com/hedzr/cmdr#ExecOption)

在下面的章节中，会选择少量 With 函数进行说明。

在 cmdr-docs 整个文档中，其它的章节也会针对所属内容的相关性对涉及到的 WithXXX 函数进行就地的介绍。

### WithPagerEnabled

[On go.dev](https://pkg.go.dev/github.com/hedzr/cmdr#WithPagerEnabled)

```go
func WithPagerEnabled() ExecOption
```

通常，`cmdr` 管理下的 CLI app 在做标准输出时会直接进行，如果输出内容超出终端窗口高度，则早期输出被上卷移出终端窗口。

当你在 Exec(root, opts) 中使用了 `WithPagerEnabled(),` 时，标准输出将被 OS 的 Pager 程序所接管。在 Linux 中，默认的 Pager 通常是 `less`。

cmdr 会在其初始化步骤中查找环境变量 `$PAGER` 的值来寻找 Pager，默认值为 `less`。

cmdr 当前不能支持通过标志切换的方式来决定是否使用分页效果，如同 Windows 中的 `dir /p` 那样。你只能一次性地使用 `WithPagerEnabled` 初始化或者是不使用它。

### WithNoCommandAction(b bool)

[On go.dev](https://pkg.go.dev/github.com/hedzr/cmdr#WithNoCommandAction)

如果使用 `WithNoCommandAction(true)` 的话，`cmdr` 将完全忽略子命令的 Action 响应函数。因此，你需要在 Exec() 完毕之后自行决定应该选取哪些业务逻辑（如同 `flag.Parse()` 之后编写业务逻辑那样）。

```go
func main(){
  if err := cmdr.Exec(buildRootCmd(), WithNoCommandAction(true)); err != nil {
    log.Fatal(err)
  }
  
  // ...
  if cmdr.GetBoolR("opt1")  {
    //...
  }
  if filename := cmdr.GetStringR("filename1"); filename != "" {
    //...
  }
}
```

当然，如果你真的想要采用 `flag` 的编写风格的话，还可以考虑使用 cmdr 建立的 flag 兼容层（`github.com/hedzr/cmdr/flag`），请参阅：[从 go flag 迁移](./r91-others#从-go-flag-迁移)。

🔚
