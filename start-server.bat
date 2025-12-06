@echo off
echo Starting Next.js Development Server...
echo.
cd /d "%~dp0"

REM Check if Next.js is installed (check for the executable)
if not exist "node_modules\.bin\next.cmd" (
    echo Next.js not found. Installing dependencies...
    echo This may take a few minutes...
    echo.
    echo Note: You may see deprecation warnings - these are safe to ignore.
    echo.
    call npm install --legacy-peer-deps
    if errorlevel 1 (
        echo.
        echo ERROR: npm install failed!
        echo Please check your internet connection and try again.
        pause
        exit /b 1
    )
    echo.
    echo Dependencies installed successfully!
    echo Deprecation warnings are normal and won't affect functionality.
    echo.
)

REM Start the dev server
echo Starting server on http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
REM Use npx to ensure we use the local Next.js installation
call npx next dev

pause

