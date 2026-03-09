Write-Host "=== KCA Event Management System Setup ===" -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is NOT installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js first:" -ForegroundColor Yellow
    Write-Host "1. Go to https://nodejs.org" -ForegroundColor White
    Write-Host "2. Download the LTS version" -ForegroundColor White
    Write-Host "3. Run the installer" -ForegroundColor White
    Write-Host "4. Restart VS Code and run this script again" -ForegroundColor White
    Write-Host ""
    pause
    exit 1
}

# Check npm
$npmVersion = npm --version
Write-Host "✓ npm installed: $npmVersion" -ForegroundColor Green

# Navigate to backend
cd backend

Write-Host ""
Write-Host "=== Installing Backend Dependencies ===" -ForegroundColor Cyan

# Install required packages
npm install express mongoose bcryptjs jsonwebtoken cors dotenv socket.io express-validator multer nodemailer helmet morgan

# Remove Firebase dependencies
npm uninstall firebase-admin @firebase/rules-unit-testing firebase

# Install dev dependencies
npm install -D nodemon

Write-Host ""
Write-Host "=== Backend Setup Complete! ===" -ForegroundColor Green
Write-Host ""

# Create .env file if it doesn't exist
if (!(Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    @"
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/kca_events

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=5
UPLOAD_PATH=./public/uploads
"@ | Out-File -FilePath ".\.env" -Encoding UTF8
    Write-Host "✓ .env file created" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Yellow
Write-Host "1. Install MongoDB: https://www.mongodb.com/try/download/community" -ForegroundColor White
Write-Host "2. Start MongoDB service" -ForegroundColor White
Write-Host "3. Run: npm run dev" -ForegroundColor White
Write-Host "4. Check if server starts on http://localhost:5000" -ForegroundColor White
