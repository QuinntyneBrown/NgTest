@echo off
setlocal

set REPO_ROOT=%~dp0..\..
set ARTIFACTS=%REPO_ROOT%\artifacts

echo Packing NgTest.Cli...
dotnet pack "%REPO_ROOT%\src\NgTest.Cli" -o "%ARTIFACTS%" || (
    echo ERROR: Pack failed.
    exit /b 1
)

echo Uninstalling previous version (if any)...
dotnet tool uninstall --global NgTest.Cli 2>nul

echo Installing ng-test globally...
dotnet tool install --global --add-source "%ARTIFACTS%" NgTest.Cli || (
    echo ERROR: Install failed.
    exit /b 1
)

echo.
echo ng-test installed successfully. Run "ng-test --help" to verify.
