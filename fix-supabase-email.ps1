# Fix Supabase Email - Run these commands one at a time
# Replace YOUR-SERVICE-ROLE-KEY with the actual key from Supabase dashboard

$SUPABASE_URL = "https://kanhbrdiagogexsyfkkl.supabase.co"
$SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthbmhicmRpYWdvZ2V4c3lma2tsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDk3NDUzOSwiZXhwIjoyMDgwNTUwNTM5fQ.vlDfknuiahsOjoN006vMvPGCOUE1TX3nAGlY8zXIduk"
$MISSPELLED_EMAIL = "ccates.timberlinecolletive@gmail.com"
$CORRECT_EMAIL = "ccates.timberlinecollective@gmail.com"
# Note: $CORRECT_EMAIL is used in commented code below - this is intentional

Write-Host "Step A: Finding user by email ($MISSPELLED_EMAIL)..." -ForegroundColor Yellow
Write-Host "Target email: $CORRECT_EMAIL" -ForegroundColor Cyan
Write-Host ""

# Step A - Find the user by email
$headers = @{
    "apiKey" = $SERVICE_ROLE_KEY
    "Authorization" = "Bearer $SERVICE_ROLE_KEY"
}
$findUser = Invoke-RestMethod -Uri "$SUPABASE_URL/auth/v1/admin/users?email=$MISSPELLED_EMAIL" -Method GET -Headers $headers

Write-Host $findUser
Write-Host ""
Write-Host "Copy the 'id' field from the response above, then run the next steps." -ForegroundColor Green
Write-Host ""
Write-Host "After you have the USER-ID, update this script with it and run Step C and D." -ForegroundColor Cyan

# Step C - Update email (uncomment and add USER-ID after Step A)
# $USER_ID = "PASTE-USER-ID-HERE"
# $updateBody = @{
#     email = $CORRECT_EMAIL
#     email_confirmed_at = $null
# } | ConvertTo-Json
# $null = Invoke-RestMethod -Uri "$SUPABASE_URL/auth/v1/admin/users/$USER_ID" -Method PUT -Headers $headers -Body $updateBody -ContentType "application/json"

# Step D - Send confirmation email (uncomment after Step C)
# $null = Invoke-RestMethod -Uri "$SUPABASE_URL/auth/v1/admin/users/$USER_ID/confirm" -Method POST -Headers $headers
