@ECHO off
SETLOCAL
CALL :find_dp0

IF EXIST "%dp0%\python.exe" (
  SET "_prog=%dp0%\python.exe"
) ELSE (
  SET "_prog=python"
  SET PATHEXT=%PATHEXT:;.JS;=;%
)

"%_prog%"  "%dp0%\modules\not_node\main.js" %*
ENDLOCAL
EXIT /b %errorlevel%
:find_dp0
SET dp0=%~dp0
EXIT /b
