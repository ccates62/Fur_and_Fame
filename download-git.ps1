# Download and Install Git for Windows
# Run this script in PowerShell

Write-Host "🔽 Downloading Git for Windows..." -ForegroundColor Cyan

# Download Git installer
$url = "https://github.com/git-for-windows/git/releases/download/v2.52.0.windows.1/Git-2.52.0-64-bit.exe"
$output = "$env:USERPROFILE\Downloads\Git-2.52.0-64-bit.exe"

Write-Host "Downloading from: $url" -ForegroundColor Gray
Write-Host "Saving to: $output" -ForegroundColor Gray
Write-Host ""

try {
    Invoke-WebRequest -Uri $url -OutFile $output -UseBasicParsing
    Write-Host "✅ Download complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 File saved to: $output" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🚀 Opening installer..." -ForegroundColor Yellow
    Start-Process $output
    Write-Host ""
    Write-Host "📝 Follow the installer prompts:" -ForegroundColor Yellow
    Write-Host "   1. Click 'Next' through the setup" -ForegroundColor White
    Write-Host "   2. Keep default options" -ForegroundColor White
    Write-Host "   3. Click 'Install'" -ForegroundColor White
    Write-Host "   4. After installation, RESTART PowerShell" -ForegroundColor White
    Write-Host ""
    Write-Host "✅ Then run: git --version" -ForegroundColor Green
} catch {
    Write-Host "❌ Download failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Alternative: Try using winget:" -ForegroundColor Yellow
    Write-Host "   winget install --id Git.Git -e --source winget" -ForegroundColor White
}
