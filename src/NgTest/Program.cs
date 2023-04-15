var currentDirectory = Environment.CurrentDirectory;

string searchPattern = "*.spec.ts";

var appDirectory = Path.GetDirectoryName(GetFilePath("angular.json", currentDirectory));

var projectDirectory = Path.GetDirectoryName(GetFilePath("tsconfig.*", currentDirectory));

string root = null!;

var rootParts = new List<string>();

var afterProjects = false;

foreach (var part in projectDirectory.Split(Path.DirectorySeparatorChar).Skip(2))
{
    if (afterProjects)
    {
        rootParts.Add(part);
    }

    if (part == "projects")
    {
        afterProjects = true;
    }
}

root = rootParts.Count > 1 ? $"@{string.Join("/", rootParts)}" : rootParts.First();

foreach (var path in new DirectoryInfo(currentDirectory).GetFiles(searchPattern)
    .OrderByDescending(fileInfo => fileInfo.LastWriteTime)
    .Select(fileInfo => fileInfo.FullName))
{
    var testName = "";

    foreach(var line in File.ReadAllLines(path))
    {
        if(line.Trim().StartsWith("describe"))
        {
            var indexOfFirstQuote = line.IndexOf("'") + 1;

            var indexOfSecondQuote = line.Substring(indexOfFirstQuote).IndexOf("'");

            var lengthOfTestName = indexOfSecondQuote;

            testName = line.Substring(indexOfFirstQuote, lengthOfTestName);

            break;
        }
    }

    await CommandAsync($"ng test --test-name-pattern='{testName}' --watch --project {root}", appDirectory);
}

async Task CommandAsync(string arguments, string workingDirectory)
{
    System.Diagnostics.Process process = new()
    {
        StartInfo = new()
        {
            WindowStyle = System.Diagnostics.ProcessWindowStyle.Normal,
            FileName = "cmd.exe",
            Arguments = $"/C {arguments}",
            WorkingDirectory = workingDirectory
        }
    };

    process.Start();

    await process.WaitForExitAsync();
}

string GetFilePath(string searchPattern, string directory, int depth = 0)
{
    var parts = directory.Split(Path.DirectorySeparatorChar);

    var file = Directory.GetFiles(string.Join(Path.DirectorySeparatorChar, parts.Take(parts.Length - depth)), searchPattern).FirstOrDefault();

    return file ?? GetFilePath(searchPattern, directory, depth + 1);
}