# Automated Supabase Email Fix Script
# This script will find your user and update the email automatically

$SUPABASE_URL = "https://kanhbrdiagogexsyfkkl.supabase.co"
$SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthbmhicmRpYWdvZ2V4c3lma2tsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDk3NDUzOSwiZXhwIjoyMDgwNTUwNTM5fQ.vlDfknuiahsOjoN006vMvPGCOUE1TX3nAGlY8zXIduk"
$MISSPELLED_EMAIL = "ccates.timberlinecolletive@gmail.com"
$CORRECT_EMAIL = "ccates.timberlinecollective@gmail.com"

$headers = @{
    "apiKey" = $SERVICE_ROLE_KEY
    "Authorization" = "Bearer $SERVICE_ROLE_KEY"
    "Content-Type" = "application/json"
}

Write-Host "Step A: Finding user by email..." -ForegroundColor Yellow
Write-Host ""

try {
    # Step A - Find the user (try both emails)
    Write-Host "Trying misspelled email first..." -ForegroundColor Cyan
    $findUserResponse = Invoke-RestMethod -Uri "$SUPABASE_URL/auth/v1/admin/users?email=$MISSPELLED_EMAIL" -Method GET -Headers $headers
    
    # If not found, try corrected email
    if (-not $findUserResponse.users -or $findUserResponse.users.Count -eq 0) {
        Write-Host "Not found with misspelled email. Trying corrected email..." -ForegroundColor Cyan
        $findUserResponse = Invoke-RestMethod -Uri "$SUPABASE_URL/auth/v1/admin/users?email=$CORRECT_EMAIL" -Method GET -Headers $headers
    }
    
    # If still not found, list all users (to find the account)
    if (-not $findUserResponse.users -or $findUserResponse.users.Count -eq 0) {
        Write-Host "Not found by email. Listing all users to find your account..." -ForegroundColor Cyan
        $allUsersResponse = Invoke-RestMethod -Uri "$SUPABASE_URL/auth/v1/admin/users" -Method GET -Headers $headers
        Write-Host "Found $($allUsersResponse.users.Count) total users" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "All users:" -ForegroundColor Yellow
        $allUsersResponse.users | ForEach-Object {
            Write-Host "  - ID: $($_.id), Email: $($_.email)" -ForegroundColor White
        }
        Write-Host ""
        Write-Host "❌ Could not find user with either email." -ForegroundColor Red
        Write-Host "This might be your Supabase account email (not an auth user)." -ForegroundColor Yellow
        Write-Host "You may need to update it in Supabase Dashboard → Account Settings instead." -ForegroundColor Yellow
        exit
    }
    
    if ($findUserResponse.users -and $findUserResponse.users.Count -gt 0) {
        $user = $findUserResponse.users[0]
        $USER_ID = $user.id
        
        Write-Host "✅ User found!" -ForegroundColor Green
        Write-Host "User ID: $USER_ID" -ForegroundColor Cyan
        Write-Host "Current Email: $($user.email)" -ForegroundColor Yellow
        Write-Host ""
        
        # Step C - Update email
        Write-Host "Step C: Updating email to $CORRECT_EMAIL..." -ForegroundColor Yellow
        $updateBody = @{
            email = $CORRECT_EMAIL
            email_confirmed_at = $null
        } | ConvertTo-Json
        
        $null = Invoke-RestMethod -Uri "$SUPABASE_URL/auth/v1/admin/users/$USER_ID" -Method PUT -Headers $headers -Body $updateBody
        
        Write-Host "✅ Email updated successfully!" -ForegroundColor Green
        Write-Host ""
        
        # Step D - Send confirmation email
        Write-Host "Step D: Sending confirmation email..." -ForegroundColor Yellow
        $null = Invoke-RestMethod -Uri "$SUPABASE_URL/auth/v1/admin/users/$USER_ID/confirm" -Method POST -Headers $headers
        
        Write-Host "✅ Confirmation email sent!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎉 All done! Check your email ($CORRECT_EMAIL) for the confirmation link." -ForegroundColor Green
        
    } elseif ($findUserResponse -is [array] -and $findUserResponse.Count -gt 0) {
        # Handle array response
        $user = $findUserResponse[0]
        $USER_ID = $user.id
        
        Write-Host "✅ User found!" -ForegroundColor Green
        Write-Host "User ID: $USER_ID" -ForegroundColor Cyan
        Write-Host "Current Email: $($user.email)" -ForegroundColor Yellow
        Write-Host ""
        
        # Step C - Update email
        Write-Host "Step C: Updating email to $CORRECT_EMAIL..." -ForegroundColor Yellow
        $updateBody = @{
            email = $CORRECT_EMAIL
            email_confirmed_at = $null
        } | ConvertTo-Json
        
        $null = Invoke-RestMethod -Uri "$SUPABASE_URL/auth/v1/admin/users/$USER_ID" -Method PUT -Headers $headers -Body $updateBody
        
        Write-Host "✅ Email updated successfully!" -ForegroundColor Green
        Write-Host ""
        
        # Step D - Send confirmation email
        Write-Host "Step D: Sending confirmation email..." -ForegroundColor Yellow
        $null = Invoke-RestMethod -Uri "$SUPABASE_URL/auth/v1/admin/users/$USER_ID/confirm" -Method POST -Headers $headers
        
        Write-Host "✅ Confirmation email sent!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎉 All done! Check your email ($CORRECT_EMAIL) for the confirmation link." -ForegroundColor Green
        
    } else {
        Write-Host "❌ User not found with email: $MISSPELLED_EMAIL" -ForegroundColor Red
        Write-Host ""
        Write-Host "This email is likely your Supabase ACCOUNT email (for logging into Supabase.com)," -ForegroundColor Yellow
        Write-Host "not an auth user in your project." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "To update your Supabase account email:" -ForegroundColor Cyan
        Write-Host "1. Contact Supabase support to remove the email from suppression list" -ForegroundColor White
        Write-Host "2. Then update it in: https://supabase.com/dashboard/account" -ForegroundColor White
        Write-Host ""
        Write-Host "Listing all auth users in your project for reference:" -ForegroundColor Cyan
        try {
            $allUsers = Invoke-RestMethod -Uri "$SUPABASE_URL/auth/v1/admin/users" -Method GET -Headers $headers
            if ($allUsers.users -and $allUsers.users.Count -gt 0) {
                $allUsers.users | ForEach-Object {
                    Write-Host "  - Email: $($_.email), ID: $($_.id)" -ForegroundColor White
                }
            } else {
                Write-Host "  No auth users found in this project." -ForegroundColor Gray
            }
        } catch {
            Write-Host "  Could not list users: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
} catch {
    Write-Host "❌ Error occurred:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Yellow
    }
}
