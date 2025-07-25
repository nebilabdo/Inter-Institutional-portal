-- Database schema for Inter-Institutional Data Exchange Portal
-- This script creates the necessary tables and initial data

-- Create database (if using PostgreSQL)
-- CREATE DATABASE data_exchange_portal;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'consumer', 'provider')),
    institution_id UUID REFERENCES institutions(id),
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Institutions table
CREATE TABLE IF NOT EXISTS institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    focal_person_name VARCHAR(255) NOT NULL,
    focal_person_email VARCHAR(255) NOT NULL,
    focal_person_phone VARCHAR(50),
    organization_type VARCHAR(20) NOT NULL CHECK (organization_type IN ('consumer', 'provider', 'both')),
    address TEXT NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- API Requests table
CREATE TABLE IF NOT EXISTS api_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    purpose TEXT NOT NULL,
    response_format VARCHAR(50) NOT NULL,
    attributes JSONB NOT NULL,
    deadline TIMESTAMP,
    attachments JSONB,
    consumer_id UUID NOT NULL REFERENCES institutions(id),
    provider_id UUID NOT NULL REFERENCES institutions(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'in_progress', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- API Responses table
CREATE TABLE IF NOT EXISTS api_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES api_requests(id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('approved', 'rejected', 'pending')),
    documentation TEXT,
    endpoint_url VARCHAR(500),
    authentication_info TEXT,
    response_deadline TIMESTAMP,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'in_app', 'both')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('request_update', 'approval', 'rejection', 'new_request', 'system')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_institutions_status ON institutions(status);
CREATE INDEX IF NOT EXISTS idx_institutions_type ON institutions(organization_type);
CREATE INDEX IF NOT EXISTS idx_api_requests_consumer ON api_requests(consumer_id);
CREATE INDEX IF NOT EXISTS idx_api_requests_provider ON api_requests(provider_id);
CREATE INDEX IF NOT EXISTS idx_api_requests_status ON api_requests(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- Insert sample admin user
INSERT INTO users (email, password_hash, role, is_active) VALUES 
('admin@dataexchange.portal', '$2b$10$example_hash', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample institutions
INSERT INTO institutions (name, focal_person_name, focal_person_email, focal_person_phone, organization_type, address, description, status) VALUES 
('Tech University', 'Dr. Sarah Johnson', 'sarah.j@techuni.edu', '+1-555-0123', 'consumer', '123 University Ave, Tech City, TC 12345', 'Leading technology university', 'approved'),
('Research Institute', 'Prof. Michael Chen', 'm.chen@research.org', '+1-555-0124', 'provider', '456 Research Blvd, Science City, SC 67890', 'Advanced research institute', 'approved'),
('Data Analytics Corp', 'Ms. Emily Davis', 'e.davis@dataanalytics.com', '+1-555-0125', 'both', '789 Analytics St, Data City, DC 54321', 'Data analytics and consulting', 'pending')
ON CONFLICT DO NOTHING;

-- Insert sample API request
INSERT INTO api_requests (title, description, purpose, response_format, attributes, consumer_id, provider_id, status) VALUES 
('Student Enrollment Data API', 'Request for real-time student enrollment data including course registrations and academic status', 'Integration with student information system for better resource planning', 'JSON', '["student_id", "enrollment_date", "course_code", "academic_status"]', 
(SELECT id FROM institutions WHERE name = 'Tech University'), 
(SELECT id FROM institutions WHERE name = 'Research Institute'), 
'pending')
ON CONFLICT DO NOTHING;
