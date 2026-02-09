using System.CommandLine;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NgTest.Cli.Commands;
using NgTest.Cli.Handlers;
using NgTest.Cli.Services;

var configuration = new ConfigurationBuilder()
    .AddEnvironmentVariables("NGTEST_")
    .Build();

var services = new ServiceCollection();

services.AddSingleton<IConfiguration>(configuration);

services.AddLogging(builder =>
{
    builder.AddConsole();
    builder.SetMinimumLevel(
        args.Contains("--verbose") ? LogLevel.Debug : LogLevel.Information);
});

services.AddSingleton<IAngularWorkspaceDetector, AngularWorkspaceDetector>();
services.AddSingleton<ITestFileDiscovery, TestFileDiscoveryService>();
services.AddSingleton<IJestRunner, JestRunnerService>();
services.AddSingleton<IProcessRunner, ProcessRunner>();
services.AddTransient<RunTestsHandler>();

services.AddSingleton<ICommandRegistrar, RunTestsCommand>();

var serviceProvider = services.BuildServiceProvider();

var rootCommand = new RootCommand("ng-test — Discover and run Angular Jest tests");

foreach (var registrar in serviceProvider.GetServices<ICommandRegistrar>())
{
    registrar.Register(rootCommand, serviceProvider);
}

var parseResult = rootCommand.Parse(args);
return await parseResult.InvokeAsync();
