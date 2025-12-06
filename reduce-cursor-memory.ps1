# Reduce Cursor Memory Usage Script
# This helps identify and reduce Cursor's memory consumption

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Cursor Memory Optimization" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Cursor processes
Write-Host "Checking Cursor processes..." -ForegroundColor Yellow
$cursorProcesses = Get-Process -Name "Cursor" -ErrorAction SilentlyContinue

if ($cursorProcesses) {
    $totalMemory = ($cursorProcesses | Measure-Object -Property WorkingSet64 -Sum).Sum / 1MB
    Write-Host "Cursor is using: $([math]::Round($totalMemory, 2)) MB" -ForegroundColor $(if ($totalMemory -gt 500) { "Red" } elseif ($totalMemory -gt 300) { "Yellow" } else { "Green" })
    Write-Host "Number of Cursor processes: $($cursorProcesses.Count)" -ForegroundColor White
    Write-Host ""
    
    Write-Host "Individual processes:" -ForegroundColor Cyan
    $cursorProcesses | ForEach-Object {
        $memMB = [math]::Round($_.WorkingSet64 / 1MB, 2)
        Write-Host "  - $($_.ProcessName) (PID: $($_.Id)): $memMB MB" -ForegroundColor White
    }
} else {
    Write-Host "Cursor is not currently running." -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Memory Reduction Tips" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Close Unused Files:" -ForegroundColor Yellow
Write-Host "   - Close tabs you're not using (each open file uses memory)" -ForegroundColor White
Write-Host "   - Use Ctrl+K W to close all tabs" -ForegroundColor White
Write-Host ""

Write-Host "2. Disable Unnecessary Extensions:" -ForegroundColor Yellow
Write-Host "   - Go to Extensions (Ctrl+Shift+X)" -ForegroundColor White
Write-Host "   - Disable extensions you don't actively use" -ForegroundColor White
Write-Host "   - AI extensions can be memory-heavy" -ForegroundColor White
Write-Host ""

Write-Host "3. Reduce AI Features (if not needed):" -ForegroundColor Yellow
Write-Host "   - Settings → Features → Disable unused AI features" -ForegroundColor White
Write-Host "   - Close AI chat panels when not in use" -ForegroundColor White
Write-Host ""

Write-Host "4. Clear Cursor Cache:" -ForegroundColor Yellow
Write-Host "   - Close Cursor completely" -ForegroundColor White
Write-Host "   - Delete cache folder (will be shown below)" -ForegroundColor White
Write-Host ""

Write-Host "5. Restart Cursor Regularly:" -ForegroundColor Yellow
Write-Host "   - Memory leaks can build up over time" -ForegroundColor White
Write-Host "   - Restart Cursor daily or when memory gets high" -ForegroundColor White
Write-Host ""

# Show cache location
$cursorCachePath = "$env:APPDATA\Cursor"
Write-Host "Cursor cache location:" -ForegroundColor Cyan
Write-Host "  $cursorCachePath" -ForegroundColor White
Write-Host ""

Write-Host "Would you like to clear Cursor cache? (y/n)" -ForegroundColor Yellow
$clearCache = Read-Host

if ($clearCache -eq "y" -or $clearCache -eq "Y") {
    Write-Host ""
    Write-Host "⚠️  WARNING: This will close Cursor and clear cache!" -ForegroundColor Red
    Write-Host "Make sure you've saved all your work first!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Continue? (y/n)" -ForegroundColor Yellow
    $confirm = Read-Host
    
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        Write-Host ""
        Write-Host "Closing Cursor processes..." -ForegroundColor Yellow
        $cursorProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
        
        Write-Host "Clearing cache folders..." -ForegroundColor Yellow
        $cacheFolders = @(
            "$cursorCachePath\Cache",
            "$cursorCachePath\Code Cache",
            "$cursorCachePath\GPUCache",
            "$cursorCachePath\ShaderCache"
        )
        
        foreach ($folder in $cacheFolders) {
            if (Test-Path $folder) {
                try {
                    Remove-Item -Path $folder -Recurse -Force -ErrorAction SilentlyContinue
                    Write-Host "  ✅ Cleared: $(Split-Path $folder -Leaf)" -ForegroundColor Green
                } catch {
                    Write-Host "  ⚠️  Could not clear: $(Split-Path $folder -Leaf)" -ForegroundColor Yellow
                }
            }
        }
        
        Write-Host ""
        Write-Host "✅ Cache cleared! You can now restart Cursor." -ForegroundColor Green
    } else {
        Write-Host "Cache clearing cancelled." -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Quick Actions" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To reduce memory RIGHT NOW:" -ForegroundColor Yellow
Write-Host "1. Close unused file tabs in Cursor" -ForegroundColor White
Write-Host "2. Close AI chat panels" -ForegroundColor White
Write-Host "3. Disable unused extensions" -ForegroundColor White
Write-Host "4. Restart Cursor (File → Exit, then reopen)" -ForegroundColor White
Write-Host ""

