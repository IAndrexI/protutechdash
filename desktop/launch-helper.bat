@echo off
:: Protutech App Launcher Dispatcher
:: Parses protutech://app-id or protutech://launch?id=...
setlocal enabledelayedexpansion

set "RAW_ARG=%~1"
set "APP_ID=%RAW_ARG:protutech://=%"
set "APP_ID=%APP_ID:/=%"

echo Launching Protutech App: %APP_ID%

if "%APP_ID%"=="discord" (
    if exist "C:\Users\%USERNAME%\Downloads\Protutech-Discord-Setup.exe" (
        start "" "C:\Users\%USERNAME%\Downloads\Protutech-Discord-Setup.exe"
        exit /b
    )
    start "" "https://discopanel.protutech.vip"
    exit /b
)

if "%APP_ID%"=="homebox" (
    start "" "https://homebox.protutech.vip"
    exit /b
)

if "%APP_ID%"=="proxmox" (
    start "" "https://proxmox.protutech.vip"
    exit /b
)

if "%APP_ID%"=="pelican" (
    start "" "https://pelican.protutech.vip"
    exit /b
)

if "%APP_ID%"=="seafile" (
    if exist "C:\Program Files\Seafile\bin\seafile-applet.exe" (
        start "" "C:\Program Files\Seafile\bin\seafile-applet.exe"
        exit /b
    )
    start "" "https://seafile.protutech.vip"
    exit /b
)

if "%APP_ID%"=="vaultwarden" (
    start "" "https://vw.protutech.vip"
    exit /b
)

:: Fallback launcher for web portal
start "" "https://%APP_ID%.protutech.vip"
