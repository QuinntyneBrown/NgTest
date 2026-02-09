# Contributing to NgTest

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download) or later
- Node.js (for running the Angular playground tests)

## Getting Started

1. Clone the repository
2. Build the solution:
   ```bash
   dotnet build NgTest.sln
   ```
3. Install the tool locally:
   ```bash
   eng\scripts\install-ng-test.bat
   ```

## Project Layout

| Path | Description |
|------|-------------|
| `src/NgTest.Cli/` | CLI tool source |
| `src/NgTest.Cli/Commands/` | Command definitions (file-per-command pattern) |
| `src/NgTest.Cli/Handlers/` | Command handlers |
| `src/NgTest.Cli/Services/` | Core services (workspace detection, test discovery, Jest runner) |
| `src/NgTest.Cli/Models/` | DTOs and options |
| `eng/scripts/` | Build and install scripts |
| `playground/` | Angular 17 workspace used for manual testing |

## Adding a New Command

1. Create a new class in `Commands/` that implements `ICommandRegistrar`
2. Create a corresponding handler in `Handlers/`
3. Register both in the DI container in `Program.cs`

## Testing Changes

Run `ng-test` against the playground workspace:

```bash
cd playground
ng-test
```

All tests should pass before submitting a pull request.

## Pull Requests

- Keep changes focused and minimal
- Ensure `dotnet build NgTest.sln` succeeds with no warnings
- Verify `ng-test` runs successfully against the playground
