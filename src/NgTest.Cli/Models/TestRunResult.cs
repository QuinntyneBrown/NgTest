namespace NgTest.Cli.Models;

public class TestRunResult
{
    public int ExitCode { get; init; }
    public bool Success => ExitCode == 0;
    public IReadOnlyList<string> TestFilesExecuted { get; init; } = [];
}
