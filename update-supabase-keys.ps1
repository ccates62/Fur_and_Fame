# PowerShell script to update Supabase API keys
# This will update the dashboard and provide instructions for .env.local

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Update Supabase API Keys" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script will help you update your Supabase API keys." -ForegroundColor Yellow
Write-Host ""
Write-Host "You can find these keys at:" -ForegroundColor White
Write-Host "  https://supabase.com/dashboard/project/_/settings/api" -ForegroundColor Cyan
Write-Host ""

# Get current values for reference
$currentUrl = "https://kanhbrdiagogexsyfkkl.supabase.co"
$currentAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthbmhicmRpYWdvZ2V4c3lma2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NzQ1MzksImV4cCI6MjA4MDU1MDUzOX0.Pv7oWQCSixo_nQFuQqdOqXfvju938rP_4NB5CD7hLZI"
$currentServiceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthbmhicmRpYWdvZ2V4c3lma2tsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDk3NDUzOSwiZXhwIjoyMDgwNTUwNTM5fQ.vlDfknuiahsOjoN006vMvPGCOUE1TX3nAGlY8zXIduk"

Write-Host "Current values (for reference):" -ForegroundColor Gray
Write-Host "  URL: $currentUrl" -ForegroundColor Gray
Write-Host "  Anon Key: $($currentAnonKey.Substring(0, 50))..." -ForegroundColor Gray
Write-Host "  Service Role Key: $($currentServiceRoleKey.Substring(0, 50))..." -ForegroundColor Gray
Write-Host ""

# Prompt for new values
Write-Host "Enter your new Supabase API keys:" -ForegroundColor Yellow
Write-Host ""

# Get Project URL
Write-Host "1. NEXT_PUBLIC_SUPABASE_URL" -ForegroundColor Cyan
Write-Host "   (Example: https://xxxxx.supabase.co)" -ForegroundColor Gray
$newUrl = Read-Host "   Enter Project URL"

if ([string]::IsNullOrWhiteSpace($newUrl)) {
    Write-Host "   Using current value: $currentUrl" -ForegroundColor Yellow
    $newUrl = $currentUrl
} else {
    # Validate URL format
    if ($newUrl -notmatch "^https://.*\.supabase\.co$") {
        Write-Host "   Warning: URL doesn't match expected format (https://xxxxx.supabase.co)" -ForegroundColor Yellow
        $confirm = Read-Host "   Continue anyway? (y/n)"
        if ($confirm -ne "y" -and $confirm -ne "Y") {
            Write-Host "   Cancelled." -ForegroundColor Yellow
            exit 0
        }
    }
}

Write-Host ""

# Get Anon Key
Write-Host "2. NEXT_PUBLIC_SUPABASE_ANON_KEY" -ForegroundColor Cyan
Write-Host "   (This is the 'anon public' key - starts with 'eyJ...')" -ForegroundColor Gray
$newAnonKey = Read-Host "   Enter Anon Key"

if ([string]::IsNullOrWhiteSpace($newAnonKey)) {
    Write-Host "   Using current value" -ForegroundColor Yellow
    $newAnonKey = $currentAnonKey
} else {
    # Validate JWT format
    if ($newAnonKey -notmatch "^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$") {
        Write-Host "   Warning: Key doesn't look like a valid JWT token" -ForegroundColor Yellow
        $confirm = Read-Host "   Continue anyway? (y/n)"
        if ($confirm -ne "y" -and $confirm -ne "Y") {
            Write-Host "   Cancelled." -ForegroundColor Yellow
            exit 0
        }
    }
}

Write-Host ""

# Get Service Role Key
Write-Host "3. SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor Cyan
Write-Host "   (This is the 'service_role' key - also starts with 'eyJ...')" -ForegroundColor Gray
Write-Host "   WARNING: Keep this key secret! Never commit it to public repos." -ForegroundColor Red
$newServiceRoleKey = Read-Host "   Enter Service Role Key"

if ([string]::IsNullOrWhiteSpace($newServiceRoleKey)) {
    Write-Host "   Using current value" -ForegroundColor Yellow
    $newServiceRoleKey = $currentServiceRoleKey
} else {
    # Validate JWT format
    if ($newServiceRoleKey -notmatch "^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$") {
        Write-Host "   Warning: Key doesn't look like a valid JWT token" -ForegroundColor Yellow
        $confirm = Read-Host "   Continue anyway? (y/n)"
        if ($confirm -ne "y" -and $confirm -ne "Y") {
            Write-Host "   Cancelled." -ForegroundColor Yellow
            exit 0
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "New values:" -ForegroundColor White
Write-Host "  URL: $newUrl" -ForegroundColor Gray
Write-Host "  Anon Key: $($newAnonKey.Substring(0, 50))..." -ForegroundColor Gray
Write-Host "  Service Role Key: $($newServiceRoleKey.Substring(0, 50))..." -ForegroundColor Gray
Write-Host ""

$confirm = Read-Host "Update dashboard with these values? (y/n)"

if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host ""
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Updating dashboard..." -ForegroundColor Cyan

# Update the dashboard file
$dashboardFile = "src\app\accounts\page.tsx"

if (Test-Path $dashboardFile) {
    try {
        $content = Get-Content $dashboardFile -Raw
        
        # Update URL
        $content = $content -replace "value: `"https://kanhbrdiagogexsyfkkl\.supabase\.co`"", "value: `"$newUrl`""
        $content = $content -replace "https://kanhbrdiagogexsyfkkl\.supabase\.co", $newUrl
        
        # Update Anon Key
        $content = $content -replace "value: `"$([regex]::Escape($currentAnonKey))`"", "value: `"$newAnonKey`""
        
        # Update Service Role Key
        $content = $content -replace "value: `"$([regex]::Escape($currentServiceRoleKey))`"", "value: `"$newServiceRoleKey`""
        
        # Save the file
        Set-Content -Path $dashboardFile -Value $content -NoNewline
        
        Write-Host "  [SUCCESS] Dashboard updated!" -ForegroundColor Green
    } catch {
        Write-Host "  [ERROR] Failed to update dashboard: $_" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "  [WARNING] Dashboard file not found: $dashboardFile" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Update .env.local file:" -ForegroundColor Yellow
Write-Host "   Open .env.local and update these values:" -ForegroundColor White
Write-Host ""
Write-Host "   NEXT_PUBLIC_SUPABASE_URL=$newUrl" -ForegroundColor Gray
Write-Host "   NEXT_PUBLIC_SUPABASE_ANON_KEY=$newAnonKey" -ForegroundColor Gray
Write-Host "   SUPABASE_SERVICE_ROLE_KEY=$newServiceRoleKey" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Restart your Next.js server:" -ForegroundColor Yellow
Write-Host "   Stop the server (Ctrl+C) and run: npx next dev" -ForegroundColor White
Write-Host ""
Write-Host "3. Test the connection:" -ForegroundColor Yellow
Write-Host "   Visit: http://localhost:3000/accounts" -ForegroundColor White
Write-Host "   Check that Supabase keys are displayed correctly" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Update Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
