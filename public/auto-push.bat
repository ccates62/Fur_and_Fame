@echo off
REM Auto-Push to GitHub Script (Windows Batch)
REM Double-click this file to push code to GitHub

cd /d "c:\Users\ccate\Fur_and_Fame"

echo.
echo ========================================
echo   Auto-Push to GitHub
echo ========================================
echo.

echo [1/3] Adding all changes...
git add -A
if %errorlevel% neq 0 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)

echo [2/3] Committing changes...
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c-%%a-%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a:%%b)
git commit -m "Auto-push: %mydate% %mytime%"
if %errorlevel% neq 0 (
    echo WARNING: No changes to commit (or commit failed)
)

echo [3/3] Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ERROR: Failed to push to GitHub
    echo.
    echo Possible issues:
    echo - Not authenticated with GitHub
    echo - Network connection issue
    echo - Repository doesn't exist
    echo.
    echo Try running: git push origin main
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS! Code pushed to GitHub
echo ========================================
echo.
echo Your code is now on GitHub and Vercel will auto-deploy!
echo.
pause
