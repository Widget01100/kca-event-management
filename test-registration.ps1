Write-Host "=== Testing API Registration ===" -ForegroundColor Cyan

# Test data
$testUser = @{
    studentId = "23/05349"
    name = "Admin User"
    email = "admin@kca.com"
    password = "admin123"
    role = "admin"
}

$jsonBody = $testUser | ConvertTo-Json

try {
    Write-Host "Sending registration request..." -ForegroundColor Yellow
    
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
        -Method Post `
        -Body $jsonBody `
        -ContentType "application/json"
    
    if ($response.success) {
        Write-Host "✅ REGISTRATION SUCCESSFUL!" -ForegroundColor Green
        Write-Host "Token: $($response.token.substring(0, 30))..." -ForegroundColor Gray
        Write-Host "User: $($response.user.name) ($($response.user.role))" -ForegroundColor Gray
        
        # Save token for testing
        $response.token | Out-File -FilePath "test-token.txt" -Encoding UTF8
        Write-Host "Token saved to test-token.txt" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ REGISTRATION FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    # Try to get more details
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Test Login ===" -ForegroundColor Cyan

$loginData = @{
    email = "admin@kca.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
        -Method Post `
        -Body $loginData `
        -ContentType "application/json"
    
    if ($response.success) {
        Write-Host "✅ LOGIN SUCCESSFUL!" -ForegroundColor Green
        Write-Host "User logged in: $($response.user.name)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ LOGIN FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
