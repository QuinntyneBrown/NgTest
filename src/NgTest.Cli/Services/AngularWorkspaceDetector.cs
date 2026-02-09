using Microsoft.Extensions.Logging;
using NgTest.Cli.Models;

namespace NgTest.Cli.Services;

public class AngularWorkspaceDetector : IAngularWorkspaceDetector
{
    private readonly ILogger<AngularWorkspaceDetector> _logger;

    public AngularWorkspaceDetector(ILogger<AngularWorkspaceDetector> logger)
    {
        _logger = logger;
    }

    public AngularWorkspaceInfo? Detect(string startPath)
    {
        var directory = Path.IsPathRooted(startPath)
            ? startPath
            : Path.GetFullPath(startPath);

        if (File.Exists(directory))
        {
            directory = Path.GetDirectoryName(directory)!;
        }

        while (directory is not null)
        {
            var angularJsonPath = Path.Combine(directory, "angular.json");
            if (File.Exists(angularJsonPath))
            {
                _logger.LogDebug("Found angular.json at {Path}", angularJsonPath);
                return new AngularWorkspaceInfo
                {
                    WorkspaceRoot = directory,
                    AngularJsonPath = angularJsonPath
                };
            }

            directory = Path.GetDirectoryName(directory);
        }

        _logger.LogWarning("No angular.json found starting from {StartPath}", startPath);
        return null;
    }
}
