Write-Host "=== KCA Event Management Setup Check ===" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found" -ForegroundColor Red
    Write-Host "  Install from: https://nodejs.org" -ForegroundColor Yellow
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "✓ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm not found" -ForegroundColor Red
}

# Check MongoDB service
try {
    $mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
    if ($mongoService.Status -eq "Running") {
        Write-Host "✓ MongoDB service: Running" -ForegroundColor Green
    } else {
        Write-Host "⚠ MongoDB service: $($mongoService.Status)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ MongoDB service not found" -ForegroundColor Red
    Write-Host "  Install from: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
}

# Check project files
Write-Host ""
Write-Host "Project Files:" -ForegroundColor Cyan

$files = @("package.json", ".env", "server.js", "src/config/database.js")
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file (missing)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Ready to Start ===" -ForegroundColor Green
Write-Host "To start server: npm run dev" -ForegroundColor White
Write-Host "To test: Open http://localhost:5000" -ForegroundColor White
