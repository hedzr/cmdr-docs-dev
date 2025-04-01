---
layout: single
title: "子命令 (Subcommands)"
date: 2020-07-13T11:17:11+08:00
last-modified: 2020-08-17 01:40:01 +0800
author: hedzr
tags: [commander, command-line, "command-line-parser", command-line-interface,  getops, posix, posix-compatible, hierarchical-configuration, hierarchy, cli, golang]
categories: golang cmdr guide subcommand
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



## Subcommands

### 简单 CLI

一个简单的 CLI 应用程序，例如 `wget`，并不需要定义子命令。所以这样的应用程序只需要一个 `RootCommand` 就够了：

```go
func buildRootCmd() (rootCmd *cmdr.RootCommand) {
 root := cmdr.Root("wget-cover", wgetVersion).
  Header(`GNU Wget 1.20, a non-interactive network retriever.

Usage: wget [OPTION]... [URL]...

Mandatory arguments to long options are mandatory for short options too.`).
  Description("", "").
  Action(func(cmd *cmdr.Command, args []string) (err error) {
   return
  })
 rootCmd = root.RootCommand()

 setStartupFlags(root)
  setLoggerFlags(root)
 // ...
 return
}

func setStartupFlags(root cmdr.OptCmd) {
 cmdr.NewBool().
  Titles("version", "V").
  Description("display the version of Wget and exit").
  Group(cStartup).
  Action(func(cmd *cmdr.Command, args []string) (err error) {
   cmd.PrintVersion()
   return cmdr.ErrShouldBeStopException
  }).
  AttachTo(root)
 cmdr.NewBool().
  Titles("help", "h").
  Description("print this help screen").
  Group(cStartup).
  Action(func(cmd *cmdr.Command, args []string) (err error) {
   // cmd.PrintHelp(false)
   return
  }).
  AttachTo(root)
 cmdr.NewBool().
  Titles("background", "b", "bg").
  Description("go to background after startup").
  Group(cStartup).
  AttachTo(root)
 cmdr.NewString().
  Titles("execute", "e").
  Description("execute a `.wgetrc'-style command").
  Placeholder("COMMAND").
  Group(cStartup).
  AttachTo(root)
}

