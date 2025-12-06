# Windows Performance Optimization Script
# Run this as Administrator for best results

Write-Host "⚡ Windows Performance Optimization" -ForegroundColor Cyan
Write-Host ""

# Check if running as admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  Some optimizations require Administrator privileges" -ForegroundColor Yellow
    Write-Host "   Right-click PowerShell and 'Run as Administrator' for full optimization" -ForegroundColor Yellow
    Write-Host ""
}

# 1. Clear Windows Temp files
Write-Host "Cleaning Windows temporary files..." -ForegroundColor Yellow
$tempPaths = @(
    "$env:TEMP\*",
    "$env:LOCALAPPDATA\Temp\*",
    "$env:WINDIR\Temp\*"
)

foreach ($path in $tempPaths) {
    if (Test-Path $path) {
        Get-ChildItem -Path $path -Recurse -ErrorAction SilentlyContinue | 
            Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } | 
            Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
    }
}
Write-Host "✅ Temporary files cleaned" -ForegroundColor Green

# 2. Clear browser cache (Chrome/Edge)
Write-Host ""
Write-Host "Cleaning browser cache..." -ForegroundColor Yellow
$browserPaths = @(
    "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Cache",
    "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Cache"
)

foreach ($path in $browserPaths) {
    if (Test-Path $path) {
        Get-ChildItem -Path $path -Recurse -ErrorAction SilentlyContinue | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
        Write-Host "✅ Browser cache cleaned: $(Split-Path $path -Leaf)" -ForegroundColor Green
    }
}

# 3. Clear Windows Update cache (requires admin)
if ($isAdmin) {
    Write-Host ""
    Write-Host "Cleaning Windows Update cache..." -ForegroundColor Yellow
    Stop-Service -Name wuauserv -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$env:WINDIR\SoftwareDistribution\Download\*" -Recurse -Force -ErrorAction SilentlyContinue
    Start-Service -Name wuauserv -ErrorAction SilentlyContinue
    Write-Host "✅ Windows Update cache cleaned" -ForegroundColor Green
}

# 4. Optimize disk (requires admin)
if ($isAdmin) {
    Write-Host ""
    Write-Host "Optimizing disk (this may take a few minutes)..." -ForegroundColor Yellow
    Optimize-Volume -DriveLetter C -Defrag -ReTrim -ErrorAction SilentlyContinue
    Write-Host "✅ Disk optimized" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Optimization complete!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Additional tips:" -ForegroundColor Cyan
Write-Host "  - Restart your computer weekly" -ForegroundColor White
Write-Host "  - Close unused applications" -ForegroundColor White
Write-Host "  - Disable startup programs you don't need" -ForegroundColor White
Write-Host "  - Keep Windows updated" -ForegroundColor White
