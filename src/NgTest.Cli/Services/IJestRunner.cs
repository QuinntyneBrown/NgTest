using NgTest.Cli.Models;

namespace NgTest.Cli.Services;

public interface IJestRunner
{
    Task<TestRunResult> RunAsync(
        string workspaceRoot,
        JestRunnerOptions options,
        CancellationToken cancellationToken = default);
}
