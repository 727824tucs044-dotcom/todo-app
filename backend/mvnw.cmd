@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM ----------------------------------------------------------------------------

@if "%DEBUG%" == "" @echo off
@classworlds.conf.path%

@setlocal

set ERROR_CODE=0

@REM Find the project base dir
set MAVEN_PROJECTBASEDIR=%~dp0
:findBaseDir
if exist "%MAVEN_PROJECTBASEDIR%\.mvn" goto baseDirFound
set MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR%..
goto findBaseDir
:baseDirFound

set MAVEN_CONFIG=%MAVEN_PROJECTBASEDIR%\.mvn

@REM Find JAVA_HOME
if not "%JAVA_HOME%" == "" goto OkJHome

echo.
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
echo.
goto error

:OkJHome

set WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
set WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

%JAVA_HOME%\bin\java.exe -jar %WRAPPER_JAR% %*
if ERRORLEVEL 1 goto error
goto end

:error
set ERROR_CODE=1

:end
@endlocal & set ERROR_CODE=%ERROR_CODE%
exit /B %ERROR_CODE%
