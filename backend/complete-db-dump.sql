-- KCA Events Database - Complete Data Dump
\echo '========================================'
\echo ' KCA EVENTS DATABASE - COMPLETE DATA'
\echo '========================================'
\echo 'Database: kca_events_db'
\echo 'User: postgres'
\echo 'Generated: ' || NOW()
\echo ''

-- 1. Show all tables with record counts
\echo '=== TABLES & RECORD COUNTS ==='
SELECT 
    table_name,
    (xpath('/row/count/text()', 
           query_to_xml(format('select count(*) from %I', table_name), 
           false, true, '')))[1]::text::int as row_count
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

\echo ''

-- 2. EVENTS table - complete data
\echo '=== EVENTS TABLE (All Records) ==='
SELECT * FROM events ORDER BY start_date;

\echo ''

-- 3. USERS table - complete data (hide passwords)
\echo '=== USERS TABLE ==='
SELECT 
    id, 
    email, 
    full_name, 
    role, 
    student_id, 
    staff_id,
    faculty,
    department,
    phone,
    is_verified,
    created_at
FROM users 
ORDER BY created_date DESC;

\echo ''

-- 4. REGISTRATIONS table
\echo '=== REGISTRATIONS TABLE ==='
SELECT * FROM registrations 
ORDER BY registration_date DESC 
LIMIT 10;

\echo ''

-- 5. RESOURCES table
\echo '=== RESOURCES TABLE ==='
SELECT * FROM resources 
ORDER BY name;

\echo ''

-- 6. Database statistics
\echo '=== DATABASE STATISTICS ==='
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM events) as total_events,
    (SELECT COUNT(*) FROM registrations) as total_registrations,
    (SELECT COUNT(*) FROM resources) as total_resources,
    (SELECT SUM(capacity) FROM events) as total_event_capacity,
    (SELECT COUNT(*) FROM events WHERE start_date > NOW()) as upcoming_events;
