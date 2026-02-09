using System.CommandLine;
using System.CommandLine.Parsing;
using Microsoft.Extensions.DependencyInjection;
using NgTest.Cli.Handlers;

namespace NgTest.Cli.Commands;

public class RunTestsCommand : ICommandRegistrar
{
    public void Register(RootCommand rootCommand, IServiceProvider services)
    {
        var pathArgument = new Argument<string?>("path")
        {
            Description = "Path to a test file, folder, or Angular project (defaults to current directory)",
            Arity = ArgumentArity.ZeroOrOne
        };

        var watchOption = new Option<bool>("--watch", "-w")
        {
            Description = "Run tests in watch mode"
        };

        var coverageOption = new Option<bool>("--coverage", "-c")
        {
            Description = "Collect code coverage"
        };

        var verboseOption = new Option<bool>("--verbose")
        {
            Description = "Enable verbose output"
        };

        rootCommand.Add(pathArgument);
        rootCommand.Add(watchOption);
        rootCommand.Add(coverageOption);
        rootCommand.Add(verboseOption);

        rootCommand.SetAction(async (parseResult, cancellationToken) =>
        {
            var handler = services.GetRequiredService<RunTestsHandler>();
            var path = parseResult.GetValue(pathArgument);
            var watch = parseResult.GetValue(watchOption);
            var coverage = parseResult.GetValue(coverageOption);
            var verbose = parseResult.GetValue(verboseOption);

            return await handler.ExecuteAsync(path, watch, coverage, verbose, cancellationToken);
        });
    }
}
