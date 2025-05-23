---
title: "Guide"
description: "logg/slog logging library"
---


## Guide

### Basics

`logg/slog` has package-level functions for logging: `Info`, `Error`, and so on. They will be mapped to the builtin default logger (can be accessed by `Default()`).

`Default()` returns the default logger and `SetDefult()` replaces it.

The basic usages are:

```go
package main

import (
 "context"
 "errors"
 "fmt"
 "log/slog"
 "os"
 "sync"
 "time"

 "github.com/hedzr/is"
 "github.com/hedzr/is/basics"
 "github.com/hedzr/is/term"
 "github.com/hedzr/is/term/color"

 logz "github.com/hedzr/logg/slog"
)

func main() {
 defer basics.Close()

 ctx, cancel := context.WithCancel(context.Background())
 defer cancel()

 testIs(ctx)
 testLogz(ctx)

 catcher := is.Signals().Catch()
 catcher.
  WithPrompt("Press CTRL-C to quit...").
  WithOnLoopFunc(dbStarter, cacheStarter, mqStarter).
  WithOnSignalCaught(func(sig os.Signal, wg *sync.WaitGroup) {
    println()
    slog.Info("signal caught", "sig", sig)
    cancel() // cancel user's loop, see <-ctx.Done() in Wait(...)
  }).
  WaitFor(func(closer func()) {
    slog.Debug("entering looper's loop...")
    defer closer()
    // to terminate this app after a while automatically:
    time.Sleep(10 * time.Second)
    // stopChan <- os.Interrupt
    <-ctx.Done() // waiting for main program stop
  })
}

func testIs(ctx context.Context) {
 is.RegisterStateGetter("custom", func() bool { return is.InVscodeTerminal() })

 println("state.InTesting:   ", is.InTesting())
 println("state.in-testing:  ", is.State("in-testing"))
 println("state.custom:      ", is.State("custom")) // detects a state with custom detector
 println("env.GetDebugLevel: ", is.Env().GetDebugLevel())
 if is.InDebugMode() {
  slog.SetDefault(slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{AddSource: true, Level: slog.LevelDebug})))
 }

 fmt.Printf("\n%v", color.GetCPT().Translate(`<code>code</code> | <kbd>CTRL</kbd>
  <b>bold / strong / em</b>
  <i>italic / cite</i>
  <u>underline</u>
  <mark>inverse mark</mark>
  <del>strike / del </del>
  <font color="green">green text</font>
