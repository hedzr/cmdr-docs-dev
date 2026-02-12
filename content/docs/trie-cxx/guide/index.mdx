---
title: "Guide"
description: "Trie-tree in cxx-17/20"
---


## Guide

## For Developers

`trie-cxx` needs a c++-20 compliant compiler such as gcc-13.

From v0.3.1, `trie-cxx` was compiled passed under macOS (clang), Linux (gcc-13) and Windows (msvc).

### CMake Standard

trie-cxx is findable via CMake Modules.

You could install trie-cxx manually:

```bash
git clone https://github.com/hedzr/trie-cxx.git
cd trie-cxx
cmake -DCMAKE_VERBOSE_DEBUG=ON -DCMAKE_AUTOMATE_TESTS=OFF -S . -B build/ -G Ninja
# Or:
#    cmake -S . -B build/
cmake --build build/
cmake --install build/
# Or:
#   cmake --build build/ --target install
#
# Sometimes sudo it:
#   sudo cmake --build build/ --target install
# Or:
#   cmake --install build/ --prefix ./dist/install --strip
#   sudo cp -R ./dist/install/include/* /usr/local/include/
#   sudo cp -R ./dist/install/lib/cmake/* /usr/local/lib/cmake/
rm -rf ./build
cd ..
```

### More cmake commands

```bash
# clean (all targets files, but the immedieted files)
cmake --build build/ --target clean
# clean and build (just relinking all targets without recompiling)
cmake --build build/ --clean-first

# clean deeply
rm -rf build/

# clean deeply since cmake 3.24.0
# (your custom settings from command-line will lost.
#   For example, if you ever run `cmake -DCMAKE_VERBOSE_DEBUG=ON -S . -B build',
#   and now cmake --fresh -B build/ will ignore `CMAKE_VERBOSE_DEBUG = ON' 
#   and reconfigure to default state.
# )
cmake --fresh -B build/

# recompiling and relinking (simply passing `-B' to `make')
cmake --build build/ -- -B

# reconfigure
rm ./build/CMakeCache.txt && cmake -DENABLE_AUTOMATE_TESTS=OFF -S . -B build/

# print compiling command before exeuting them
cmake --build build/ -- VERBOSE=1
# Or:
VERBOSE=1 cmake --build build/
# Or:
cmake --build build --verbose

# Run CTest
cmake -E chdir build ctest
# Run a special ctest
cmake -E chdir build ctest -R name_of_your_test
```

detect running in CTest by env var `CTEST_INTERACTIVE_DEBUG_MODE`:

```c++
#include <stdlib.h>
char const *ev1 = getenv("CTEST_INTERACTIVE_DEBUG_MODE");
if (ev1 && (*ev1 == '0' || *ev1 == '1'))
    return 0;
```

### Preparing Catch2 v3.x

for testing, catch2 v3.7+ is necessary.

openSUSE,

```bash
sudo zypper install catch2-devel # don't install catch2-2-devel
```

Ubuntu 22.04/24.04,

```bash
git clone -b v3.7.1 https://github.com/catchorg/Catch2.git
cd Catch2
mkdir build
cmake -S . -B build
cmake --build build
cmake --install build --prefix ./dist/install --strip
sudo cp -R ./dist/install/include/* /usr/local/include/
sudo cp -R ./dist/install/lib/cmake/* /usr/local/lib/cmake/
```

macOS,

```bash
brew install catch2
```

Windows (x86_64)

```powershell
vcpkg install catch2:x64-windows
```

If catch2 not installed via package manager, cmake will try downloading it from github and use it as a child target.
