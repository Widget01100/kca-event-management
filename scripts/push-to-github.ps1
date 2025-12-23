# ============================================
# KCA Event System - Manual Git Push
# ============================================
Write-Host "=== KCA UNIVERSITY EVENT SYSTEM ===" -ForegroundColor Cyan
Write-Host "GitHub Push Utility`n" -ForegroundColor Yellow

# Show current status
Write-Host "📊 Current status:" -ForegroundColor Gray
git status --short

# Add all changes
git add .
$changes = git status --porcelain

if ($changes) {
    $changeCount = ($changes -split "`n").Count
    Write-Host "`n📦 Found $changeCount changed file(s)" -ForegroundColor Green
    
    # Get commit message
    Write-Host "`n💬 Commit message:" -ForegroundColor Yellow
    $defaultMessage = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    $commitMessage = Read-Host "Press Enter for '$defaultMessage' or type custom message"
    
    if ([string]::IsNullOrWhiteSpace($commitMessage)) {
        $commitMessage = $defaultMessage
    }
    
    # Commit
    Write-Host "`n🔄 Committing changes..." -ForegroundColor Yellow
    git commit -m $commitMessage
    
    # Push to GitHub
    Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ SUCCESS! Code pushed to GitHub" -ForegroundColor Green
    } else {
        Write-Host "`n⚠️  Push failed. Trying force push..." -ForegroundColor Yellow
        git push origin main --force
    }
    
    Write-Host "`n🌐 Repository: https://github.com/Widget01100/kca-event-management" -ForegroundColor Blue
} else {
    Write-Host "`nℹ️ No changes to commit" -ForegroundColor Yellow
}

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
pause
