# NgTest

A .NET CLI tool (`ng-test`) that discovers and runs Angular Jest tests.

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download) or later
- Node.js with an Angular workspace configured to use Jest

## Install

```bash
dotnet tool install --global QuinntyneBrown.NgTest.Cli
```

Or from source:

```bash
eng\scripts\install-ng-test.bat
```

## Usage

```
ng-test                              # run all tests in current directory
ng-test ./src/app/my-component       # run tests in a specific folder
ng-test ./src/app/my.spec.ts         # run a specific test file
ng-test --watch                      # watch mode
ng-test --coverage                   # collect code coverage
ng-test --verbose                    # verbose output
```

## Project Structure

```
NgTest.sln
Directory.Build.props          # Shared build props (net8.0, RollForward)
src/
  NgTest.Cli/                  # CLI tool (dotnet tool, PackAsTool)
    Program.cs                 # Entry point: config -> DI -> commands -> invoke
    Commands/                  # File-per-command pattern (ICommandRegistrar)
    Handlers/                  # Command handlers (orchestration logic)
    Services/                  # Workspace detection, test discovery, Jest runner
    Models/                    # DTOs
eng/
  scripts/
    install-ng-test.bat        # Pack + global install script
playground/                    # Angular 17 workspace for testing
```

## How It Works

1. **Workspace detection** - walks up the directory tree to find `angular.json`
2. **Test discovery** - globs for `**/*.spec.ts` files (excluding `node_modules`)
3. **Jest execution** - resolves the local Jest binary and runs tests with `--testPathPattern`

## Development

```bash
dotnet build src/NgTest.Cli
dotnet run --project src/NgTest.Cli -- --help
```
