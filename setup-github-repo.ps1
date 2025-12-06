# Setup GitHub Repository for Fur_and_Fame
# This script will:
# 1. Initialize git if needed
# 2. Create the GitHub repository
# 3. Add remote and push code

Write-Host "🚀 Setting up GitHub repository for Fur_and_Fame..." -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "📦 Initializing git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Git already initialized" -ForegroundColor Green
}

# Check if .gitignore exists and has .env*.local
if (Test-Path .gitignore) {
    $gitignoreContent = Get-Content .gitignore -Raw
    if ($gitignoreContent -notmatch "\.env.*\.local") {
        Write-Host "⚠️  Warning: .env*.local might not be in .gitignore" -ForegroundColor Yellow
    } else {
        Write-Host "✅ .gitignore properly configured" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  Warning: No .gitignore found" -ForegroundColor Yellow
}

# Check GitHub CLI
Write-Host ""
Write-Host "Checking GitHub CLI..." -ForegroundColor Cyan
$ghCheck = gh --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ GitHub CLI found" -ForegroundColor Green
    
    # Check if authenticated
    $authStatus = gh auth status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ GitHub CLI authenticated" -ForegroundColor Green
        Write-Host ""
        
        # Create repository
        Write-Host "📝 Creating GitHub repository: ccates62/Fur_and_Fame" -ForegroundColor Cyan
        Write-Host "   (This will be a PRIVATE repository)" -ForegroundColor Gray
        Write-Host ""
        
        $createRepo = gh repo create Fur_and_Fame --private --source=. --remote=origin --description "Fur & Fame - AI Pet Portrait E-Commerce Platform" 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Repository created successfully!" -ForegroundColor Green
            Write-Host ""
            
            # Check if there are any commits
            $commitCount = (git log --oneline 2>&1 | Measure-Object -Line).Lines
            if ($commitCount -eq 0) {
                Write-Host "📝 Making initial commit..." -ForegroundColor Cyan
                git add .
                git commit -m "Initial commit: Fur & Fame AI Pet Portrait E-Commerce Platform"
            }
            
            # Push to GitHub
            Write-Host ""
            Write-Host "📤 Pushing code to GitHub..." -ForegroundColor Cyan
            git branch -M main
            git push -u origin main
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host ""
                Write-Host "🎉 SUCCESS! Repository created and code pushed!" -ForegroundColor Green
                Write-Host ""
                Write-Host "📍 Repository URL: https://github.com/ccates62/Fur_and_Fame" -ForegroundColor Cyan
                Write-Host ""
                Write-Host "✅ You can now go back to Vercel and select this repository!" -ForegroundColor Green
            } else {
                Write-Host "❌ Error pushing code. Check the error above." -ForegroundColor Red
            }
        } else {
            Write-Host "❌ Error creating repository:" -ForegroundColor Red
            Write-Host $createRepo
            Write-Host ""
            Write-Host "💡 The repository might already exist. Checking..." -ForegroundColor Yellow
            $repoCheck = gh repo view ccates62/Fur_and_Fame 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Repository already exists!" -ForegroundColor Green
                Write-Host "   Adding remote and pushing code..." -ForegroundColor Cyan
                git remote add origin https://github.com/ccates62/Fur_and_Fame.git 2>&1 | Out-Null
                git branch -M main
                git push -u origin main
            }
        }
    } else {
        Write-Host "❌ GitHub CLI not authenticated" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please run: gh auth login" -ForegroundColor Yellow
        Write-Host "Then run this script again." -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ GitHub CLI not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "📝 Manual Setup Instructions:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Go to: https://github.com/new" -ForegroundColor Cyan
    Write-Host "2. Repository name: Fur_and_Fame" -ForegroundColor Cyan
    Write-Host "3. Description: Fur & Fame - AI Pet Portrait E-Commerce Platform" -ForegroundColor Cyan
    Write-Host "4. Select: Private" -ForegroundColor Cyan
    Write-Host "5. DO NOT initialize with README, .gitignore, or license" -ForegroundColor Yellow
    Write-Host "6. Click 'Create repository'" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Then run these commands:" -ForegroundColor Yellow
    Write-Host "  git add ." -ForegroundColor White
    Write-Host "  git commit -m 'Initial commit'" -ForegroundColor White
    Write-Host "  git branch -M main" -ForegroundColor White
    Write-Host "  git remote add origin https://github.com/ccates62/Fur_and_Fame.git" -ForegroundColor White
    Write-Host "  git push -u origin main" -ForegroundColor White
}
