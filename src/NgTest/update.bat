dotnet tool uninstall -g NgTest
dotnet pack
dotnet tool install --global --add-source ./nupkg NgTest