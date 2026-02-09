using NgTest.Cli.Models;

namespace NgTest.Cli.Services;

public interface IAngularWorkspaceDetector
{
    AngularWorkspaceInfo? Detect(string startPath);
}
