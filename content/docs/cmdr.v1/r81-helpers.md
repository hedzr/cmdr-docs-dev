---
layout: single
title: "工具函数 (Helpers)"
date: 2020-07-13T11:45:11+08:00
last-modified: 2020-08-17 12:52:01 +0800
author: hedzr
tags: [commander, command-line, "command-line-parser", command-line-interface,  getops, posix, posix-compatible, hierarchical-configuration, hierarchy, cli, golang]
categories: golang cmdr guide config-file
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




> Cmdr 也包含一些辅助函数（Helpers functions）。

### 对 Option Store 的操作

#### func `AsJSON`

```go
func AsJSON() (b []byte)
```

[AsJSON](https://github.com/hedzr/cmdr/blob/v1.7.11/options.go#L676) returns a json string bytes about all options

#### func `AsJSONExt`

```go
func AsJSONExt() (b []byte, err error)
```

[AsJSONExt](https://github.com/hedzr/cmdr/blob/v1.7.11/options.go#L682) returns a json string bytes about all options

#### func `AsToml`

```go
func AsToml() (b []byte)
```

[AsToml](https://github.com/hedzr/cmdr/blob/v1.7.11/options.go#L697) returns a toml string bytes about all options

#### func `AsTomlExt`

```go
func AsTomlExt() (b []byte, err error)
```

[AsTomlExt](https://github.com/hedzr/cmdr/blob/v1.7.11/options.go#L718) returns a toml string bytes about all options

#### func `AsYaml`

```go
func AsYaml() (b []byte)
```

[AsYaml](https://github.com/hedzr/cmdr/blob/v1.7.11/options.go#L652) returns a yaml string bytes about all options

#### func `AsYamlExt`

```go
func AsYamlExt() (b []byte, err error)
```

[AsYamlExt](https://github.com/hedzr/cmdr/blob/v1.7.11/options.go#L658) returns a yaml string bytes about all options

#### func `DeleteKey`

```go
func DeleteKey(key string)
```

[DeleteKey](https://github.com/hedzr/cmdr/blob/v1.7.11/options_impl.go#L51) deletes a key from cmdr options store

#### func `GetHierarchyList`

```go
func GetHierarchyList() map[string]interface{}
```

[GetHierarchyList](https://github.com/hedzr/cmdr/blob/v1.7.11/options.go#L752) returns the hierarchy data

#### func `GetSectionFrom`

```go
func GetSectionFrom(sectionKeyPath string, holder interface{}) (err error)
```

[GetSectionFrom](https://github.com/hedzr/cmdr/blob/v1.7.11/options.go#L462) returns error while cannot yaml Marshal and Unmarshal `cmdr.GetSectionFrom(sectionKeyPath, &holder)` could load all sub-tree nodes from sectionKeyPath and transform them into holder structure, such as:

```go
type ServerConfig struct {
  Port int
  HttpMode int
  EnableTls bool
}
var serverConfig = new(ServerConfig)
cmdr.GetSectionFrom("server", &serverConfig)
assert serverConfig.Port == 7100
```

#### func `HasKey`

```go
func HasKey(key string) (ok bool)
```

[HasKey](https://github.com/hedzr/cmdr/blob/v1.7.11/options.go#L25) detects whether a key exists in cmdr options store or not

#### func `MergeWith`

```go
func MergeWith(m map[string]interface{}) (err error)
```

[MergeWith](https://github.com/hedzr/cmdr/blob/v1.7.11/options.go#L636) will merge a map recursive. You could merge a yaml/json/toml options into cmdr Hierarchy Options.

#### func `ResetOptions`

```go
func ResetOptions()
```

[ResetOptions](https://github.com/hedzr/cmdr/blob/v1.7.11/options.go#L642) to reset the exists `Options`, so that you could follow a `LoadConfigFile()` with it.

#### func `SaveAsJSON`

```go
func SaveAsJSON(filename string) (err error)
```

[SaveAsJSON](https://github.com/hedzr/cmdr/blob/v1.7.11/options.go#L690) to Save all config entries as a json file

#### func `SaveAsToml`

```go
func SaveAsToml(filename string) (err error)
```

[SaveAsToml](https://github.com/hedzr/cmdr/blob/v1.7.11/options.go#L730) to Save all config entries as a toml file

#### func `SaveAsYaml`

```go
func SaveAsYaml(filename string) (err error)
```

[SaveAsYaml](https://github.com/hedzr/cmdr/blob/v1.7.11/options.go#L666) to Save all config entries as a yaml file

#### func `SaveObjAsToml`

```go
func SaveObjAsToml(obj interface{}, filename string) (err error)
```

[SaveObjAsToml](https://github.com/hedzr/cmdr/blob/v1.7.11/options.go#L737) to Save an object as a toml file

#### func `WrapWithRxxtPrefix`

```go
func WrapWithRxxtPrefix(key string) string
```

[WrapWithRxxtPrefix](https://github.com/hedzr/cmdr/blob/v1.7.11/options.go#L599) wrap an key with [RxxtPrefix], for [GetXxx(key)] and [GetXxxP(prefix,key)]

### 文件、文件夹操作

#### func `EnsureDir`

```go
func EnsureDir(dir string) (err error)
```

[EnsureDir](https://github.com/hedzr/cmdr/blob/v1.7.11/dir.go#L74) checks and creates the directory.

#### func `EnsureDirEnh`

```go
func EnsureDirEnh(dir string) (err error)
```

[EnsureDirEnh](https://github.com/hedzr/cmdr/blob/v1.7.11/dir.go#L79) checks and creates the directory, via sudo if necessary.

#### func `FileExists`

```go
func FileExists(name string) bool
```

[FileExists](https://github.com/hedzr/cmdr/blob/v1.7.11/dir.go#L64) returns the existence of an directory or file

#### func `GetCurrentDir`

```go
func GetCurrentDir() string
```

[GetCurrentDir](https://github.com/hedzr/cmdr/blob/v1.7.11/dir.go#L36) returns the current workingFlag directory it should be equal with os.Getenv("PWD")

#### func `GetExecutableDir`

```go
func GetExecutableDir() string
```

[GetExecutableDir](https://github.com/hedzr/cmdr/blob/v1.7.11/dir.go#L16) returns the executable file directory

#### func `GetExecutablePath`

```go
func GetExecutablePath() string
```

[GetExecutablePath](https://github.com/hedzr/cmdr/blob/v1.7.11/dir.go#L29) returns the executable file path

#### func `IsDirectory`

```go
func IsDirectory(path string) (bool, error)
```

[IsDirectory](https://github.com/hedzr/cmdr/blob/v1.7.11/dir.go#L46) tests whether `path` is a directory or not

#### func `IsRegularFile`

```go
func IsRegularFile(path string) (bool, error)
```

[IsRegularFile](https://github.com/hedzr/cmdr/blob/v1.7.11/dir.go#L55) tests whether `path` is a normal regular file or not

#### func `NormalizeDir`

```go
func NormalizeDir(s string) string
```

[NormalizeDir](https://github.com/hedzr/cmdr/blob/v1.7.11/dir.go#L109) make dir name normalized

#### func `RemoveDirRecursive`

```go
func RemoveDirRecursive(dir string) (err error)
```

[RemoveDirRecursive](https://github.com/hedzr/cmdr/blob/v1.7.11/dir.go#L84) removes a directory and any children it contains.

### Debugger/Debugging 操作

#### func `GetDebugMode`

```go
func GetDebugMode() bool
```

[GetDebugMode](https://github.com/hedzr/cmdr/blob/v1.7.11/def.go#L276) returns the flag value of `--debug`/`-D`

NOTE

```go
log.GetDebugMode()/SetDebugMode() have higher universality
```

#### func `GetNoColorMode`

```go
func GetNoColorMode() bool
```

[GetNoColorMode](https://github.com/hedzr/cmdr/blob/v1.7.11/def.go#L300) return the flag value of `--no-color`

#### func `GetQuietMode`

```go
func GetQuietMode() bool
```

[GetQuietMode](https://github.com/hedzr/cmdr/blob/v1.7.11/def.go#L295) returns the flag value of `--quiet`/`-q`

#### func `GetStrictMode`

```go
func GetStrictMode() bool
```

[GetStrictMode](https://github.com/hedzr/cmdr/blob/v1.7.11/def.go#L258) enables error when opt value missed. such as: xxx a b --prefix'' => error: prefix opt has no value specified. xxx a b --prefix'/' => ok.

ENV: use `CMDR_APP_STRICT_MODE=true` to enable strict-mode. NOTE: `CMDR_APP_` prefix could be set by user (via: `EnvPrefix` && `RxxtPrefix`).

the flag value of `--strict-mode`.

#### func `GetTraceMode`

```go
func GetTraceMode() bool
```

[GetTraceMode](https://github.com/hedzr/cmdr/blob/v1.7.11/def.go#L267) returns the flag value of `--trace`/`-tr`

NOTE

```go
log.GetTraceMode()/SetTraceMode() have higher universality
```

#### func `GetVerboseMode`

```go
func GetVerboseMode() bool
```

[GetVerboseMode](https://github.com/hedzr/cmdr/blob/v1.7.11/def.go#L290) returns the flag value of `--verbose`/`-v`

#### func `InDebugging`

```go
func InDebugging() bool
```

[InDebugging](https://github.com/hedzr/cmdr/blob/v1.7.11/logex.go#L191) return the status if cmdr was built with debug mode / or the app running under a debugger attached.

To enable the debugger attached mode for cmdr, run `go build` with `-tags=delve` options. eg:

```bash
go run -tags=delve ./cli
go build -tags=delve -o my-app ./cli
```

For Goland, you can enable this under 'Run/Debug Configurations', by adding the following into 'Go tool arguments:'

```bash
-tags=delve
```

InDebugging() is a synonym to IsDebuggerAttached().

NOTE that `isdelve` algor is mentioned [here](https://stackoverflow.com/questions/47879070/how-can-i-see-if-the-goland-debugger-is-running-in-the-program).

noinspection GoBoolExpressions

#### func `InTesting`

```go
func InTesting() bool
```

[InTesting](https://github.com/hedzr/cmdr/blob/v1.7.11/logex.go#L216) detects whether is running under go test mode

#### func `IsDebuggerAttached`

```go
func IsDebuggerAttached() bool
```

[IsDebuggerAttached](https://github.com/hedzr/cmdr/blob/v1.7.11/logex.go#L211) return the status if cmdr was built with debug mode / or the app running under a debugger attached.

To enable the debugger attached mode for cmdr, run `go build` with `-tags=delve` options. eg:

```bash
go run -tags=delve ./cli
go build -tags=delve -o my-app ./cli
```

For Goland, you can enable this under 'Run/Debug Configurations', by adding the following into 'Go tool arguments:'

```bash
-tags=delve
```

IsDebuggerAttached() is a synonym to InDebugging().

NOTE that `isdelve` algor is mentioned [here](https://stackoverflow.com/questions/47879070/how-can-i-see-if-the-goland-debugger-is-running-in-the-program).

noinspection GoBoolExpressions

### 配置文件操作 (Config file Operations)

#### func `GetPredefinedLocations`

```go
func GetPredefinedLocations() []string
```

[GetPredefinedLocations](https://github.com/hedzr/cmdr/blob/v1.7.11/predefined_locations.go#L81) return the searching locations for loading config files.

#### func `GetUsedConfigFile`

```go
func GetUsedConfigFile() string
```

[GetUsedConfigFile](https://github.com/hedzr/cmdr/blob/v1.7.11/options_watch.go#L31) returns the main config filename (generally it's `<appname>.yml`)

#### func `GetUsedConfigSubDir`

```go
func GetUsedConfigSubDir() string
```

[GetUsedConfigSubDir](https://github.com/hedzr/cmdr/blob/v1.7.11/options_watch.go#L38) returns the sub-directory `conf.d` of config files. Note that it be always normalized now. Sometimes it might be empty string ("") if `conf.d` have not been found.

#### func `GetUsingConfigFiles`

```go
func GetUsingConfigFiles() []string
```

[GetUsingConfigFiles](https://github.com/hedzr/cmdr/blob/v1.7.11/options_watch.go#L44) returns all loaded config files, includes the main config file and children in sub-directory `conf.d`.

#### func `LoadConfigFile`

```go
func LoadConfigFile(file string) (err error)
```

[LoadConfigFile](https://github.com/hedzr/cmdr/blob/v1.7.11/options_watch.go#L91) loads a yaml config file and merge the settings into `rxxtOptions` and load files in the `conf.d` child directory too.

### More

`tool` 子包中也包含一些工具函数。

## 🔚
