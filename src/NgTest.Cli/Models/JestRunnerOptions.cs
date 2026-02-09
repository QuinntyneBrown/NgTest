namespace NgTest.Cli.Models;

public class JestRunnerOptions
{
    public IReadOnlyList<string> TestFiles { get; init; } = [];
    public bool Watch { get; init; }
    public bool Coverage { get; init; }
    public bool Verbose { get; init; }
}
