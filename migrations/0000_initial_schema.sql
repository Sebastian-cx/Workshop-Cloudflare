-- Initial Migration for OSINT Workshop Registration Platform

-- 1. Workshop Settings Table
CREATE TABLE IF NOT EXISTS workshop_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  type TEXT DEFAULT 'string',
  category TEXT DEFAULT 'general',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Registration Form Fields Configuration Table
CREATE TABLE IF NOT EXISTS field_configs (
  field_name TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  placeholder TEXT DEFAULT '',
  enabled INTEGER NOT NULL DEFAULT 1,
  required INTEGER NOT NULL DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  field_type TEXT DEFAULT 'text',
  options TEXT DEFAULT '',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Registrations Table
CREATE TABLE IF NOT EXISTS registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  registration_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  college TEXT DEFAULT '',
  department TEXT DEFAULT '',
  year_of_study TEXT DEFAULT '',
  technical_experience TEXT DEFAULT '',
  reason TEXT DEFAULT '',
  status TEXT DEFAULT 'confirmed',
  ip_address TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Default Workshop Settings
INSERT OR IGNORE INTO workshop_settings (key, value, type, category) VALUES
  ('workshop_name', 'OSINT Workshop 2026: Advanced Threat & Recon Masterclass', 'string', 'info'),
  ('description', 'Explore the world of Open Source Intelligence (OSINT) and learn how to discover, analyze, and verify publicly available information like a elite cybersecurity investigator.', 'string', 'info'),
  ('date', '2026-10-15', 'string', 'info'),
  ('time', '10:00 AM - 04:00 PM EST', 'string', 'info'),
  ('venue', 'Cyber Lab 404 & Virtual Stream (Hybrid)', 'string', 'info'),
  ('organizer', 'Department of Cybersecurity & OSINT Society', 'string', 'info'),
  ('registration_fee', 'Free', 'string', 'info'),
  ('registration_deadline', '2026-10-14T23:59', 'string', 'info'),
  ('max_participants', '150', 'number', 'info'),
  ('contact_info', 'osint-workshop@university.edu | +1 (555) 019-2831', 'string', 'info'),
  ('workshop_banner', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop', 'string', 'info'),
  ('registration_open', 'true', 'boolean', 'control'),

  -- Information Display Toggles
  ('toggle_workshop_name', 'true', 'boolean', 'toggles'),
  ('toggle_description', 'true', 'boolean', 'toggles'),
  ('toggle_date', 'true', 'boolean', 'toggles'),
  ('toggle_time', 'true', 'boolean', 'toggles'),
  ('toggle_venue', 'true', 'boolean', 'toggles'),
  ('toggle_organizer', 'true', 'boolean', 'toggles'),
  ('toggle_registration_fee', 'true', 'boolean', 'toggles'),
  ('toggle_registration_deadline', 'true', 'boolean', 'toggles'),
  ('toggle_max_participants', 'true', 'boolean', 'toggles'),
  ('toggle_workshop_banner', 'true', 'boolean', 'toggles'),
  ('toggle_contact_info', 'true', 'boolean', 'toggles');

-- Seed Default Registration Field Configurations
INSERT OR IGNORE INTO field_configs (field_name, label, placeholder, enabled, required, order_index, field_type, options) VALUES
  ('full_name', 'Full Name', 'e.g. Alex Mercer', 1, 1, 1, 'text', ''),
  ('email', 'Email Address', 'e.g. alex.m@cybersec.org', 1, 1, 2, 'email', ''),
  ('phone', 'Phone Number', 'e.g. +1 (555) 019-2834', 1, 0, 3, 'tel', ''),
  ('college', 'College / Institution', 'e.g. Cyber Tech Institute', 1, 1, 4, 'text', ''),
  ('department', 'Department', 'e.g. Computer Science & Engineering', 1, 0, 5, 'text', ''),
  ('year_of_study', 'Year of Study', 'Select Year of Study', 1, 0, 6, 'select', '["1st Year (Freshman)","2nd Year (Sophomore)","3rd Year (Junior)","4th Year (Senior)","Postgraduate / Masters","Faculty / Professional"]'),
  ('technical_experience', 'Technical Experience Level', 'Select your experience level', 1, 0, 7, 'select', '["Beginner (No prior OSINT experience)","Intermediate (Basic search techniques)","Advanced (Used Maltego, Shodan, Recon-ng)","Professional / Researcher"]'),
  ('reason', 'Reason for Attending', 'Briefly describe your interest in OSINT investigations...', 1, 0, 8, 'textarea', '');
