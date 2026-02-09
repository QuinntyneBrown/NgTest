using Microsoft.Extensions.Logging;
using NgTest.Cli.Models;
using NgTest.Cli.Services;

namespace NgTest.Cli.Handlers;

public class RunTestsHandler
{
    private readonly IAngularWorkspaceDetector _workspaceDetector;
    private readonly ITestFileDiscovery _testFileDiscovery;
    private readonly IJestRunner _jestRunner;
    private readonly ILogger<RunTestsHandler> _logger;

    public RunTestsHandler(
        IAngularWorkspaceDetector workspaceDetector,
        ITestFileDiscovery testFileDiscovery,
        IJestRunner jestRunner,
        ILogger<RunTestsHandler> logger)
    {
        _workspaceDetector = workspaceDetector;
        _testFileDiscovery = testFileDiscovery;
        _jestRunner = jestRunner;
        _logger = logger;
    }

    public async Task<int> ExecuteAsync(
        string? path,
        bool watch,
        bool coverage,
        bool verbose,
        CancellationToken cancellationToken)
    {
        var startPath = path ?? Directory.GetCurrentDirectory();

        var workspace = _workspaceDetector.Detect(startPath);
        if (workspace is null)
        {
            _logger.LogError("Could not find an Angular workspace. Ensure angular.json exists in the project hierarchy.");
            return 1;
        }

        _logger.LogInformation("Angular workspace found at {WorkspaceRoot}", workspace.WorkspaceRoot);

        var testFiles = _testFileDiscovery.DiscoverTests(workspace.WorkspaceRoot, path);
        if (testFiles.Count == 0)
        {
            _logger.LogWarning("No test files found.");
            return 0;
        }

        var options = new JestRunnerOptions
        {
            TestFiles = testFiles,
            Watch = watch,
            Coverage = coverage,
            Verbose = verbose
        };

        var result = await _jestRunner.RunAsync(workspace.WorkspaceRoot, options, cancellationToken);
        return result.ExitCode;
    }
}
