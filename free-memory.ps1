# Free Memory Script - Close unnecessary processes and free up RAM
# Run this to help reduce memory usage before restarting

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Memory Cleanup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check current memory usage
Write-Host "Current Memory Status:" -ForegroundColor Yellow
$memory = Get-CimInstance Win32_OperatingSystem
$totalMemory = [math]::Round($memory.TotalVisibleMemorySize / 1MB, 2)
$freeMemory = [math]::Round($memory.FreePhysicalMemory / 1MB, 2)
$usedMemory = [math]::Round($totalMemory - $freeMemory, 2)
$percentUsed = [math]::Round(($usedMemory / $totalMemory) * 100, 2)

Write-Host "Total RAM: $totalMemory GB" -ForegroundColor White
Write-Host "Used RAM: $usedMemory GB ($percentUsed%)" -ForegroundColor $(if ($percentUsed -gt 80) { "Red" } else { "Yellow" })
Write-Host "Free RAM: $freeMemory GB" -ForegroundColor Green
Write-Host ""

# Option 1: Close specific high-memory processes (user choice)
Write-Host "Option 1: Close specific processes" -ForegroundColor Yellow
Write-Host "Would you like to close Microsoft Edge processes? (y/n)" -ForegroundColor White
$closeEdge = Read-Host
if ($closeEdge -eq "y" -or $closeEdge -eq "Y") {
    $edgeProcesses = Get-Process -Name "msedge" -ErrorAction SilentlyContinue
    if ($edgeProcesses) {
        Write-Host "Closing $($edgeProcesses.Count) Edge processes..." -ForegroundColor Yellow
        $edgeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
        Write-Host "Edge processes closed." -ForegroundColor Green
    } else {
        Write-Host "No Edge processes found." -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Would you like to close Chrome processes? (y/n)" -ForegroundColor White
$closeChrome = Read-Host
if ($closeChrome -eq "y" -or $closeChrome -eq "Y") {
    $chromeProcesses = Get-Process -Name "chrome" -ErrorAction SilentlyContinue
    if ($chromeProcesses) {
        Write-Host "Closing $($chromeProcesses.Count) Chrome processes..." -ForegroundColor Yellow
        $chromeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
        Write-Host "Chrome processes closed." -ForegroundColor Green
    } else {
        Write-Host "No Chrome processes found." -ForegroundColor Gray
    }
}

# Option 2: Clear browser cache and temp files
Write-Host ""
Write-Host "Option 2: Clear temporary files" -ForegroundColor Yellow
Write-Host "Would you like to clear temp files? (y/n)" -ForegroundColor White
$clearTemp = Read-Host
if ($clearTemp -eq "y" -or $clearTemp -eq "Y") {
    Write-Host "Clearing temporary files..." -ForegroundColor Yellow
    
    # Clear Windows temp
    $tempPath = $env:TEMP
    $count = (Get-ChildItem -Path $tempPath -Recurse -ErrorAction SilentlyContinue | Measure-Object).Count
    Remove-Item -Path "$tempPath\*" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Cleared Windows temp files ($count items)" -ForegroundColor Green
    
    # Clear user temp
    $userTemp = "$env:USERPROFILE\AppData\Local\Temp"
    $count2 = (Get-ChildItem -Path $userTemp -Recurse -ErrorAction SilentlyContinue | Measure-Object).Count
    Remove-Item -Path "$userTemp\*" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Cleared user temp files ($count2 items)" -ForegroundColor Green
}

# Final memory status
Write-Host ""
Write-Host "Final Memory Status:" -ForegroundColor Yellow
Start-Sleep -Seconds 2
$memoryAfter = Get-CimInstance Win32_OperatingSystem
$freeMemoryAfter = [math]::Round($memoryAfter.FreePhysicalMemory / 1MB, 2)
$usedMemoryAfter = [math]::Round($totalMemory - $freeMemoryAfter, 2)
$percentUsedAfter = [math]::Round(($usedMemoryAfter / $totalMemory) * 100, 2)

Write-Host "Used RAM: $usedMemoryAfter GB ($percentUsedAfter%)" -ForegroundColor $(if ($percentUsedAfter -gt 80) { "Red" } elseif ($percentUsedAfter -gt 60) { "Yellow" } else { "Green" })
Write-Host "Free RAM: $freeMemoryAfter GB" -ForegroundColor Green
Write-Host "Memory freed: $([math]::Round($freeMemoryAfter - $freeMemory, 2)) GB" -ForegroundColor Cyan

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Cleanup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Save all your work in Cursor" -ForegroundColor White
Write-Host "2. Close Cursor if needed" -ForegroundColor White
Write-Host "3. Restart your computer for best results" -ForegroundColor White
Write-Host ""
