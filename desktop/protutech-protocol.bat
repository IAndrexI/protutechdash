@echo off
:: Protutech Suite Protocol Handler Setup for Windows
:: Registers 'protutech://' custom URI scheme to launch local apps
title Register Protutech Protocol Handler
echo ========================================================
echo   PROTUTECH SUITE - PROTOCOL HANDLER REGISTRATION
echo ========================================================
echo.

:: Check Admin Rights
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [!] Requesting administrative privileges...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo [+] Registering 'protutech://' URI scheme in Windows Registry...

reg add "HKCR\protutech" /ve /t REG_SZ /d "URL:Protutech Suite Protocol" /f
reg add "HKCR\protutech" /v "URL Protocol" /t REG_SZ /d "" /f
reg add "HKCR\protutech\DefaultIcon" /ve /t REG_SZ /d "%~dp0..\assets\protutech-logo.svg" /f
reg add "HKCR\protutech\shell\open\command" /ve /t REG_SZ /d "\"%~dp0launch-helper.bat\" \"%%1\"" /f

echo.
echo [OK] Successfully registered 'protutech://' protocol!
echo You can now launch your local Protutech apps directly from your web browser or dashboard.
echo.
pause
