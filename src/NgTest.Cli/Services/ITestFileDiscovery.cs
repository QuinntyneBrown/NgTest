namespace NgTest.Cli.Services;

public interface ITestFileDiscovery
{
    IReadOnlyList<string> DiscoverTests(string workspaceRoot, string? targetPath);
}
