---
layout: single
title: "选项管理器 (Option Store)"
date: 2020-07-13 12:10:11 +0800
last-modified: 2020-08-17 01:40:01 +0800
Author: hedzr
tags: [commander, command-line, "command-line-parser", command-line-interface,  getops, posix, posix-compatible, hierarchical-configuration, hierarchy, cli, golang]
categories: golang cmdr guide option-store
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





## 基本定义

Option Store, 或者 Options Store，管理着一个应用程序的全部配置数据。
这些数据可能来自于环境变量、命令行输入、配置文件，甚至是从外部配置中心装载。它们可以有任意的层级和嵌套关系。它们可以包含布尔量，整数，浮点数，字符串，数组，Map 等多种格式的值。

### `keyPath`

`keyPath` 是 `Option Store` 中的专属概念，一个选项能够被通过 `前缀.子命令序列.标志长格式` 的方式被访问，这个格式就被称作 `keyPath`。

例如 `app.cert.create.cacert` 中，app 是内置的前缀，cert.create 代表着 cert 命令及其 create 子命令，cacert 除了是标志的长格式字串之外，也表达出了从属于 cert.create 子命令的含义。

#### 选项(Option)和标志(Flag)的关系

一个标志（Flag），指的是通过 `cmdr.NewBool()` 等接口函数定义的实体，这个实体被用于命令行参数的解释，对应着一个特定的命令行参数选项。

一个选项（Option），指的是储存在 `Option Store` 中的一个条目，例如 `“app.debug” => true`。

一个选项可能和一个标志相关联，但也可能不。但一个标志一定会对应着一个选项。

对于 `app.debug` 这个选项来说，由于 `app` 是内部设定的选项前缀（所以在体现到标志时不予考虑），故顶级标志 `--debug` 与其是关联的。它的 yaml 表示能够体现出层级关系：

```yaml
app:
  debug: true
```

而对于多级子命令的标志，例如 子命令 `cert / create` 的标志 `--cacert`，会对应着 `app.cert.create.cacert` 这个选项。它的 yaml 表示如同这样：

```yaml
app:
  cert:
    create:
      cacert: ca.pem
      cert: cert.pem
      key: cert.key
```

### `GetXXX`

当使用 `GetXXX` 来获取选项值时，R版本能够忽略 `app` 前缀的指定，从而简化你的编程思路。也就是说，`GetBoolR("debug")` 将会取得 `app.debug` 的布尔量值。

一般来说，我们支持如下几种 GetXXX 的变体：

```go
cmdr.GetBool("app.server.start.debug", false) == true
cmdr.GetBoolR("server.start.debug", false) == true
cmdr.GetBoolP("app.server.start", "debug", false) == true
cmdr.GetBoolRP("server.start", "debug", false) == true
```

根据你的上下文代码的便利性，你可以选取最恰当的一种变体。

在多数情况下，为了代码逻辑的清晰性，或者 R 变体版本是最佳的选择。

### `app` 前缀

`app` 前缀是为了在序列化 Option Store 为 YAML 或者其他外部格式时而特别建立的前缀，这样能够保证 Option Store 的序列化内容能够被恰当地包含到外部配置中心里（无论是 YAML，JSON，TOML，抑或是显式的微服务外部配置中心）。

`cmdr.WithOptionsPrefix(prefixes...)` 允许你定制前缀，你可以不必使用内置的 `app` 前缀而是使用 `voxr.app-gateway.` 作为前缀：

```go
func main() {
 if err := cmdr.Exec(buildRootCmd(), 
              cmdr.WithOptionsPrefix("voxr", "app-gateway"),
              ); err != nil {
  fmt.Printf("error: %+v\n", err)
 }
}
```

而对于同一个系统 voxr 的 api 服务，则可以使用 `voxr.api.` 作为前缀：

```go
cmdr.WithOptionsPrefix("voxr", "api"),
```

## 构造过程

Option Store 包含了一整颗键值对的树结构。

这棵树是在 cmdr.Exec() 的初始化部分被构造的。

### 来源

Option Store 中的配置数据来自这些地方：

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

### 构造 Xref 索引

在从来源构建键值对的树状结构的同时，cmdr 也会建立内部使用的索引表。这些索引表有多种用途，其中之一是完善用户定义的数据结构，将各命令、标志以及彼此之间的关联关系构造完整。

所以对于 Developers 来说，你可以较为宽松地定义命令或标志，不必太多操心各种细节。

例如你可以定义 `ToggleGroup("fruits")`，但可以略过 `Group("fruits")` 定义，因为在 Xref 构造期间这样的缺省关联关系会被自动补全。

### 外部配置文件

