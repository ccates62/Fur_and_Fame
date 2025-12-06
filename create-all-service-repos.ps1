# PowerShell script to create GitHub repositories for all Fur & Fame services
# Requires GitHub CLI (gh) to be installed and authenticated

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🐙 Create All Service Repositories" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if GitHub CLI is installed
try {
    $null = gh --version 2>&1 | Out-Null
    Write-Host "✅ GitHub CLI detected" -ForegroundColor Green
} catch {
    Write-Host "❌ GitHub CLI not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install GitHub CLI first:" -ForegroundColor Yellow
    Write-Host "  1. Visit: https://cli.github.com/" -ForegroundColor White
    Write-Host "  2. Download and install" -ForegroundColor White
    Write-Host "  3. Run: gh auth login" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Check if authenticated
Write-Host "Checking authentication..." -ForegroundColor Yellow
try {
    $null = gh auth status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ GitHub CLI authenticated" -ForegroundColor Green
    } else {
        throw "Not authenticated"
    }
} catch {
    Write-Host "⚠️  Not authenticated!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please authenticate first:" -ForegroundColor Yellow
    Write-Host "  Run: gh auth login" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "This script will create repositories for all your services:" -ForegroundColor Cyan
Write-Host ""

# Define all service repositories based on your dashboard services
$repositories = @(
    @{
        Name = "Fur_and_Fame"
        Description = "AI Pet Portrait E-Commerce Platform - Main Project"
        Private = $false
    },
    @{
        Name = "fur-and-fame-supabase"
        Description = "Supabase integration - Database, Auth, and Storage for Fur & Fame"
        Private = $false
    },
    @{
        Name = "fur-and-fame-fal-ai"
        Description = "fal.ai integration for AI portrait generation using Flux Pro"
        Private = $false
    },
    @{
        Name = "fur-and-fame-stripe"
        Description = "Stripe payment integration and webhook handlers"
        Private = $false
    },
    @{
        Name = "fur-and-fame-printful"
        Description = "Printful API integration for order fulfillment (canvas, mugs)"
        Private = $false
    },
    @{
        Name = "fur-and-fame-resend"
        Description = "Resend email templates and transactional email automation"
        Private = $false
    },
    @{
        Name = "fur-and-fame-vercel"
        Description = "Vercel deployment configuration and CI/CD"
        Private = $false
    },
    @{
        Name = "fur-and-fame-docs"
        Description = "Documentation, setup guides, and project documentation"
        Private = $false
    }
)

# Display repositories to be created
foreach ($repo in $repositories) {
    $visibility = if ($repo.Private) { "Private" } else { "Public" }
    Write-Host "  - $($repo.Name)" -ForegroundColor White
    Write-Host "    $($repo.Description)" -ForegroundColor Gray
    Write-Host "    Visibility: $visibility" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "Total repositories: $($repositories.Count)" -ForegroundColor Cyan
Write-Host ""

$confirm = Read-Host "Do you want to create these repositories? (y/n)"

if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host ""
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Creating repositories..." -ForegroundColor Cyan
Write-Host ""

$created = 0
$skipped = 0
$failed = 0
$createdRepos = @()

foreach ($repo in $repositories) {
    Write-Host "Creating $($repo.Name)..." -NoNewline
    
    try {
        # Check if repo already exists
        $null = gh repo view $repo.Name 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host " [WARNING] Already exists, skipping" -ForegroundColor Yellow
            $skipped++
        } else {
            # Create the repository
            $visibility = if ($repo.Private) { "--private" } else { "--public" }
            $createResult = gh repo create $repo.Name --description $repo.Description $visibility --confirm 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host " [SUCCESS] Created" -ForegroundColor Green
                $created++
                $createdRepos += $repo.Name
            } else {
                Write-Host " [ERROR] Failed" -ForegroundColor Red
                if ($createResult) {
                    Write-Host "   Error: $createResult" -ForegroundColor Red
                }
                $failed++
            }
        }
    } catch {
        Write-Host " [ERROR] $_" -ForegroundColor Red
        $failed++
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  [SUCCESS] Created: $created" -ForegroundColor Green
Write-Host "  [WARNING] Skipped: $skipped" -ForegroundColor Yellow
Write-Host "  [ERROR] Failed: $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Gray" })
Write-Host ""

if ($created -gt 0) {
    Write-Host "Successfully created repositories:" -ForegroundColor Green
    foreach ($repoName in $createdRepos) {
        Write-Host "  - $repoName" -ForegroundColor White
    }
    Write-Host ""
}

Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. View your repositories: gh repo list" -ForegroundColor White
Write-Host "  2. Clone a repository: gh repo clone <username>/$($repositories[0].Name)" -ForegroundColor White
Write-Host "  3. Update repository URLs in your dashboard if needed" -ForegroundColor White
Write-Host "  4. Start coding!" -ForegroundColor White
Write-Host ""
