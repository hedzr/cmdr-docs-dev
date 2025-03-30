---
layout: single
title: "标志 (Flags)"
date: 2020-07-13T11:23:11+08:00
last-modified: 2020-08-17 01:40:01 +0800
author: hedzr
tags: [commander, command-line, "command-line-parser", command-line-interface,  getops, posix, posix-compatible, hierarchical-configuration, hierarchy, cli, golang]
categories: golang cmdr guide flags
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





## 标志（Flags）

### 什么是标志（Flag）、选项（Option）

在 `cmdr` 中，标志和选项常常是混用的。但它们对于 `cmdr` 来说，确实有分别。

一个标志（Flag），指的是通过 `cmdr.NewBool()` 等接口函数定义的实体，这个实体被用于命令行参数的解释，对应着一个特定的命令行参数选项。

一个选项（Option），指的是储存在 `Option Store` 中的一个条目，例如 `“app.debug” => true`。它的 yaml 表示能够体现出层级关系：

```yaml
app:
  debug: true
```

#### 和 `Option Store` 相集成

一个选项可能和一个标志相关联，但也可能不。但一个标志一定会对应着一个选项。

对于 `app.debug` 这个选项来说，由于 `app` 是内部设定的选项前缀（所以在体现到标志时不予考虑），故顶级标志 `--debug` 与其是关联的。

而对于多级子命令的标志，例如 子命令 `cert / create` 的标志 `--cacert`，会对应着 `app.cert.create.cacert` 这个选项。

当使用 `GetXXX` 来获取选项值时，R版本能够忽略 `app` 前缀的指定，从而简化你的编程思路。也就是说，`GetBoolR("debug")` 将会取得 `app.debug` 的布尔量值。

`app` 前缀是为了在序列化 Option Store 为 YAML 或者其他外部格式时而特别建立的前缀，这样能够保证 Option Store 的序列化内容能够被恰当地包含到外部配置中心里（无论是 YAML，JSON，TOML，抑或是显式的微服务外部配置中心）。

#### keyPath

`keyPath` 是 `Option Store` 中的专属概念，一个选项能够被通过 `前缀.子命令序列.标志长格式` 的方式被访问，这个格式就被称作 `keyPath`。

例如 `app.cert.create.cacert` 中，app 是内置的前缀，cert.create 代表着 cert 命令及其 create 子命令，cacert 除了是标志的长格式字串之外，也表达出了从属于 cert.create 子命令的含义。

### 定义标志

增加一个标志（Flag）定义非常容易。

:::tip

