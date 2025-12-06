# PowerShell script to create desktop shortcuts for account dashboards
# Run this script to create desktop icons for quick access

$desktopPath = [Environment]::GetFolderPath("Desktop")
$projectPath = $PSScriptRoot

# Create shortcut function
function Create-Shortcut {
    param(
        [string]$Name,
        [string]$TargetPath,
        [string]$Arguments = "",
        [string]$IconPath = ""
    )
    
    $WshShell = New-Object -ComObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut("$desktopPath\$Name.lnk")
    $Shortcut.TargetPath = $TargetPath
    if ($Arguments) {
        $Shortcut.Arguments = $Arguments
    }
    if ($IconPath) {
        $Shortcut.IconLocation = $IconPath
    }
    $Shortcut.Save()
    Write-Host "Created shortcut: $Name" -ForegroundColor Green
}

# Create shortcut for HTML dashboard
$htmlPath = Join-Path $projectPath "open-accounts.html"
if (Test-Path $htmlPath) {
    New-Shortcut -Name "Fur & Fame Accounts" -TargetPath $htmlPath
}

# Create shortcuts for each service (URL shortcuts)
$services = @(
    @{Name="GitHub"; Url="https://github.com"},
    @{Name="Supabase Dashboard"; Url="https://supabase.com/dashboard"},
    @{Name="Stripe Dashboard"; Url="https://dashboard.stripe.com"},
    @{Name="Vercel Dashboard"; Url="https://vercel.com/dashboard"},
    @{Name="fal.ai Dashboard"; Url="https://fal.ai/dashboard"},
    @{Name="Printful Dashboard"; Url="https://www.printful.com/dashboard"},
    @{Name="Resend Dashboard"; Url="https://resend.com/emails"}
)

foreach ($service in $services) {
    $urlFile = "$desktopPath\$($service.Name).url"
    $content = @"
[InternetShortcut]
URL=$($service.Url)
"@
    $content | Out-File -FilePath $urlFile -Encoding ASCII
    Write-Host "Created URL shortcut: $($service.Name)" -ForegroundColor Green
}

Write-Host "`nAll shortcuts created on desktop!" -ForegroundColor Cyan
Write-Host "You can now access your accounts from desktop icons." -ForegroundColor Cyan

