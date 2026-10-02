<img src="https://raw.githubusercontent.com/chrstphrknwtn/swift-format-nova/master/extension@2x.png" width="64" height="64" alt="" />

# Swift Format for Nova

A [Nova](https://nova.app) extension for formatting Swift files using your toolchain's built-in
[swift-format](https://github.com/swiftlang/swift-format).

## Requirements

[Swift 6](https://www.swift.org/install/) or later.

## Configuration

Formatting follows the nearest `.swift-format` file, searching upwards from
each source file. See [swift-format](https://github.com/swiftlang/swift-format)
[configuration](https://github.com/swiftlang/swift-format/blob/main/Documentation/Configuration.md).

## Settings

**Format on Save**  
Format Swift files automatically when saved (on by default).

**Swift Executable**  
Path to `swift` (default `/usr/bin/swift`).  
If you use [Swiftly](https://github.com/swiftlang/swiftly), you might prefer
`~/.swiftly/bin/swift`.
