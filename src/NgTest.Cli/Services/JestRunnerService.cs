using System.Text;
using Microsoft.Extensions.Logging;
using NgTest.Cli.Models;

namespace NgTest.Cli.Services;

public class JestRunnerService : IJestRunner
{
    private readonly IProcessRunner _processRunner;
    private readonly ILogger<JestRunnerService> _logger;

    public JestRunnerService(IProcessRunner processRunner, ILogger<JestRunnerService> logger)
    {
        _processRunner = processRunner;
        _logger = logger;
    }

    public async Task<TestRunResult> RunAsync(
        string workspaceRoot,
        JestRunnerOptions options,
        CancellationToken cancellationToken = default)
    {
        var (fileName, baseArgs) = ResolveJestBinary(workspaceRoot);
        var arguments = BuildArguments(baseArgs, workspaceRoot, options);

        _logger.LogInformation("Running Jest: {FileName} {Arguments}", fileName, arguments);

        var exitCode = await _processRunner.RunAsync(fileName, arguments, workspaceRoot, cancellationToken);

        return new TestRunResult
        {
            ExitCode = exitCode,
            TestFilesExecuted = options.TestFiles
        };
    }

    private static (string FileName, string BaseArgs) ResolveJestBinary(string workspaceRoot)
    {
        var isWindows = OperatingSystem.IsWindows();
        var jestBin = Path.Combine(workspaceRoot, "node_modules", ".bin", isWindows ? "jest.cmd" : "jest");

        if (File.Exists(jestBin))
        {
            return (jestBin, "");
        }

        return isWindows
            ? ("cmd.exe", "/c npx jest")
            : ("npx", "jest");
    }

    private static string BuildArguments(string baseArgs, string workspaceRoot, JestRunnerOptions options)
    {
        var args = new StringBuilder(baseArgs);

        if (options.TestFiles.Count > 0)
        {
            var patterns = options.TestFiles
                .Select(f => Path.GetRelativePath(workspaceRoot, f).Replace('\\', '/'));
            var pattern = string.Join("|", patterns);
            Append(args, $"--testPathPattern \"{pattern}\"");
        }

        if (options.Watch)
        {
            Append(args, "--watch");
        }

        if (options.Coverage)
        {
            Append(args, "--coverage");
        }

        if (options.Verbose)
        {
            Append(args, "--verbose");
        }

        return args.ToString().Trim();
    }

    private static void Append(StringBuilder sb, string value)
    {
        if (sb.Length > 0)
        {
            sb.Append(' ');
        }
        sb.Append(value);
    }
}
