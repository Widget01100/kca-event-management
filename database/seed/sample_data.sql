-- Sample Events for KCA University
-- These match the hardcoded mock data in backend/app.js

INSERT INTO events (id, title, description, date, time, venue, category, capacity, registered, organizer, image_url, status) VALUES
('KCA-CF-2024-001', 'KCA Career Fair 2024', 'Annual career fair connecting KCA University students with top employers from technology, finance, and business sectors. Features resume reviews, mock interviews, and networking sessions.', '2024-03-15', '09:00 AM - 05:00 PM', 'Main Campus Auditorium', 'Career', 500, 342, 'KCA Career Services', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87', 'active'),
('KCA-SD-2024-0001', 'Annual Sports Day', 'University-wide sports competitions featuring football, basketball, athletics, and more. All departments compete for the championship trophy.', '2024-03-20', '08:00 AM - 06:00 PM', 'University Sports Ground', 'Sports', 1000, 678, 'KCA Sports Department', 'https://images.unsplash.com/photo-1546519638-68e109498ffc', 'active'),
('KCA-TS-2024-0001', 'Tech Innovation Seminar', 'Exploring latest trends in technology, AI, and digital transformation. Featuring guest speakers from the tech industry.', '2024-03-25', '02:00 PM - 05:00 PM', 'Tech Building Room 101', 'Technology', 200, 189, 'KCA Computer Science Dept', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', 'active');

-- Sample users for testing
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('student@students.kca.ac.ke', '', 'John', 'Student', 'student'),
('staff@staff.kca.ac.ke', '', 'Jane', 'Staff', 'staff'),
('admin@kca.ac.ke', '', 'Admin', 'User', 'admin');
