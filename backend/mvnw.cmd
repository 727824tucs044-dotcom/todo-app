@echo off
@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script for Windows
@REM ----------------------------------------------------------------------------

setlocal

set ERROR_CODE=0

@REM Find java executable
set JAVA_EXE=java
if not "%JAVA_HOME%" == "" (
    set "JAVA_EXE=%JAVA_HOME%\bin\java.exe"
)

@REM Find the project base dir
set "MAVEN_PROJECTBASEDIR=%~dp0"

if exist "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar" (
    "%JAVA_EXE%" -jar "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar" %*
) else (
    "%JAVA_EXE%" -cp "%MAVEN_PROJECTBASEDIR%\target\classes" com.todoapp.TodoApplication
)

if ERRORLEVEL 1 set ERROR_CODE=1

:end
@endlocal & set ERROR_CODE=%ERROR_CODE%
exit /B %ERROR_CODE%
