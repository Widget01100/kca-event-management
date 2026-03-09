-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'staff', 'admin', 'super_admin')),
    department VARCHAR(100),
    student_id VARCHAR(50),
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    event_type VARCHAR(50) CHECK (event_type IN ('academic', 'social', 'sports', 'career', 'cultural', 'seminar', 'workshop', 'other')),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    venue VARCHAR(255) NOT NULL,
    capacity INTEGER,
    current_attendees INTEGER DEFAULT 0,
    organizer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    category VARCHAR(100),
    cover_image VARCHAR(500),
    is_published BOOLEAN DEFAULT FALSE,
    is_cancelled BOOLEAN DEFAULT FALSE,
    registration_deadline TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'attended')),
    ticket_number VARCHAR(100) UNIQUE,
    qr_code_data TEXT,
    checked_in BOOLEAN DEFAULT FALSE,
    checkin_time TIMESTAMP,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, event_id)
);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('venue', 'equipment', 'technology', 'other')),
    description TEXT,
    capacity INTEGER,
    location VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: Admin123)
INSERT INTO users (email, password, first_name, last_name, role, is_verified, department)
VALUES (
    'admin@kca.ac.ke',
    '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq4H3.HS.Z6pF3W8pGAHv3e5g6yQ1O',
    'System',
    'Administrator',
    'super_admin',
    TRUE,
    'Administration'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample resources
INSERT INTO resources (name, type, capacity, location, description) VALUES
('Auditorium', 'venue', 500, 'Main Campus', 'Main auditorium with projector and sound system'),
('Sports Ground', 'venue', 1000, 'Main Campus', 'Main sports ground for outdoor events'),
('Seminar Room A', 'venue', 50, 'CBD Campus', 'Conference room with whiteboard'),
('Projector', 'equipment', NULL, 'ICT Department', 'HD Projector with screen'),
('Sound System', 'equipment', NULL, 'Auditorium', 'PA system with microphones'),
('Laptops', 'technology', 20, 'Computer Lab', 'Dell laptops for workshops')
ON CONFLICT DO NOTHING;

-- Insert sample events
INSERT INTO events (title, description, short_description, event_type, start_date, end_date, venue, capacity, category, is_published) VALUES
('KCA Career Fair 2024', 
 'Annual career fair with top companies including Safaricom, KPMG, and Equity Bank. Network with recruiters and explore internship opportunities.',
 'Connect with top employers and kickstart your career',
 'career',
 '2024-03-15 09:00:00',
 '2024-03-15 17:00:00',
 'Main Auditorium, Ruaraka Campus',
 500,
 'Career Development',
 TRUE),

('Annual Sports Day', 
 'Inter-department sports competition featuring football, basketball, athletics, and more. Trophies for winning teams.',
 'Show your sports spirit and compete for glory',
 'sports',
 '2024-03-20 08:00:00',
 '2024-03-20 18:00:00',
 'Sports Ground, Main Campus',
 1000,
 'Sports',
 TRUE),

('Tech Innovation Seminar: AI in Business', 
 'Learn about AI applications in modern business from industry experts. Hands-on workshop included.',
 'Explore the future of AI in business applications',
 'seminar',
 '2024-03-25 14:00:00',
 '2024-03-25 16:00:00',
 'Seminar Room A, CBD Campus',
 100,
 'Technology',
 TRUE)
ON CONFLICT DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user_event ON registrations(user_id, event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_ticket ON registrations(ticket_number);