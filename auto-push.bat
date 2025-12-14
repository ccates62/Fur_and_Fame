@echo off
echo.
echo ========================================
echo   Auto-Push to GitHub
echo ========================================
echo.

cd /d "c:\Users\ccate\Fur_and_Fame"

echo [1/3] Adding all changes...
git add -A
if %errorlevel% neq 0 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)

echo [2/3] Committing changes...
git commit -m "Auto-push: %date% %time%"
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