`, color.FgDefault))

 println("term.IsTerminal:               ", term.IsTerminal(int(os.Stdout.Fd())))
 println("term.IsAnsiEscaped:            ", term.IsAnsiEscaped(color.GetCPT().Translate(`<code>code</code>`, color.FgDefault)))
 println("term.IsCharDevice(stdout):     ", term.IsCharDevice(os.Stdout))
 rows, cols, err := term.GetFdSize(os.Stdout.Fd())
 println("term.GetFdSize(stdout):        ", rows, cols, err)
 rows, cols, err = term.GetTtySizeByFd(os.Stdout.Fd())
 println("term.GetTtySizeByFd(stdout):   ", rows, cols, err)
 rows, cols, err = term.GetTtySizeByFile(os.Stdout)
 println("term.GetTtySizeByFile(stdout): ", rows, cols, err)
 println("term.IsStartupByDoubleClick:   ", term.IsStartupByDoubleClick())

 logz.InfoContext(ctx, "pre-forecasting") // by default this line shall not be displayed since logz (logg/slog) is in WarnLevel.
}

func testLogz(ctx context.Context) {
 logz.SetLevel(logz.DebugLevel)

 logz.InfoContext(ctx, "Hello, world!")

 logz.InfoContext(ctx, "Hello", "target", "world")
 logz.Default().SetColorMode(false)
 logz.InfoContext(ctx, "Hello", "target", "world")
 logz.Default().SetJSONMode(true)
 logz.InfoContext(ctx, "Hello", "target", "world")

 testLogzAdapter(ctx)

 testLogz1(ctx)
}

func testLogz1(ctx context.Context) {
 msg := "A message"
 args := []any{
  "attr1", 0,
  "attr2", false,
  "attr3", 3.13,
  "attr4", errors.New("simple"),
  // ,,,
  logz.Group("group1",
   "attr1", 0,
   "attr2", false,
   logz.NewAttr("attr3", "any styles what u prefer"),
   "attrn", // unpaired key can work here
   logz.Group("more", "group", []byte("more subgroup here")),
  ),
  // ...
  logz.Int("id", 23123),
  logz.Group("properties",
   logz.Int("width", 4000),
   logz.Int("height", 3000),
   logz.String("format", "jpeg"),
  ),
 }

 // disable unconditional termination inside logz.Panic/Fatal() calls.
 logz.AddFlags(logz.LnoInterrupt)

 logz.Print("")   // logging a clean newline without decorations
 logz.Println("") // logging a clean newline without decorations
 logz.Println()   // logging a clean newline without decorations
 logz.Print(msg, args...)
 logz.Println(msg) // synosym of Print
 logz.Fatal(msg, args...)
 logz.Panic(msg, args...)
 logz.Error(msg, args...)
 logz.Warn(msg, args...)
 logz.Info(msg, args...)
 logz.Debug(msg, args...)
 logz.Trace(msg, args...)

 // only print the logging contents while built with `-tags verbose`
 logz.Verbose(msg, args...) //

 // some verbs with more meanings
 logz.OK("ok")
 logz.OK("ok", args...)
 logz.Success(msg, args...)
 logz.Fail(msg, args...)

 // Contextual logging
 logz.InfoContext(ctx, "info msg", args...)

 logName := "child1"
 log := logz.New(logName)
 defer log.Close() // when you added file writer into `log`

 log.Print("")   // logging a clean newline without decorations
 log.Println("") // logging a clean newline without decorations
 log.Println()   // logging a clean newline without decorations
 log.Print(msg, args...)
 log.Println(msg) // synosym of Print
 log.Fatal(msg, args...)
 log.Panic(msg, args...)
 log.Error(msg, args...)
 log.Warn(msg, args...)
 log.Info(msg, args...)
 log.Debug(msg, args...)
 log.Trace(msg, args...)

 log.LogAttrs(ctx, logz.DebugLevel, "debug msg", args...)
}

func testLogzAdapter(ctx context.Context) {
 l := logz.New("standalone-logger-for-app",
  logz.NewAttr("attr1", 2),
  logz.NewAttrs("attr2", 3, "attr3", 4.1),
  "attr4", true, "attr3", "string",
  logz.WithLevel(logz.AlwaysLevel),
 )
 defer l.Close()

 sub1 := l.New("sub1").With("logger", "sub1")
 sub2 := l.New("sub2").With("logger", "sub2").
  WithLevel(logz.InfoLevel) // a new child instance here

 // create a log/slog logger HERE
 logger := slog.New(logz.NewSlogHandler(l, &logz.HandlerOptions{
  NoColor:  false,
  NoSource: true,
  JSON:     false,
  Level:    logz.DebugLevel,
 }))

 l.Infof("logger: %v", logger)
 l.Infof("l: %v", l)

 // and logging with log/slog
 logger.DebugContext(ctx, "hi debug", "AA", 1.23456789)
 logger.InfoContext(ctx,
  "incoming request",
  slog.String("method", "GET"),
  slog.String("path", "/api/user"),
  slog.Int("status", 200),
 )

 // now using our logg/slog interface
 sub1.DebugContext(ctx, "hi debug", "AA", 1.23456789)
 sub2.DebugContext(ctx, "hi debug", "AA", 1.23456789)
 sub2.InfoContext(ctx, "hi info", "AA", 1.23456789)
}

func dbStarter(closer func()) {
 defer closer()
 // initializing database connections...
 // ...
}

func cacheStarter(closer func()) {
 defer closer()
 // initializing redis cache connections...
 // ...
}

func mqStarter(closer func()) {
 defer closer()
 // initializing message queue connections...
 // ...
}
```

