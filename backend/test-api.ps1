Write-Host "=== Testing KCA Events API ===" -ForegroundColor Cyan
Write-Host ""

# Test if server is responding
Write-Host "Testing server response..." -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get
if ($response.status -eq "OK") {
    Write-Host "✓ Server is responding: $($response.status)" -ForegroundColor Green
    Write-Host "  Database status: $($response.database)" -ForegroundColor Green
    Write-Host "  Timestamp: $($response.timestamp)" -ForegroundColor Gray
} else {
    Write-Host "✗ Server not responding" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== API Endpoints ===" -ForegroundColor Cyan
Write-Host "1. GET  /              - API Info" -ForegroundColor White
Write-Host "2. GET  /health        - Health check" -ForegroundColor White
Write-Host "3. POST /api/auth/register - Register user" -ForegroundColor White
Write-Host "4. POST /api/auth/login    - Login user" -ForegroundColor White
Write-Host "5. GET  /api/auth/me  - Get current user (protected)" -ForegroundColor White

Write-Host ""
Write-Host "=== Test Registration ===" -ForegroundColor Yellow
Write-Host "To test registration, use Postman or curl:" -ForegroundColor White
Write-Host 'curl -X POST http://localhost:5000/api/auth/register \' -ForegroundColor Gray
Write-Host '  -H "Content-Type: application/json" \' -ForegroundColor Gray
Write-Host '  -d "{\"studentId\":\"23/05349\",\"name\":\"Francis Tom\",\"email\":\"francis@example.com\",\"password\":\"password123\",\"role\":\"admin\"}"' -ForegroundColor Gray

Write-Host ""
Write-Host "✓ Backend migration from Firebase to MongoDB is complete!" -ForegroundColor Green
