# PowerShell script to create GitHub repositories for Fur & Fame projects
# Requires GitHub CLI (gh) to be installed and authenticated

Write-Host "🐙 Creating GitHub Repositories for Fur & Fame Projects" -ForegroundColor Cyan
Write-Host ""

# Check if GitHub CLI is installed
try {
    $ghVersion = gh --version 2>&1
    Write-Host "✅ GitHub CLI detected" -ForegroundColor Green
} catch {
    Write-Host "❌ GitHub CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "   Visit: https://cli.github.com/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or create repositories manually at: https://github.com/new" -ForegroundColor Yellow
    exit 1
}

# Check if authenticated
try {
    gh auth status 2>&1 | Out-Null
    Write-Host "✅ GitHub CLI authenticated" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Not authenticated. Run: gh auth login" -ForegroundColor Yellow
    Write-Host "   Or create repositories manually at: https://github.com/new" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "This script will create the following repositories:" -ForegroundColor Cyan
Write-Host ""

$repositories = @(
    @{Name="Fur_and_Fame"; Description="AI Pet Portrait E-Commerce Platform - Main Project"; Private=$false},
    @{Name="fur-and-fame-api"; Description="Backend API for Fur & Fame - Supabase integrations"; Private=$false},
    @{Name="fur-and-fame-stripe"; Description="Stripe payment integration and webhook handlers"; Private=$false},
    @{Name="fur-and-fame-printful"; Description="Printful API integration for order fulfillment"; Private=$false},
    @{Name="fur-and-fame-ai"; Description="fal.ai integration for AI portrait generation"; Private=$false},
    @{Name="fur-and-fame-email"; Description="Resend email templates and automation"; Private=$false},
    @{Name="fur-and-fame-video"; Description="Remotion video generation for TikTok ads"; Private=$false},
    @{Name="fur-and-fame-docs"; Description="Documentation and setup guides"; Private=$false}
)

foreach ($repo in $repositories) {
    Write-Host "  • $($repo.Name)" -ForegroundColor Gray
}

Write-Host ""
$confirm = Read-Host "Do you want to create these repositories? (y/n)"

if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Creating repositories..." -ForegroundColor Cyan
Write-Host ""

$created = 0
$skipped = 0

foreach ($repo in $repositories) {
    Write-Host "Creating $($repo.Name)..." -NoNewline
    
    try {
        # Check if repo already exists
        gh repo view $repo.Name 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host " ⚠️  Already exists, skipping" -ForegroundColor Yellow
            $skipped++
        } else {
            # Create the repository
            $visibility = if ($repo.Private) { "--private" } else { "--public" }
            gh repo create $repo.Name --description $repo.Description $visibility --confirm 2>&1 | Out-Null
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host " ✅ Created" -ForegroundColor Green
                $created++
            } else {
                Write-Host " ❌ Failed" -ForegroundColor Red
            }
        }
    } catch {
        Write-Host " ❌ Error: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Created: $created" -ForegroundColor Green
Write-Host "  Skipped: $skipped" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Update repository URLs in open-accounts.html and src/app/accounts/page.tsx" -ForegroundColor White
Write-Host "  2. Clone repositories: gh repo clone <username>/<repo-name>" -ForegroundColor White
Write-Host "  3. Start coding! 🚀" -ForegroundColor White

