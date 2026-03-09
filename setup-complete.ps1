# 🎓 KCA UNIVERSITY EVENT MANAGEMENT SYSTEM - COMPLETE SETUP
# This script will set up the entire project with database and all dependencies

Write-Host "`n" + "=".PadRight(60, '=') -ForegroundColor Cyan
Write-Host "   🎓 KCA UNIVERSITY EVENT MANAGEMENT SYSTEM v2.0.0" -ForegroundColor Cyan
Write-Host "   🔐 ROLE-BASED ACCESS CONTROL IMPLEMENTATION" -ForegroundColor Cyan
Write-Host "=".PadRight(60, '=') -ForegroundColor Cyan

# ============ BACKEND SETUP ============
Write-Host "`n📦 Setting up Backend..." -ForegroundColor Yellow
Set-Location backend

# Install dependencies
Write-Host "   Installing backend dependencies..." -ForegroundColor Gray
npm install express cors sqlite3

# Create database directory
Write-Host "   Creating database directory..." -ForegroundColor Gray
New-Item -ItemType Directory -Path ../database -Force | Out-Null

# ============ FRONTEND SETUP ============
Write-Host "`n📦 Setting up Frontend..." -ForegroundColor Yellow
Set-Location ../frontend

# Install dependencies
Write-Host "   Installing frontend dependencies..." -ForegroundColor Gray
npm install react-router-dom axios

# ============ VERIFICATION ============
Write-Host "`n✅ Setup Complete!" -ForegroundColor Green
Write-Host "`n📋 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "   1. Start Backend:  cd backend && npm start" -ForegroundColor White
Write-Host "   2. Start Frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host "   3. Open Browser:   http://localhost:5173" -ForegroundColor White
Write-Host "`n🔑 TEST CREDENTIALS:" -ForegroundColor Cyan
Write-Host "   Student: student@students.kca.ac.ke / Student123!" -ForegroundColor White
Write-Host "   Staff:   staff@staff.kca.ac.ke / Staff123!" -ForegroundColor White
Write-Host "   Admin:   admin@kca.ac.ke / Admin123!" -ForegroundColor White
Write-Host "`n📊 DATABASE ADMIN:" -ForegroundColor Cyan
Write-Host "   http://localhost:5000/api/admin/database" -ForegroundColor White
Write-Host "`n" + "=".PadRight(60, '=') -ForegroundColor Cyan
