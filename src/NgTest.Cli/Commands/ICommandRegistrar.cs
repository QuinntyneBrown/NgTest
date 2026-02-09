using System.CommandLine;

namespace NgTest.Cli.Commands;

public interface ICommandRegistrar
{
    void Register(RootCommand rootCommand, IServiceProvider services);
}