cmdr 自动查找一系列预定义的路径中符合要求的主配置文件（其文件名应该等于应用程序名，并且带有 .yml|yaml|json|toml 后缀），并自动载入其中的参数定义，同时监视该文件所在位置的名为 `conf.d` 的子目录中的任何配置文件，只要它们带有 .yml|yaml|json|toml 后缀 。

#### 控制对配置文件的监视策略

默认时，cmdr 不会监视主配置文件，但 [WithWatchMainConfigFileToo](https://github.com/hedzr/cmdr/blob/v1.6.49/exec_with_options.go#L133) 能够改变这一行为。

[func WithNoWatchConfigFiles(b bool)](https://pkg.go.dev/github.com/hedzr/cmdr?tab=doc#WithNoWatchConfigFiles) 可以关闭 cmdr 对配置文件或/及其子目录的监视。

[func WithNoLoadConfigFiles(b bool)](https://pkg.go.dev/github.com/hedzr/cmdr?tab=doc#WithNoLoadConfigFiles) 则完全跳过载入配置文件的环节。

#### 预定义位置

默认时，预定位置为如下的数组：

```go
[]string{
  "./ci/etc/%s/%s.yml",       // for developer
  "/etc/%s/%s.yml",           // regular location
  "/usr/local/etc/%s/%s.yml", // regular macOS HomeBrew location
  "$HOME/.config/%s/%s.yml",  // per user
  "$HOME/.%s/%s.yml",         // ext location per user
  "$THIS/%s.yml",             // executable's directory
  "%s.yml",                   // current directory
},
```

其中的 `$HOME`，`$THIS` 会通过环境变量展开，`$THIS` 表示执行文件所在的目录。`%s` 会被展开为 应用程序名。

通过 [WithPredefinedLocations](https://github.com/hedzr/cmdr/blob/v1.6.49/exec_with_options.go#L115) 你可以定制这个数组，从而自定义 cmdr 如何去寻找主配置文件，包括当你想要主配置文件不一定采用应用程序名称时，也能从此处进行改变。

#### 更新后处理

如果你愿意提供对外部依赖资源（例如 redis 服务）的动态重新初始化的能力的话，通过 [WithConfigLoadedListener](https://github.com/hedzr/cmdr/blob/v1.6.49/exec_with_options.go#L154) 可以实现这样的特性，当然具体实施依然会是很复杂的，你需要有正确的解决数据竞争的代码逻辑。

### Handlers

#### `WithXrefBuildingHooks`

[`WithXrefBuildingHooks`](https://github.com/hedzr/cmdr/blob/v1.6.49/exec_with_options.go#L23) 可以在 cmdr 的 Xref 索引构造前后设置拦截器。

一般的说，后置拦截器是一个很有用的拦截点。因为在这个时候，所有常规途径的命令行参数定义都被预处理过了，所有环境变量值都已经被关联到对应的选项了，所有的外部配置文件中的值都已经被解释并构造到 Option Store 中了。所以此时如果你要追加针对整棵树的操作的话，这里就是最佳的切入点。

#### `WithAfterArgsParsed`

cmdr 在 Xref 索引构建完成之后会开始解释命令行参数。而当命令行参数被有效地解释之后，[WithAfterArgsParsed](https://github.com/hedzr/cmdr/blob/v1.6.49/exec_with_options.go#L387) 所定义的回调函数将获得执行机会，如果回调函数无错地返回，则 cmdr 将会转去执行已经命中的 子命令的响应函数（Action），否则的话 cmdr 放弃进一步操作退出应用程序。

所以这里可以做全局的身份鉴定，参数有效性验证等操作——根据你的实际需要。

#### `WithConfigLoadedListener`

在 cmdr 执行命中子命令的 Action 函数的过程中，外部配置文件也处于被监视的状态中。如果外部配置文件发生了变化，那么对应的文件将被自动载入并合并到 `Option Store` 的现有参数树中，然后 [WithConfigLoadedListener](https://github.com/hedzr/cmdr/blob/v1.6.49/exec_with_options.go#L154) 所指定的回调函数将会获得一个阐述这些变更的机会。

如果你愿意提供对外部依赖资源（例如 redis 服务）的动态重新初始化的能力的话，通过 [WithConfigLoadedListener](https://github.com/hedzr/cmdr/blob/v1.6.49/exec_with_options.go#L154) 可以实现这样的特性，当然具体实施依然会是很复杂的，你需要有正确的解决数据竞争的代码逻辑。

#### `WithAutomaticEnvHooks`

在外部配置文件被解释之后，cmdr 的初始化代码也会扫描环境变量并完成映射。

在完成了匹配的环境变量的映射操作之后， [WithAutomaticEnvHooks](https://github.com/hedzr/cmdr/blob/v1.6.49/exec_with_options.go#L37) 所指定的回调函数会获得执行机会。你可以借助这个回调函数对默认的映射结果进行审视。

🔚