func setLoggerFlags(root cmdr.OptCmd) {
 cmdr.NewString().
  Titles("append-output", "a").
  Name("011.append-output").
  Description("append messages to FILE").
  Placeholder("FILE").
  Group(cLogging).
  AttachTo(root)
 cmdr.NewString().
  Titles("output-file", "o").
  Name("001.output-file").
  Description("log messages to FILE").
  Placeholder("FILE").
  Group(cLogging).
  AttachTo(root)
}
```

可以看到，通过 `cmdr.Root()` 以及级联的 `Description()`，`Action` 等函数调用我们定义了一个 `*cmdr.RootCommand` 对象。

Action 函数将会提供一个响应函数。当 `wget-cover` 被运行时，这个响应函数将会获得控制权。值得注意的是，一旦定义了 Action 函数，那么应用程序运行时就不会自动显示帮助屏了，除非你使用 `wget-cover --help` （或者 `-h`, `-?` 等）等方式（这也是 POSIX 兼容的方案）。

#### 关于 PreAction 和 PostAction

对于 RootCommand 来说，除了能够定义应用程序级别的信息，例如 appName，version，banner 等等之外，需要注意的就是它的 PreAction 和 PostAction 函数了。在 RootCommand 的  Action 函数被调用之前和之后，这两个函数会分别获得执行控制权。

它们的特殊之处在于，对于子命令的 Action 函数被执行的情况，除了子命令的 PreAction 和 PostAction 会有机会被执行之外，RootCommand 的 PreAction 和 PostAction 也会被执行。所以它们隐含着全局的前置和后置调用的含义——全局的 Pre/PostAction。

#### 关于排序

子命令/标志 都是可以排序的。

在默认时，子命令/标志 按照它们的 Long/Full 标题字符串的 ASCII 字母数字顺序被显示在帮助屏中（所以添加顺序不重要）。但通过 Name() 在指定一个子命令/标志 的内部名称的同时，还可以添加一个排序用的前缀。如同 `Name("011.append-output")` 这样。

这个前缀 `011` 不会被显示出来，但会影响到子命令/标志 的显示顺序。就像这样：

![image-20200713221103126](/images/cmdr/wWCtVsLJyE9zToj.png)

我们可以看到 `--output-file` 和 `--append-output` 的顺序被定制过了。

排序用的前缀，可以是英文字母和阿拉伯数字的组合，它们将被依照 ASCII 字符串比较大小的方式来影响到对应条目的顺序。像 `zzzz.`，`zzz9`.，`1234.` 等都是有效的前缀。

前缀和常规名称之间以句点分隔。

同样的策略，还被应用在 Group() 上，从而可以影响到 子命令分组、标志分组的顺序。

### 带有子命令的 CLI

我们可以很容易地定义出像 docker 那样的多级命令结构。从理论上说，这没有任何限制，你可以无限地定义多级子命令。

> 但是，对于大多数 CLI 应用程序而言，子命令层级超过 3 层之后，都会给使用者带来记忆、归纳的麻烦。
>
> 借助 `cmdr` 提供的 `app ~~tree` 命令，使用者能够获得子命令的层级结构树，这将有助于他们获得应用程序的命令菜单的总体观念。
>
> 借助 Shell 提供的自动完成以及动态提示功能，也可以减轻使用者的记忆负担。
>
> 但无论如何，总的来说，你不可能真的去定义太多太深的命令层级。

这是通过 `command.NewSubCommand()` 的方式来实现的。从 rootCmd 开始，我们可以这样定义：

```go
 root := cmdr.Root(appName, cmdr_examples.Version).
  Copyright(copyright, "hedzr").
  Description(desc, longDesc).
  Examples(examples)
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

 pa := root.NewSubCommand("panic-test", "pa").
  Description("test panic inside cmdr actions", "").
  Group("Test")

 val := 9
 zeroVal := zero

  dz := pa.NewSubCommand("division-by-zero", "dz").
  Description("").
  Group("Test").
  Action(func(cmd *cmdr.Command, args []string) (err error) {
   fmt.Println(val / zeroVal)
   return
  })

 cmdr.NewBool(false).
  Titles("enable-abc", "abc").
  AttachTo(dz)

 pa.NewSubCommand("panic", "pa").
  Description("").
  Group("Test").
  Action(func(cmd *cmdr.Command, args []string) (err error) {
   panic(9)
   return
  })
```

上面的代码建立了这样的子命令结构：

```bash
❯ go run ./examples/simple/ ~~tree
ROOT
  snd, soundex, sndx, sound - soundex test
  pa, panic-test - test panic inside cmdr actions
    dz, division-by-zero - 
    pa, panic - 
  g, generate, gen - generators for this app.
    s, shell, sh - generate the bash/zsh auto-completion script or install it.
    m, manual, man - generate linux man page.
    d, doc, markdown, pdf, docx, tex - generate a markdown document, or: pdf/TeX/...
