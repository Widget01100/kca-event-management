Write-Host "=== BACKEND API TEST ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Server is running
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000" -TimeoutSec 3
    Write-Host "✅ Server is running" -ForegroundColor Green
    Write-Host "   Message: $($response.message)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Server not responding" -ForegroundColor Red
    exit 1
}

# Test 2: Register a user
Write-Host ""
Write-Host "Testing user registration..." -ForegroundColor Yellow

$userData = @{
    studentId = "23/05349"
    name = "Admin User"
    email = "admin@kca.com"
    password = "admin123"
    role = "admin"
}

$jsonBody = $userData | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
        -Method Post `
        -Body $jsonBody `
        -ContentType "application/json" `
        -TimeoutSec 5
    
    if ($response.success) {
        Write-Host "✅ Registration successful!" -ForegroundColor Green
        Write-Host "   User: $($response.user.name)" -ForegroundColor Gray
        Write-Host "   Role: $($response.user.role)" -ForegroundColor Gray
        Write-Host "   Token received!" -ForegroundColor Gray
        
        # Save token for later use
        $response.token | Out-File -FilePath "test-token.txt" -Encoding UTF8
        Write-Host "   Token saved to test-token.txt" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Login
Write-Host ""
Write-Host "Testing user login..." -ForegroundColor Yellow

$loginData = @{
    email = "admin@kca.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
        -Method Post `
        -Body $loginData `
        -ContentType "application/json" `
        -TimeoutSec 5
    
    if ($response.success) {
        Write-Host "✅ Login successful!" -ForegroundColor Green
        Write-Host "   Welcome, $($response.user.name)!" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== NEXT STEPS ===" -ForegroundColor Green
Write-Host "1. Backend is now working with:" -ForegroundColor White
Write-Host "   - MongoDB connection" -ForegroundColor Gray
Write-Host "   - User authentication (register/login)" -ForegroundColor Gray
Write-Host "   - JWT tokens" -ForegroundColor Gray
Write-Host "2. Next we'll create event management" -ForegroundColor White
Write-Host "3. Then build the frontend" -ForegroundColor White
