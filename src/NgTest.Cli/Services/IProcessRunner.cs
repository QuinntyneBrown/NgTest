namespace NgTest.Cli.Services;

public interface IProcessRunner
{
    Task<int> RunAsync(
        string fileName,
        string arguments,
        string workingDirectory,
        CancellationToken cancellationToken = default);
}
