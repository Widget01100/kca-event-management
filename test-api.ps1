Write-Host "?? Testing KCA Event Management API..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:5000/api"

# 1. Test Health Endpoint
Write-Host "`n1. Testing Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "   ? $($health.message)" -ForegroundColor Green
    Write-Host "   Time: $($health.timestamp)"
} catch {
    Write-Host "   ? Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Test Database Connection
Write-Host "`n2. Testing Database Connection..." -ForegroundColor Yellow
try {
    $db = Invoke-RestMethod -Uri "$baseUrl/test-db" -Method Get
    Write-Host "   ? $($db.message)" -ForegroundColor Green
    Write-Host "   Version: $($db.postgresVersion)"
} catch {
    Write-Host "   ? Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Test Events Endpoint
Write-Host "`n3. Testing Events Endpoint..." -ForegroundColor Yellow
try {
    $events = Invoke-RestMethod -Uri "$baseUrl/events" -Method Get
    Write-Host "   ? Found $($events.count) events" -ForegroundColor Green
    
    if ($events.count -gt 0) {
        Write-Host "   Sample Events:" -ForegroundColor Gray
        $events.data | Select-Object -First 3 | ForEach-Object {
            Write-Host "   • $($_.title)" -ForegroundColor White
            Write-Host "     ?? $($_.venue)" -ForegroundColor Gray
            Write-Host "     ???  $($_.start_date)" -ForegroundColor Gray
            Write-Host ""
        }
    }
} catch {
    Write-Host "   ? Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Test Stats Endpoint
Write-Host "`n4. Testing Statistics..." -ForegroundColor Yellow
try {
    $stats = Invoke-RestMethod -Uri "$baseUrl/stats" -Method Get
    Write-Host "   ? System Statistics:" -ForegroundColor Green
    Write-Host "   ?? Users: $($stats.data.users)" -ForegroundColor White
    Write-Host "   ?? Events: $($stats.data.events)" -ForegroundColor White
    Write-Host "   ??? Resources: $($stats.data.resources)" -ForegroundColor White
    Write-Host "   ?? University: $($stats.data.university)" -ForegroundColor White
} catch {
    Write-Host "   ? Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Test API Documentation
Write-Host "`n5. Testing API Documentation..." -ForegroundColor Yellow
try {
    $api = Invoke-RestMethod -Uri "$baseUrl" -Method Get
    Write-Host "   ? $($api.message)" -ForegroundColor Green
    Write-Host "   Version: $($api.version)" -ForegroundColor Gray
} catch {
    Write-Host "   ? Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "? Testing Complete!" -ForegroundColor Green
Write-Host "`n?? Quick Reference:" -ForegroundColor Cyan
Write-Host "• View in browser: http://localhost:5000/api" -ForegroundColor Gray
Write-Host "• Events: http://localhost:5000/api/events" -ForegroundColor Gray
Write-Host "• Health: http://localhost:5000/api/health" -ForegroundColor Gray