The sub-loggers are also supported, see [SubLogger](#sublogger).

#### Println

A `Println(args ...any)` has slight differences with other verbs like `Print(msg string, args ...any)`. But you are using it with same form like others. That is, the first of the args passing to Println is indeed a msg string.

Just a little benefit, you can pass nothing to Println. If you're doing with this way, a complete blank line printed by `slog.Println()`, no timestamp, no serverity, and no caller info. `Println("")` has same behaviour.

```go
slog.Info("1")
slog.Println() // this makes a real blank line, for colorful and logfmt formats
slog.Info("2")
```

In a large long logging outputs, one and more blank line(s) maybe help your focus.

### Customizing Your Verbs

You could wrap `logg/slog` package-level predicates/verbs to provide more features, just like what to do with `OK`, `Success` and `Fail`. For example, the following sample demonstrates how to implement a `Tip` verb:

```go
func Tip(msg string, args...any) {
  if myConditionSatisfied {
    tipper.OK(msg, args...)
  }
}

var tipper logz.Logger // import "logz" "github.com/hedzr/logg/slog"
var onceTipper sync.Once

func init(){
  onceTipper.Do(func(){
    tipper = slog.WithSkip(1)
  })
}
```

`WithSkip(n)` tells log/slog to strip extra n frames from caller stack so the logged message can hook to the caller of Tip(), rather than Line 3 in `Tip()`.

Also, using a custom level is a not-bad idea. See the [Customizing the Level](#customizing-the-level).

### Builtin Output Formats

logg/slog has tree builtin optput formats: logfmt, json and colorful mode.

The default output is colorful to fit for debug console. But you can switch to the other two easily:

```go
slog.SetJSONMode()       // to get JSON format
slog.SetColorMode(false) // to get logfmt format
slog.SetColorMode()      // return to colorful mode
```

~~The above settings modify and apply effects to all loggers globally~~.

~~`logg/slog` has no way to modify formats for certain a logger or sub-logger. We do believe that's normal action to keep a uniform output format~~.

Each sub logger or detached loggers keep their own output formats, which can be changed dynamically.

The outputs:

```bash
{"time":"14:53:10.907238+08:00","level":"debug","msg":"Debug message","source":{"function":"github.com/hedzr/logg/slog_test.TestSlogJSON","file":"./i_test.go","line":42}}

time="14:52:50.083343+08:00" level="debug" msg="Debug message" source.function="github.com/hedzr/logg/slog_test.TestSlogLogfmt" source.file="./i_test.go" source.line=68

```

and,

![image-20231028145416343](/images/logg/image-20231028145416343.png)

### Set Level

The default is `WarnLevel` for a released app. If debugger detected the `DebugLevel` will be assumed.

Also the executable path will be tested for looking up if runing in test mode.

```go
slog.SetLevel(slog.InfoLevel)
println(slog.Level)
```

Each sub-logger can hold its own level different with their parents or default logger.

To restore old level on Default logger, `SaveLevelAndSet` is available:

```go
func TestSlogBasic2(t *testing.T) {
    defer slog.SaveLevelAndSet(slog.TraceLevel)()
    slog.Debug("Debug message") // should be enabled now
    slog.Info("Info message")   // should be enabled now
    slog.Warn("Warning message")
    slog.Error("Error message")
}
```

### Sublogger

`logger.WithXXX` can return a new sub logger, or get it by `New`.

```go
import logz "github.com/hedzr/logg/slog"

sub1 := logz.New("sub1")
sub2 := logz.Default().WithLevel(logz.TraceLevel)
sub3 := logz.Default().New("sub3")
sub4 := logz.New(
  WithJSONMode(false, false),
  WithColorMode(false),
  WithUTCMode(false, true, false),
  WithTimeFormat("", "", time.RFC3339Nano),
  WithAttrs(Int("a", 1)),
  WithAttrs1(NewAttrs("a", 1)),
  With("b", 2),
)

ss1 := sub3.New("sub3-ss1")
ss2 := sub3.New("sub3-ss2")

ss3 := sub4.WithSkip(1)

_ = `
............. tree .............
- (Default)
  - sub2
  - sub3
    - sub3-ss1
    - sub3-ss2
- sub1 (detached logger)
- sub4 (detached logger)
  - ss3
`
```

Passing a sublogger name as first arg to `New()` is useful. It is optional.

#### Detached Logger

A detached logger means that is splitted from `Default()` tree. `Default().New()` will make a tree of its child sub loggers. But package-level `New()` can build a clean sub logger detached with `Default()`.

```go
logger := slog.New() // colorful logger, detached
logger := slog.New().SetJSONMode() // json format logger, detached
logger := slog.New().SetColorMode(false) // logfmt logger, detached
logger := slog.New().Set("attr1", v1, "attr2", v2)) // detached

// sublogger name is optional:
logger := slog.New("name")
logger := slog.New("name", slog.WithAttrs(args...))
logger := slog.New("name", slog.NewAttr("attr1", v1))
logger := slog.New("name", slog.Int("attr1", i1))
logger := slog.New("name", slog.Group("group1", slog.Int("attr1", i1)))
logger := slog.New("name", "attr1", v1, "attr2", v2).SetAttrs(args...)

// child of child
sl := logger.New()
sl1 = logger.New("grandson")
sl2 = logger.WithLevel(slog.InfoLevel) // another child, since v0.7,x and v1

// since v0.7 and v1, WithXXX can get a new sublogger, SetXXX not.

// as a compasion, children of Default()
logger = slog.Default().New()
sl1 := logger.New()
sl2 := logger.WithLevel(slog.InfoLevel)
```

Sublogger is lightweight,

```go
logger := slog.New(args...).SetLevel(slog.InfoLevel)

// .New() makes a child logger,
sl1 := logger.New().SetLevel(slog.TraceLevel)
sl2 := Default().New() // keep the parent's level
// .WithXXX() makes a child logger
sl3 := logger.WithLevel(slog.TraceLevel)
```

By default, parent shares his features (level and other settings) to children, so `sl2` get `InfoLevel` same with `logger`.

#### Inheritance

If `LattrsR` is set, the parent's attributes will be inherited to. For performance reason, it isn't enabled by default.

```go
logger := slog.New("parent-logger").Set("attr", "parent").SetLevel(slog.InfoLevel)
sl := logger.New("child-logger")

slog.AddFlags(slog.LattrsR)
sl.Info("info", "attr1", 1)    // also dumping "attr=parent" from logger
slog.RemoveFlags(slog.LattrsR)
sl.Info("info", "attr1", 1)    // just dumping attrs in sl.
```

The outputs looks like:

```bash
13:35:31.524263+08:00 child-logger [INF] info                                                    attr=parent attr1=1 /Volumes/VolHack/work/godev/cmdr.v2/libs.logg/slog/i_test.go:454 slog_test.TestSlogAttrsR
13:35:31.524276+08:00 child-logger [INF] info                                                    attr1=1 /Volumes/VolHack/work/godev/cmdr.v2/libs.logg/slog/i_test.go:456 slog_test.TestSlogAttrsR
```

A logger or a sublogger could be identify by a unique name. Passing a string as first parameter to `New(...)`, it's assumed the logger name. Be careful that New() with a existed name will get the existed logger, sometimes it perhaps bad although we still kept this feature. Foutunately, `Sublogger(name)` can query a sub logger by name, this would be a guard when you really need many sub loggers.

Passing common attributes and WithOpts following the sublogger name to `New()`, which will parse and interpret all of them. For examples:

```go
    l := slog.New("standalone-logger-for-app",
        slog.NewAttr("attr1", 2),
        slog.NewAttrs("attr2", 3, "attr3", 4.1),
        "attr4", true, "attr3", "string",
        slog.WithLevel(slog.AlwaysLevel),
    )
    defer l.Close()

    sub1 := l.New("sub1").Set("logger", "sub1")
    sub2 := l.New("sub2").Set("logger", "sub2").SetLevel(slog.InfoLevel)

    sub1.Debug("hi debug", "AA", 1.23456789)
```

Making children loggers is low-cost.

### Holding a Logger

By creating and managing a sublogger, making your own logger might be dead simple:

```go
func newMyLogger2() *mylogger2 {
    l := slog.New("mylogger").SetLevel(slog.InfoLevel)
    s := &mylogger2{
        l, // Provides basic Logger interface such as Info, Debug, etc.
    true, // enable Infof()
        l.WithSkip(1), // A sublogger created here. specially for Infof
    }
    return s
}

type mylogger2 struct {
    slog.Logger
    SprintfLikeLoggingIsEnabled bool
    sl                          slog.Logger
}

func (s *mylogger2) Close() { s.Logger.Close() }

func (s *mylogger2) Infof(msg string, args ...any) {
    if s.SprintfLikeLoggingIsEnabled {
        if len(args) > 0 {
            // msg = fmt.Sprintf(msg, args...)

            var data []byte
            data = fmt.Appendf(data, msg, args...)
            s.sl.Info(string(data))
        }
        s.sl.Info(msg)
    }
}

func TestSlogBasic4(t *testing.T) {
    l := newMyLogger2()
    l.Infof("what's wrong with %v", "him")
    l.Info("no matter")
    // l.Infof("what's wrong with %v, %v, %v, %v, %v, %v", m1AttrsAsAnySlice()...)
}
```

That is it.

### Logging with Attributes

The attributes can be prepared or passed in several forms.

#### Plain form

```go
    logger.Info("info message",
        "attr1", 0,
        "attr2", false,
        "attr3", 3.13,
    ) // plain key and value pairs
```

#### NewAttr and NewGroupedAttr

```go
logger.Info("info message",
        "attr1", 0,
        "attr4", errors.New("simple"),
        "attr3", 3.13,
        slog.NewAttr("attr3", "any styles what u prefer"),
        slog.NewGroupedAttrEasy("group1", "attr1", 13, "attr2", false),
    ) // use NewAttr, NewGroupedAttrs
```

#### Int, Float, String, Any, ..., and Group

logg/slog supports strong typed attributes:

```go
logger.Info("image uploaded",
        slog.Int("id", 23123),
        slog.Group("properties",
            slog.Int("width", 4000),
            slog.Int("height", 3000),
            slog.String("format", "jpeg"),
        ),
    ) // use Int, Float, String, Any, ..., and Group
```

These interfaces are very similar with standard log/slog.

#### Mixes all above forms

The above forms can be mixed in any order together.

```go
logger.Info("image uploaded",
        "attr1", 0,
        "attr2", false,
        "attr3", 3.13,
        "attr4", errors.New("simple"),
        // ,,,
        slog.Group("group1",
            "attr1", 0,
            "attr2", false,
            slog.NewAttr("attr3", "any styles what u prefer"),
            slog.Group("more", "group", []byte("more sub-attrs")),
            "attrN", // unpaired key can work here
        ),
        // ...
        slog.Int("id", 23123),
        slog.Group("properties",
            slog.Int("width", 4000),
            slog.Int("height", 3000),
            slog.String("format", "jpeg"),
        ),
    )
```

#### Work with common Attributes

While creating a sublogger, you could specify some common attributes. They are no more effects for performance reason by default. `log.Info` and others printers will check out and print all of parents' common attributes while `LattrsR` is set.

Both of the following forms are valid:

```go
// available forms
logger := slog.New("logger-name")
logger := slog.New("logger-name", slog.WithAttrs(args...))
logger := slog.New("logger-name", slog.NewAttr("attr1", v1))
logger := slog.New("logger-name", slog.Int("attr1", i1))
logger := slog.New("logger-name", slog.Group("group1", slog.Int("attr1", i1)))
logger := slog.New("logger-name", "attr1", v1, "attr2", v2).WithAttrs(args...)
logger := slog.New("attr1", v1, "attr2", v2).WithAttrs(args...) // no name is ok

// the attributes will be printed out if LattrsR set,
slog.AddFlags(slog.LattrsR)
logger.Info("message", "type", "int") // Out: ,,, A message    attr1=v1 attr2=v2 ... type=int
```

#### Grouping attributes

See above of above.

### Logging contextual attrs

Same to standard `log/slog`, `logg/slog` has LogAttrs() to log attributes contextually.

```go
    logger := slog.New().SetAttrs(slog.String("app-version", "v0.0.1-beta"))
    ctx := context.Background()
    logger.InfoContext(ctx, "info msg", "attr1", 111333,
        slog.Group("memory",
            slog.Int("current", 50),
            slog.Int("min", 20),
            slog.Int("max", 80)),
        slog.Int("cpu", 10),
    )
```

#### Extracting attrs from context

Sometimes the attributes can be extracted from context.Context.

```go
func TestSlogWithContext(t *testing.T) {
    logger := slog.New().SetAttrs(slog.String("app-version", "v0.0.1-beta"))
    ctx := context.WithValue(context.Background(), "ctx", "oh,oh,oh")
    logger.SetContextKeys("ctx").
      InfoContext(ctx, "info msg",
        "attr1", 111333,
        slog.Group("memory",
            slog.Int("current", 50),
            slog.Int("min", 20),
            slog.Int("max", 80)),
        slog.Int("cpu", 10),
    )
}
```

The result:

![image-20231106074712683](/images/logg/image-20231106074712683.png)

As you seen, the value in context was been extracted and printed out.

### Set Writer

`logg/slog` uses a internal `dualWriter` to serialize the logging contents.

A `dualWriter` holds two output devices: `Normal`, and `Error`. `dualWriter` sends contents to stdout or stderr in accord to the requesting logging level. For example, a `Info(...)` calling will be dispatched to stdout and a `Warn`, `Error`, `Panic`, and `Fatal` to stderr.

Not only for those, the dualWriter allows you stack mutiple writers as its `Normal` or `Error` output devices. That means, a console `os.Stdout` and a file writer can be combined into `Normal` at once. How to do it? It's simple:

```go
logger := New("tty+file").AddWriter(slog.NewFileWriter("/tmp/app-stdout.log"))
```

Calling AddWriter on `Default()` would enable the above assembly into the default logger.

In shortly, `AddWriter(w)`/`RemoveWriter`/`ResetWriter` can append/remove/reset the stdout device. `AddErrorWriter(w)`/`RemoveErrorWriter`/`ResetErrorWriter` can append/remove/reset to the stderr device.

Also, `ResetWriters` works so we can always back to default state.

#### io.Writer

A standard `io.Writer` is needed when using AddWriter/WithWriter:

```go
// Simple file
tf, _ := os.CreateTempFile("", "stdout.log")
logger.AddWriter(tf)
```

### Leveled Writers

Your writer can implement `LevelSettable` to handling the requesting logging level.

```go
package mywriter
import (
 "logz" "github.com/hedzr/logg/slog"
)
type myWriter struct {
 level logz.Level
}
func (s *myWriter) SetLevel(level logz.Level) { s.level = level } // logz.LevelSettable
func (s *myWriter) Write(data []byte) (n int, err error) {
 switch(s.level) {
 case logz.DebugLevel:
 // ...
 }
 return
}
```

In this scene, `logg/slog` will call `Write` following `SetLevel`. It's safe in many cases, but you can take more safety for it by using locked mechanism: go build tags `-tags=logglock` will enable a special version with wrapping the two calls in a sync.Mutex. See the source code in entry_lock.go.

Also we provides sub-feature to allow you specify special writer for a special logging level:

```go
func TestAddLevelWriter1(t *testing.T) {
    logger := New().AddLevelWriter(InfoLevel, &decorated{os.Stdout})
    logger.Info("info msg")
    logger.Debug(getMessage(0))
}

type decorated struct {
    *os.File
}

func (s *decorated) Write(p []byte) (n int, err error) {
    if s.File != nil {
        if ni, e := s.File.WriteString("[decorated] "); e != nil {
            err = errors.Join(err, e)
        } else {
            n += ni
        }
        if ni, e := s.File.Write(p); e != nil {
            err = errors.Join(err, e)
        } else {
            n += ni
        }
    }
    return
}
```

The result is similar with:

```bash
[decorated] 10:57:22.986797+08:00 [INF] info msg                              ./new_test.go:170 slog.TestAddLevelWriter1
10:57:22.987031+08:00 [DBG] Test logging, but use a somewhat realistic message length. (#0)  ./new_test.go:171 slog.TestAddLevelWriter1

```

#### Close() and Closables

In most cases, Logger's `Close()` has no more attentions to you.

But adding defer close codes is a best practice, like this:

```go
package main

import "github.com/hedzr/logg/slog"

func main() {
  logger := slog.New("tty+file").AddWriter(slog.NewFileWriter("/tmp/app-stdout.log"))
  defer logger.Close()

  logger.Info("info msg")
}
```

The file writer will get a chance to shutdown itself gracefully.

`Closables` is a concept from is/basics.Closables, see it at [hedzr/is/basics](https://github.com/hedzr/is/blob/master/basics/closers.go).

### Set Handler

..

### Customizing the Level

In `logg/slog`, using your own logging level is enough simple> The following fragments sample you how to make 3 new levels,

```go
const (
    NoticeLevel = slog.Level(17) // A custom level must have a value greater than slog.MaxLevel
    HintLevel   = slog.Level(-8) // Or use a negative number
    SwellLevel  = slog.Level(12) // Sometimes, you may use the value equal with slog.MaxLevel
)

func TestSlogCustomizedLevel(t *testing.T) {
    checkerr(t, slog.RegisterLevel(NoticeLevel, "NOTICE",
        slog.RegWithShortTags([6]string{"", "N", "NT", "NTC", "NOTC", "NOTIC"}),
        slog.RegWithColor(color.FgWhite, color.BgUnderline),
        slog.RegWithTreatedAsLevel(slog.InfoLevel),
    ))

    checkerr(t, slog.RegisterLevel(HintLevel, "Hint",
        slog.RegWithShortTags([6]string{"", "H", "HT", "HNT", "HINT", "HINT "}),
        slog.RegWithColor(color.NoColor, color.BgInverse),
        slog.RegWithTreatedAsLevel(slog.InfoLevel),
    ))

    checkerr(t, slog.RegisterLevel(SwellLevel, "SWELL",
        slog.RegWithShortTags([6]string{"", "S", "SW", "SWL", "SWEL", "SWEEL"}),
        slog.RegWithColor(color.FgRed, color.BgBoldOrBright),
        slog.RegWithTreatedAsLevel(slog.ErrorLevel),
        slog.RegWithPrintToErrorDevice(),
    ))

    logger := slog.New()

    logger.Debug("Debug message")
    logger.Info("Info message")
    logger.Warn("Warning message")
    logger.Error("Error message")

    slog.SetLevelOutputWidth(5)

    ctx := context.Background()
    logger.LogAttrs(ctx, NoticeLevel, "Notice message")
    logger.LogAttrs(ctx, HintLevel, "Hint message")
    logger.LogAttrs(ctx, SwellLevel, "Swell level")
}

func checkerr(t *testing.T, err error) {
    if err != nil {
        t.Error(err)
    }
}
```

Its outputs looks like

![image-20231030144425448](/images/logg/image-20231030144425448.png)

The ansi color representations relyes on your terminal settings.

`SetLevelOutputWidth(n)` lets you can control the level serverity's display width (from 1 to 5). At customizing you should pass an array (`[6]string`) for each levels. For example, HintLevel can be displayed as "HINT" when output width is 4, or as "H" when width is 1. You could change it globally at any time. Just like the snapshot above, it was changed to 5 at last time, so HintLevel has width 5.

### Customizing the Colors

Dislike logg/slog's console colors of each levels? No matter, setup with yours:

```go
import color "github.com/hedzr/is/term/color"

slog.SetLevelColors(slog.PanicLevel, color.FgWhite, color.NoColor)
```

These are standard ANSI escaped sequences, any of SGR fore-, background colors. A special `NoColor` is `-1`.

```go
const NoColor = color.Color(-1)
```

[`hedzr/is`](https://github.com/hedzr/is) provides a color Translator to format your html-like string to ansi colored text for terminal outputting. For more information see hedzr/is doc.

### Adapting into `log/slog`

If you are using unified `log/slog` interfaces, just put `logg/slog` into it:

```go
import logslog "log/slog"
import logz "github.com/hedzr/logg/slog"

func TestSlogUsedForLogSlog(t *testing.T) {
    l := logz.New("standalone-logger-for-app",
        logz.NewAttr("attr1", 2),
        logz.NewAttrs("attr2", 3, "attr3", 4.1),
        "attr4", true, "attr3", "string",
        logz.WithLevel(slog.AlwaysLevel),
    )
    defer l.Close()

    sub1 := l.New("sub1").With("logger", "sub1")
    sub2 := l.New("sub2").With("logger", "sub2").WithLevel(logz.InfoLevel)

    // create a log/slog logger HERE
    logger := logslog.New(logz.NewSlogHandler(l, nil))

    t.Logf("logger: %v", logger)
    t.Logf("l: %v", l)

    // and logging with log/slog
    logger.Debug("hi debug", "AA", 1.23456789)
    logger.Info(
        "incoming request",
        logslog.String("method", "GET"),
        logslog.String("path", "/api/user"),
        logslog.Int("status", 200),
    )

    // now using our logg/slog interface
    sub1.Debug("hi debug", "AA", 1.23456789)
    sub2.Debug("hi debug", "AA", 1.23456789)
    sub2.Info("hi info", "AA", 1.23456789)
}
```

The result:

![image-20231029100643178](/images/logg/image-20231029100643178.png)

Our testing keeps logg/slog native outputs as the last three lines.

In this case, some features of our logg/slog cannot be used via log/slog APIs but it's still colorful.

### Customizing `ValueStringer`

logg/slog allows you handle stringerize value with customizing `ValueStringer`. So you can pass yours.

Here is a sample to pretty print the values in attributes:

```go
import "github.com/alecthomas/repr"

func NewSpewPrinter() *prettyPrinter { //nolint:revive // just a test
    return &prettyPrinter{
        repr.New(os.Stdout, repr.Indent("  ")),
    }
}

type prettyPrinter struct {
    *repr.Printer
}

func (p *prettyPrinter) SetWriter(w io.Writer) {
    p.Printer = repr.New(w, repr.Indent("  "))
}

func (p *prettyPrinter) WriteValue(value any) {
    // p.reprValue(map[reflect.Value]bool{}, reflect.ValueOf(value), "", true, false)
    p.Print(value)
}

func TestSlogCustomValueStringer(t *testing.T) {
    // slog.SetLevel(slog.InfoLevel)
    slog.AddFlags(slog.Lprivacypathregexp | slog.Lprivacypath)

    defer slog.SaveFlagsAnd(func() { //nolint:revive // ok
        slog.AddFlags(slog.Lprettyprint)
    })()

    printer := NewSpewPrinter()

    for _, logger := range []slog.Logger{
        slog.New(" spew ").WithValueStringer(printer),
        slog.New("normal"),
    } {
        logger.Println()
        logger.LogAttrs(
            context.Background(),
            slog.InfoLevel,
            "image uploaded",
            slog.Int("id", 23123),
            slog.Group("properties",
                slog.Int("width", 4000),
                slog.Int("height", 3000),
                slog.String("format", "jpeg"),
                slog.Any("Map", map[int][]float64{3: {3.14, 2.72}, 5: {0.717, 1.732}}),
            ),
        )
    }
}
```

The outputs are:

![image-20231029170419385](/images/logg/image-20231029170419385.png)

To integrete `go-spew` is similar and simple.

### Hide the sensitive fields

Your struct can implement `LogObjectMashaller` or `LogArrayMashaller` so that the sensitive fields can be hardened.

```go
type users []*user

func (uu users) MarshalLogArray(enc *slog.PrintCtx) (err error) {
    for i := range uu {
        if i > 0 {
            enc.WriteRune(',')
        }
        if e := uu[i].MarshalLogObject(enc); e != nil {
            err = errors.Join(err, e)
        }
    }
    return
}

type user struct {
    Name      string    `json:"name"`
    Email     string    `json:"email"`
    CreatedAt time.Time `json:"created_at"`
}

func (u *user) MarshalLogObject(enc *slog.PrintCtx) (err error) {
    enc.AddString("name", u.Name)
    enc.AddRune(',')
    enc.AddString("email", u.Email)
    enc.AddRune(',')
    enc.AddInt64("createdAt", u.CreatedAt.UnixNano())
    return
}
```

`*slog.PrintCtx` is our value encoder.

### Hardening filepath, shorten package name

The caller information could leak the user's names, disk volumes, directory structure and others sensitive contents.

#### Hardening filepath(s)

For this test case:

```go
func TestLogOneTwoThree(t *testing.T) {
    l := slogg.New().WithLevel(slogg.InfoLevel)
    l.Info("info msg", "Aa", 1, "Bbb", "a string", "Cc", 3.732, "D", 2.71828+5.3571i)
}
```

It may print out:

```go
20:20:01.697577+08:00 [INF] info msg                             Aa=1 Bbb=a string Cc=3.732 D=(2.71828+5.3571i) /Volumes/VolWork/go.work/libs.log/bench/logg_test.go:17 bench.TestLogOneTwoThree
```

Now we enable privacy flags, a builtin regexp rule (`/Volumes/.*/(.*)` -> `~$1`) will take effects (see the [Tilde Directory](#tilde-directory):

```bash
20:22:33.688847+08:00 [INF] info msg                             Aa=1 Bbb=a string Cc=3.732 D=(2.71828+5.3571i) ~work/go.work/libs.log/bench/logg_test.go:17 bench.TestLogOneTwoThree
```

The code looks like:

```go
func init() {
    slog.AddFlags(slog.Lprivacypathregexp | slog.Lprivacypath)
}
```

The builtin rules includes truncate homdir to `~`, disable absolute pathname, and using relative path, and so on.

You may make calls to `AddKnownPathMapping(path, repl)` and `AddKnownPathRegexpMapping(expr, repl)` to setup
them.

##### Tilde Directory

In zsh/bash, you can create tilde directory as a folder alias. For a instance,

```bash
hash -d work=/Volumes/VolWork
ls -la ~work/go.work/
```

The builtin rules of `logg/slog` can do this translate in call info in logging message.

See also `AddKnownPathRegexpMapping/RemoveKnownPathRegexpMapping` and `ResetKnownPathRegexpMapping`.

#### Shortening package name(s)

In outputs, package name in caller information has form `github.com/user/repo/offset.object.function`, By enabling `Lcallerpackagename`, `github.com` will be shortened to `GH`. The other well-known code-hosting providers are converted too:

- "github.com" -> "GH"
- "gitlab.com" -> "GL"
- "gitee.com" -> "GT"
- "bitbucker.com" -> "BB"

```go
func init() {
    slog.AddFlags(slog.Lcallerpackagename)
}
```

If `Lcallerpackagename` is not present (this is default behavior), the package name will be truncated simply.

`AddCodeHostingProviders(provide, repl)` API can add more rules for shortening.

#### More Rules

You can always append yours with `AddKnownPathMapping(pathname, repl string)` and `AddKnownPathRegexpMapping(pathnameRegexpExpr, repl string)`.

If `Lprivacypathregexp` and `Lprivacypath` is not present (this is default behavior), we try to truncate the pathname as possible as we can.

And, `AddCodeHostingProviders(provider, repl string)` do similar things and need `Lcallerpackagename` is enabled.

See also `AddKnownPathRegexpMapping`. `RemoveKnownPathRegexpMapping` and `ResetKnownPathRegexpMapping`, `AddKnownPathMapping`. `RemoveKnownPathMapping` and `ResetKnownPathMapping`,

### Other Helpers

Here are two savers so that you can write codes easiler:

```go
// Save global Level and set to new, and restore original
defer slog.SaveLevelAndSet(slog.WarnLevel)()


 defer SaveFlagsAndMod(LnoInterrupt | LattrsR)()
 defer SaveLevelAndSet(TraceLevel)()

// Save global Flags and modify it for local logic, and restore it after going back to up level
defer slog.SaveFlagsAnd(func() {
    slog.AddFlags(slog.LattrsR) // add, remove, or set flags
})()

```
