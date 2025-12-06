# Push Fur_and_Fame to GitHub
# This script will ensure your code is pushed to GitHub

Write-Host "🚀 Checking and pushing code to GitHub..." -ForegroundColor Cyan
Write-Host ""

# Navigate to project directory
Set-Location "c:\Users\ccate\Fur_and_Fame"

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "📦 Initializing git repository..." -ForegroundColor Yellow
    git init
}

# Check if there are any commits
$commitCount = (git log --oneline 2>&1 | Measure-Object -Line).Lines
if ($commitCount -eq 0) {
    Write-Host "📝 Making initial commit..." -ForegroundColor Yellow
    git add .
    git commit -m "Initial commit: Fur & Fame AI Pet Portrait E-Commerce Platform"
    Write-Host "✅ Initial commit created" -ForegroundColor Green
} else {
    Write-Host "✅ Repository already has commits" -ForegroundColor Green
}

# Check remote
$remote = git remote get-url origin 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "🔗 Adding GitHub remote..." -ForegroundColor Yellow
    git remote add origin https://github.com/ccates62/Fur_and_Fame.git
    Write-Host "✅ Remote added" -ForegroundColor Green
} else {
    Write-Host "✅ Remote already configured: $remote" -ForegroundColor Green
}

# Check current branch
$currentBranch = git branch --show-current 2>&1
if ([string]::IsNullOrWhiteSpace($currentBranch)) {
    Write-Host "🌿 Creating main branch..." -ForegroundColor Yellow
    git branch -M main
} else {
    Write-Host "✅ Current branch: $currentBranch" -ForegroundColor Green
    if ($currentBranch -ne "main") {
        Write-Host "🌿 Renaming branch to main..." -ForegroundColor Yellow
        git branch -M main
    }
}

# Push to GitHub
Write-Host ""
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Cyan
git push -u origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Repository: https://github.com/ccates62/Fur_and_Fame" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "✅ You can now go back to Vercel and try importing again!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Error pushing to GitHub" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Possible issues:" -ForegroundColor Yellow
    Write-Host "   1. Repository might not exist on GitHub" -ForegroundColor White
    Write-Host "   2. Authentication might be needed" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 Try creating the repository first:" -ForegroundColor Yellow
    Write-Host "   gh repo create Fur_and_Fame --private --source=. --remote=origin" -ForegroundColor White
}