See Also: [hedzr/cmdr-examples](https://github.com/hedzr/cmdr-examples/blob/master/examples/flags)

:::

#### Bool

```go
 cmdr.NewBool().
  Titles("version", "V").
  Description("display the version of Wget and exit").
  Group(cStartup).
  Action(func(cmd *cmdr.Command, args []string) (err error) {
   cmd.PrintVersion()
   return cmdr.ErrShouldBeStopException
  }).
  AttachTo(root)
```

> 在标志的 Action 函数体中，`retun cmdr.ErrShouldBeStopException` 能够立即终止 `cmdr`的处理循环并退出应用程序，剩余的命令行参数将被放弃。

通过 NewBool完成了定义的最后，你一定要使用 `AttachTo(parent)` 的方式将这个标志挂接给某个命令或子命令。

##### 默认值

`NewBool(defaultValue...)` 要求一个（甚至是多个）可选的默认值作为其参数。

但一般情况下，我们定义一个布尔量的标志总是带有 false 默认值，因此命令行中的 `--falg` 才能翻转其值为 true。例外的情况有两个：

1. 按照 POSIX 兼容来说，在命令行中针对短标志可以采用 `-f+` 和 `-f-` 的格式来强制其值为 true 和 false。这样的话，我们可以输入这样的命令行：`-f+ -f- -f -f+ -f-`。
2. 对于 Toggleable Flags Group 的情况，一组可以像 Radio Button 一样翻转的标志组合中，通常总是有一个标志带有默认的 true 值。

##### `Titles(full, short, aliases...)`

`full` 指定了标志的长格式文字表示。

`full` 不可以缺省，它同时被用作 keyPath 的一部分（参见 Option Store 的 keyPath）。

由于 Golang 的限制，short 参数无法被省去，但你可以指定 `""` 空串给它。

##### `Description(desc, longDesc...)`

长格式的描述文字块是可选参数，如果提供的话，在标志的专属帮助屏中会被显示出来。

##### 短标志的组合

对于布尔量的短标志来说，POSIX 要求它们能够被组合到i一起。其含义是：

```bash
-azro 等价于 -a -z -r -o，或者等价于 -a -zr -o
```

###### cmdr 的增强

1. cmdr 的短标志不会被限定在单个字母。

   我们支持多个字母数字符号作为短标志。

   换句话说，你可以令长短标志的界限模糊，从而提供同时兼容于 golang flag 风格和 getopt 风格的标志集合。

   > Golang flag 风格：命令行参数总是单短横线引导的，如：`-host abc -port 9999`
   >
   > getopt 风格：允许单、双短横线引导，分别代表短、长标志，通常短标志使用单个字母或数字，如：`-d -t --retry 3`。
   >
   > cmdr 风格：在完全兼容 getopt 风格的基础上，通过解除单字母短标志限制，使得 cmdr cli app 也能支持 `-host abc` 这样的 golang flag 风格，甚至是 `-host abc --retry 3` 这样的混合风格（wget 采用这样的混合性风格）

2. 在无歧义的情况下，cmdr甚至支持你组合任何短标志。

   所以，`-dr3t` 能够被解释为 `--debug --retry 3 --timeout`。

   cmdr 采取特别的反向回溯算法来解决这个场景下的多级子命令的多级标志的智能匹配。

#### String

```go
 cmdr.NewString("localhost").
    Titles("host", "host").Description("some desc")
    Placeholder("HOST").
  Group(cStartup).
  AttachTo(root)
```

这个标志在帮助屏中的输出为：

```bash
  -host,  --host=HOST           some desc
```

##### 占位符（Placeholder）

占位符 `HOST` 被应用到长标题的表达形式上。

在命令行中输入时，以下的格式都是有效的：

```bash
--host=localhost
--host localhost
--hostlocalhost
```

这些格式中，单引号或双引号包围具体值均为有效形式，如 `--host'localhost'`。

##### 自动化的数值拆箱

`cmdr.GetXXX` 函数将会从 `Option Store` 中抽出一个选项/标志值，按照你期待的数据类型，必要时 GetXXX 会自动进行拆箱处理。例如当你抽取值 `1,2,3,4` 时，GetString会取得一个逗号分隔的列表，而 GetIntSlice 会取得 `[]int{1,2,3,4}`。

#### Int, Int64, Uint, Uint64

```go
 cmdr.NewInt(2).
    Titles("retry", "r", "retry-times").Description("retry times")
    Placeholder("COUNT").
  Group(cStartup).
  AttachTo(root)
```

#### Float32, Float64

```go
 cmdr.NewFloat32(3.14).
    Titles("pi", "pi").Description("PI")
  Group(cStartup).
  AttachTo(root)
```

#### Complex64, Complex128

```go
  cmdr.NewComplex64(3.14+5i).
    Titles("pi", "pi").Description("PI")
   Group(cStartup).
   AttachTo(root)
```

#### Duration

```go
  cmdr.NewDuration(3*time.Second).
    Titles("period", "p").Description("period")
   Group(cStartup).
   AttachTo(root)
```

在命令行中输入时，可以使用 `3s`，`8m20s` 等这样的语法，它们将会翻译为等价的 `time.Duration` 值。

#### String Slice

```go
  cmdr.NewStringSlice("s1", "s2", "s3").
    Titles("add", "a").Description("add classes")
   Group(cStartup).
   AttachTo(root)
```

对于所有 Slice 数组数据类型来说，命令行输入允许两种形式：

1. 多次输入：`-a s1 -a s2 -a s3`
2. 逗号分隔：`-a s1,s2,s3`

同时也允许上述两种形式任意组合。

#### Int Slice, Uint Slilce

```go
  cmdr.NewIntSlice(1, 2, 3).
    Titles("add", "a").Description("add classes")
   Group(cStartup).
   AttachTo(root)
```

### Values From 选项值的来源

（TODO）

#### from the Environment

（TODO）

:::tip

See Also: [hedzr/cmdr-examples](https://github.com/hedzr/cmdr-examples/blob/master/examples/envvars)

:::

#### from config files

（TODO）

:::tip

See Also: [hedzr/cmdr-examples](https://github.com/hedzr/cmdr-examples/blob/master/examples/configfile)

:::

#### from Config Center

（TODO）

### More 更多用于定义标志的接口

#### `DefaultValue(val interface{}, placeholder string)`

`DefaultValue` 可以为标志设定一个相应的默认值。如果没有这样显式地设定过，默认值将会保持零值状态（`reflect.IsZero()`)。如果有非零值的默认值设定，在帮助屏中会有 `default placeholder=defaultValue` 的后缀显示。

同时你也需要指定一个 Placeholder 短语，或者令其为空串。如果具有有效地占位符短语，则在帮助屏中，该标志的长选项会被打印为 `--long=placeholder` 的式样：

```bash
  -p,  --port=PORT            Consul port (default PORT=8500)
```

其定义为：

```go
 cmdr.NewInt(8500).Titles( "port", "p").
  Description("Consul port", "").
  Group("").
  Placeholder("PORT").
  AttachTo(mx)
```

#### `Deprecated(deprecation string)`

请看截图：

![image-20200720085008948](/images/cmdr/cbhykDz31GfsRPW.png)

一般来说，`deprecation` 应该是以版本号开始的，因为打印时的样式会自动附加 `"deprecated "` 前缀，为了文理通顺，你需要这样构造 `deprecation`。如果有必要，也可以添加更多文字给它。

其定义为：

```go
 cmdr.NewStringSlice("quick", "fox", "jumps").
  Titles("string-slice-value", "ssv").
  Description("A string slice flag: ", ``).
  Group("8200.Array").
  EnvKeys("").
  Deprecated("1.2.1").
  Examples(``).
  AttachTo(parent)
```

#### `Description(oneLineDesc string, longDesc ...string)`

`oneLineDesc` 会被显示为正常的标志行的后半部分。

`longDesc` 可以在该标志的独立帮助屏中被展示，以提供更细致的文档。但当前 `cmdr` 并未支持标志的独立帮助屏，所以这个字段暂无实际用处。

#### `Examples(examples string)`

和 `longDesc` 类似，由于当前 `cmdr` 并未支持标志的独立帮助屏，所以这个字段暂无实际用处。

#### `ExternalTool(envKeyName string)`

外部工具指定的是一个环境变量名，例如 `EDITOR`。

通常该标志必须接受 string 值，又或者能无歧义地接受到字符串转换到该标志值。

当该标志在命令行中被指定时且为 `cmdr` 所识别时，环境变量的具体值将被视为一个可执行文件 E 并被通过 `os.Exec()` 所执行。cmdr 约定该执行文件 E 会接受用户输入 I<sub>1</sub> 或者用户指定的输入 I<sub>2</sub>，并以适当的格式在执行文件 E 执行完毕后通过 一个特定的临时文件 展示出该输入值 V，最后将 V 设定为该标志的表示值。

说起来复杂，你可以将其视作 `git commit` 的 `-m` 的一种实现方式：

```go
 cmdr.NewString().Titles("message", "m", "msg").
  Description("the message requesting.", "").
  Group("").
  Placeholder("MESG").
  ExternalTool(cmdr.ExternalToolEditor).
  AttachTo(mx)
```

:::tip

请在 bash-like/*Linux*-like 的环境中使用，尚未在 Windows/PowerShell 中实际测试过

:::

:::tip

`cmdr.ExternalToolEditor`

这是 "EDITOR" 字串值的常量名，可以直接取用

:::

:::tip

See Also: [hedzr/cmdr-examples](https://github.com/hedzr/cmdr-examples/blob/master/examples/editor-tool)

:::

### `HeadLike(enable bool, min, max int64)`

可以仿照 [head(1)](https://linux.die.net/man/1/head) 的命令行界面。

head 命令允许你直接指定一个数字作为标志输入。例如 `head -9` 实际上表示 `head --lines 9` 的含义。所以一个等价的 cmdr 标志可以这样定义：

```go
 cmdr.NewInt(1).Titles( "head", "n").
  Description("the head lines.", "").
  Group("").
  Placeholder("LINES").
  HeadLike(true, 1, 3000).
  AttachTo(mx)
```

:::tip

很显然，在整个命令行输入内容中，只能有一次 `-number` 的输入。

所以为了避免歧义，你需要保证 HeadLike 标志在子命令的反向回溯链条中是不会被多次定义的。

由于 cmdr 会反向回溯子命令的所有上级命令，并尝试解决一个最佳的标志匹配，所以如果有重复的标志的话，依照匹配顺序来说，上级命令的重复标志将会被掩盖而无法起到作用。

:::

:::tip

`min`，`max` 保留为将来目的

:::

:::tip

See Also: [hedzr/cmdr-examples](https://github.com/hedzr/cmdr-examples/blob/master/examples/head-like)

:::

#### `Hidden(hidden bool)`

`Hidden(true)` 会禁止标志被显示在帮助屏中。

#### `Placeholder(placeholder string)`

占位符的用途可以参考 `DefaultValue(val, placeholder)` 中的描述。

#### `ToggleGroup(group string)`

`ToggleGroup()` 将标志纳入一个可以翻转的选项组中，使得设定其中一个标志时，其他同组的标志的值自动被翻转。

这个表现如同 GUI 界面中的 RadioButtonGroup。

所以 `ToggleGroup` 所指定的标志必须是 NewBool() 创建的布尔量。如非如此，cmdr 不会报错，但其功能不会被有效展现。

可以这样定义一个 ToggleGroup：

```go
 cmdr.NewBool(false).Titles("echo", "echo").Description("using 'echo' mux").ToggleGroup("mux-type").Group("Mux").AttachTo(c)
 cmdr.NewBool(false).Titles("gin", "gin").Description("using 'gin' mux").ToggleGroup("mux-type").Group("Mux").AttachTo(c)
 cmdr.NewBool(false).Titles("gorilla", "gorilla").Description("using 'gorilla' mux").ToggleGroup("mux-type").Group("Mux").AttachTo(c)
 cmdr.NewBool(true).Titles("iris", "iris").Description("using 'iris' mux").ToggleGroup("mux-type").Group("Mux").AttachTo(c)
 cmdr.NewBool(false).Titles("std", "std").Description("using standardlib http mux mux").ToggleGroup("mux-type").Group("Mux").AttachTo(c)
```

按照常理，在这组标志中，至少有一个标志应该具有默认值 true。

:::tip

See Also: [hedzr/cmdr-examples](https://github.com/hedzr/cmdr-examples/blob/master/examples/toggle-group)

:::

#### `ValidArgs(list ...string)`

ValidArgs 提供一个字符串数组用于对标志的命令行输入值进行校验，从而构成一种枚举量的输入界面。例如：

```go
 cmdr.NewString().Titles("fruit", "fr").
  Description("the message.", "").
  Group("").
  Placeholder("FRUIT").
  ValidArgs("apple", "banana", "orange").
  AttachTo(mx)
```

:::tip

默认时，当用户输入无效值时，将会被自动忽略。

如果想要得到一个错误提示，可以使用 `cmdr.WithIgnoreWrongEnumValue(ignore = true)` 方式来调用 `cmdr.Exec(root, opts...`)，这将会导致用户无效输入被抛出为 `cmdr.errWrongEnumValue`，你可以在此基础上考虑拦截该错误并再处理。

![image-20200720111415976](/images/cmdr/GBRxCVg72fjoIrH.png)

:::

:::tip

See Also: [hedzr/cmdr-examples](https://github.com/hedzr/cmdr-examples/blob/master/examples/valid-args)

:::

#### Required(required...bool)

如果省却参数，则等价于 `Required(true)`，否则则按实际参数为准。

```go
 cmdr.NewString().
  Titles("required", "required").
  Description("A required flag", "").
  Required().
  AttachTo(parent)

 cmdr.NewString().
  Titles("required2", "required2").
  Description("The required flag 2", "").
  Required(false, true, false, true).
  AttachTo(parent)
```

对于标记为 required 的标志，如果用户没有在命令行显式地提供参数值，则会导致一个错误被抛出。如果你标记了多个必需的标志，则它们会被一一罗列在错误信息中。你可以考虑拦截该错误后自行决定输出的文本内容，否则如果采用 `logrus.Fatalf("error: %v", err)` 会得到类似于这样的输出：

![image-20200724141654339](/images/cmdr/6kMyWwacIlXU4Ai.png)

:::tip

需要 `cmdr` v1.6.51

:::

### Option Store 配置选项数据集

Option Store 中的配置选项数据集来自这些地方：

- 通过 `cmdr.NewBool`, `cmdr.NewString` 等接口定义的命令行标志信息中提供的缺省值。例如：

  ```go
   cmdr.NewBool(false).
    Titles("enable-ueh", "ueh").
    EnvKeys("ENABLE_UEH").
    Description("Enables the unhandled exception handler?").
    AttachTo(root)
  ```

  这里定义了一个 Bool 类型的标志（Flag），其默认值为 false，如果终端用户没有作出指定，则 Option Store 中会包含该条目且具有 bool 值 false。你可以通过 `cmdr.GetBoolR('enable-ueh')` 取得该值。

  > 标志总是带有默认值 false，一般较少会使用 true值。
  >
  > Toggleable Flags Group 例外，通常在组里会有一个 Flag 具有默认值 true。

- 通过命令行参数指定的。例如：

  ```bash
  go run ./cli --enable-ueh
  ```

  这里会通过命令行将 enable-ueh 的值设置为 true。

  此时，通过 `cmdr.GetBoolR('enable-ueh')` 取得的值将会为 true。

- 通过环境变量指定的。例如：

  ```bash
  ENABLE_UEH=1 go run /cli
  ```

  如果在定义 Flag 是没有通过 `.EnvKeys()` 指定环境变量名，`cmdr` 会试图查找自动化命名的环境变量名。例如此例中，自动化的环境变量名应该是 `APP_ENABLE_UEH`，请参考 `cmdr.WithEnvPrefix()` 的相关说明。

- 通过配置文件装入的。例如在主配置文件中包含有如下条目：

  ```yaml
  app: # 这是配置文件的前缀，可以通过 cmdr.WithOptionsPrefix() 自定义
    simple: # 这是通过 cmdr.Root(appName, version) 所指定的应用程序名
      enable-ueh: true   # 字段名称应该等于 Flag 的 Full 字段值
  
  ```

- 通过 `cmdr.Set(keyPath, value)` 设置的。

#### Kilo-bytes

:::tip

See Also: [hedzr/cmdr-examples](https://github.com/hedzr/cmdr-examples/blob/master/examples/kilo-bytes)

:::

### 标志的相关事件

#### onOptionModifying

在 cmdr.Exec() 时，可以指定全局的选项变化监听器：

```go
cmdr.WithOptionModifying(func(keyPath string, value, oldVal interface{}) {
   cmdr.Logger.Debugf("-> -> onOptionModifying: %q - %v -> %v", keyPath, oldVal, value)
}),
```

请注意，选项（Options）意味着，不仅是命令行参数被识别，还是配置文件被载入，都可以触发监听事件。

可以概略地罗列出这些写值方法被调用的情形：

- `cmdr.Set(keyPath, val)`
- `cmdr.SetNx(keyPath, val)`
- 当 cmdr 首次装入配置文件时
- 当 cmdr 处理命令行参数得到一个标志（Flag）时
- 等等

#### onOptionMergeModifying

和 onOptionModifying 相似，你可以指定选项被合并时的事件监听器：

```go
cmdr.WithOptionMergeModifying(func(keyPath string, value, oldVal interface{}) {
   cmdr.Logger.Debugf("-> -> onOptionMergeModifying: %q - %v -> %v", keyPath, oldVal, value)
  }),
```

和 onOptionModifying 的不同之处在于，onOptionMergeModifying 会发生在选项被合并时，所以这些情况下会触发事件：

- `cmdr.MergeWith(keyPath, valMapOrOthers)`
- 当 cmdr 自动重载已被修改的配置文件时
- 其它由于赋值而间接导致多层级选项发生融合的情况

#### onSet

对于每个标志的定义，你可以通过 `onSet` 来为其增加值变更事件监听器：

```go
cmdr.NewBool().Titles("care", "c").Group(">>TEST<<")
  OnSet(func(keyPath string, value interface{}) {
   cmdr.Logger.Debugf("-> -> onSet: %q <- %v", "care", value)
  }).
  AttachTo(root)
```

#### Action, PreAction

TODO

### 标志的匹配

#### 匹配计数

如果用户在命令行中多次输入了某个标志，那么这个标志的内部计数器会相应地增量。在命令的 Action 处理器中可以提取到该标志的命中计数值，该值可能被用于特定的业务逻辑。

例如，cmdr内建的 `--verbose` 标志可以通过短选项合并的方式输入为：

```bash
app -vvv
```

这代表了 `--verbose` 的三次命中计数（等价于 `-v -v -v`）。

> `--verbose --verbose --verbose` 也是可以的，尽管用户大概不一定乐意这么做。

在一个命令的 Action 处理器中，我们可以提取到它：

```go
func action(cmd *cmdr.Command, args []string) (err error) {
 var root *cmdr.RootCommand = cmd.GetRoot()
 var flag *cmdr.Flag = root.FindFlag("verbose")
 var veryVerboseLevel int = flag.GetTriggeredTimes()
  if veryVerboseLevel >= 3 {
    cmdr.Printf("very verbose: ...")
  }
  return
}
```

所以说，有时候，符合使用者直觉的CLI界面设计，可以降低他们使用时的心智负担，但这也需要你去耐心地研究并实现之。

🔚
