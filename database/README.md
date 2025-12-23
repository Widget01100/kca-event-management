# KCA University Event Management System - Database

## 📊 Current Database Setup

**Status: Using Mock Data for Development/Demo**

The system is currently configured to use hardcoded mock data for demonstration purposes. This allows the application to run without requiring a database server.

## 🔧 Mock Data Configuration

### Location: ackend/app.js
The mock data is defined as a JavaScript array (kcaEvents) containing 3 sample events:

1. **KCA Career Fair 2024** - Career event
2. **Annual Sports Day** - Sports competition  
3. **Tech Innovation Seminar** - Technology conference

### API Endpoints Using Mock Data:
- GET /api/events - Returns all mock events
- GET /api/events/:id - Returns specific mock event
- GET /api/stats - Calculates statistics from mock data
- GET /api/test-db - Returns mock status message

## 🗄️ Future Database Implementation

### Option 1: SQLite (Recommended for Development)
1. Install sqlite3: 
pm install sqlite3
2. Create database: sqlite3 kca_events.db
3. Use schema in database/schema/tables.sql

### Option 2: PostgreSQL (Production)
1. Install PostgreSQL
2. Create database: createdb kca_events_db
3. Run: psql -d kca_events_db -f database/schema/tables.sql

## 📁 Database Schema Files

This folder contains schema definitions for future implementation:

- schema/tables.sql - Table definitions
- seed/sample_data.sql - Sample data matching current mock events
- migrations/ - Database migration scripts (future)
- ackups/ - Database backup files (future)

## 🚀 Quick Start (Current Mock Setup)
The system works immediately with mock data. No database setup required for demonstration.

## 🔄 Switching to Real Database
When ready to switch from mock data to a real database:
1. Uncomment database connection code in ackend/app.js
2. Update API endpoints to query the database
3. Remove the hardcoded kcaEvents array
