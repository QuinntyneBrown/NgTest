using Microsoft.Extensions.FileSystemGlobbing;
using Microsoft.Extensions.FileSystemGlobbing.Abstractions;
using Microsoft.Extensions.Logging;

namespace NgTest.Cli.Services;

public class TestFileDiscoveryService : ITestFileDiscovery
{
    private readonly ILogger<TestFileDiscoveryService> _logger;

    public TestFileDiscoveryService(ILogger<TestFileDiscoveryService> logger)
    {
        _logger = logger;
    }

    public IReadOnlyList<string> DiscoverTests(string workspaceRoot, string? targetPath)
    {
        if (targetPath is not null && File.Exists(targetPath))
        {
            var fullPath = Path.GetFullPath(targetPath);
            _logger.LogDebug("Using specific test file: {Path}", fullPath);
            return [fullPath];
        }

        var searchRoot = targetPath is not null
            ? Path.GetFullPath(Path.Combine(workspaceRoot, targetPath))
            : workspaceRoot;

        if (!Directory.Exists(searchRoot))
        {
            searchRoot = workspaceRoot;
        }

        _logger.LogDebug("Discovering test files in {SearchRoot}", searchRoot);

        var matcher = new Matcher();
        matcher.AddInclude("**/*.spec.ts");
        matcher.AddExclude("**/node_modules/**");

        var result = matcher.Execute(new DirectoryInfoWrapper(new DirectoryInfo(searchRoot)));
        var files = result.Files
            .Select(f => Path.GetFullPath(Path.Combine(searchRoot, f.Path)))
            .ToList();

        _logger.LogInformation("Discovered {Count} test file(s)", files.Count);
        return files;
    }
}