```

注意 `generate` 及其子命令时内置的，你也可以通过 `cmdr.WithBuiltinCommands()` 来禁止几组内置命令集合被自动组合到你的应用程序中去：

```go
func main() {
 if err := cmdr.Exec(buildRootCmd(),
  // To disable internal commands and flags, uncomment the following codes
  cmdr.WithBuiltinCommands(false, false, false, false, true),
 ); err != nil {
  log.Fatalf("Error: %v", err)
 }
}
```

前面我们已经提到过，在子命令的 Action 函数被执行的情况，除了子命令的 PreAction 和 PostAction 会有机会被执行之外，RootCommand 的 PreAction 和 PostAction 也会被执行。

所以 RootCommand 的 PreAction 和 PostAction 实际上隐含着全局的前置和后置调用的含义。

#### 关于标题

子命令的 Short 短标题、别名 Alias 标题，和长 Long/Full 标题具有相同的含义，所以你可以在命令行中混用它们。

#### 关于长标题和 keyPath

但以后我们会看到，子命令以及标志的长标题非常重要，它不能为空，并且会在 cmdr 内部被用作索引关键字来标识一个子命令对象。

对于 `division-by-zero` 这条子命令来说，它的 keyPath 为 `app.panic-test.division-by-zero`，其中 `app` 是内置的前缀（OptionPrefix），可以被 `cmdr.WithOptionPrefix()` 所修改。

对于 `division-by-zero` 专属的标志 `enable-abc` 来说，其 keyPath 为 `app.panic-test.division-by-zero.enable-abc`，也就是所属子命令的 keyPath 加上标志自身的长标题以构成。标志的 keyPath 被用在 `cmdr.GetXXX(`) 命令族中以访问该标志的具体值。

例如：`cmdr.GetBoolR("panic-test.division-by-zero.enable-abc")` 可以取得 `enable-abc` 的值。如果你在命令行中使用了 `--enable-abc`，那么GetBoolR会为其返回 true。

> 带有 R 后缀的 GetXXX 命令要求你提供的 keyPath 不必包含所谓的 OptionPrefix，所以 `cmdr.GetBoolR("panic-test.division-by-zero.enable-abc")` 实际上是等效于 `cmdr.GetBool("app.panic-test.division-by-zero.enable-abc")` 的。

> 带有 P 后缀的 GetXXX 命令要求你分为两个部分来提供 keyPath，所以 `cmdr.GetBoolRP("panic-test.division-by-zero“, "enable-abc")` 是和 `cmdr.GetBool("app.panic-test.division-by-zero.enable-abc")` 等效的。

#### See Also

:::tip

See Also: [subcommand at hedzr/cmdr-examples](https://github.com/hedzr/cmdr-examples/blob/master/examples/subcommands)

:::

#### 匹配字面量

当用户输入当命令行参数被匹配为一个子命令时，这个字面量也被记录到子命令的内部变量中。你可以在稍后取得该字面量。

例如对于 `dex` (Daemon addon for cmdr) 内建的 server-start 子命令来说，除了 `start` 之外，也包括 `run` 以及其它别名。而用户输入的 `app server run` 时，其实代表着他期待在控制台前台运行服务，如果用户输入`app server start`，则意味着他希望服务被当作守护进程启动。因此，你可以采用如下的逻辑：

```go
func actionServerStart(cmd *cmdr.Command, args []string) (err error) {
 switch cmd.GetHitStr() {
 case "run":
  runServerAtForeground()
 default:
  runServerAsDaemon()
 }
 return
}
```

`cmd.GetHitStr()` 能够提取到最后一条子命令的用户输入的字面量，如果是 “run” 那就去执行前台运行的逻辑。

`cmd.GetOwner().GetHitStr()` 将会取得上一级子命令的字面量。在这里，意味着检出 `server` 子命令的实际字面量。如是类推。

### Extensions 子命令分组

> 更多扩充，请参见：[动态扩充命令](./r15-adv#动态扩充命令)

从 v1.7.21 起，主程序能够扫描扩展文件夹中的可执行的外部程序作为自己的 Extensions 子命令分组，从而允许动态扩展子命令集合、建立统一的 CLI 界面。

![image-20200920174339255](/images/cmdr/bdvhoMjH6elENOT.png)

在 cmdr 文档中，这个新特性被称作 the builtin pluggable extensions。

可以参考样板程序的说明：[cmdr-examples/flags](https://github.com/hedzr/cmdr-examples/blob/master/examples/flags/README.md#pluggable-extensions)。

`cmdr` 在主程序启动过程中，会在以下的几个特定文件夹中的寻找可执行文件：

```go
"./ci/local/share/$APPNAME/ext",
"$HOME/.local/share/$APPNAME/ext",
"$HOME/.$APPNAME/ext",
"/usr/local/share/$APPNAME/ext",
"/usr/share/$APPNAME/ext",
```

> 你总是可以通过 `cmdr.WithExtensionsLocations(locations ...)` 来指定想要的搜索路径。

一旦找到可用的可执行文件，则将其加入到主程序到 Extensions 命令分组中，所以看起来会像这样：

![image-20200920175459167](/images/cmdr/ciqzb8xLQYRydtT.png)

你可以如同主程序到其它子命令一样地使用它：

```bash
$ ./bin/flags cpu
37%

$
```

> 你可以在 ext 文件夹中放置 shell 脚本，或者可执行文件（ELF，EXE等），他们将被视为可插入到主程序中的单一的子命令。

🔚
