-- ============================================================================
-- College Attendance Management System (CAMS)
-- Production PostgreSQL Database Schema & Row-Level Security (RLS) Policies
-- Suitable for Supabase / PostgreSQL 14+
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Drop Existing Tables (if re-running in development environment)
-- DROP TABLE IF EXISTS audit_logs CASCADE;
-- DROP TABLE IF EXISTS notifications CASCADE;
-- DROP TABLE IF EXISTS attendance_correction_requests CASCADE;
-- DROP TABLE IF EXISTS attendance_records CASCADE;
-- DROP TABLE IF EXISTS attendance_sessions CASCADE;
-- DROP TABLE IF EXISTS enrollments CASCADE;
-- DROP TABLE IF EXISTS subject_assignments CASCADE;
-- DROP TABLE IF EXISTS class_sections CASCADE;
-- DROP TABLE IF EXISTS subjects CASCADE;
-- DROP TABLE IF EXISTS faculty CASCADE;
-- DROP TABLE IF EXISTS students CASCADE;
-- DROP TABLE IF EXISTS semesters CASCADE;
-- DROP TABLE IF EXISTS academic_years CASCADE;
-- DROP TABLE IF EXISTS departments CASCADE;
-- DROP TABLE IF EXISTS holidays CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================================================
-- 3. Schema Definitions
-- ============================================================================

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'faculty', 'student')),
    avatar_url TEXT,
    account_status TEXT NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'pending')),
    department_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- DEPARTMENTS
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_code TEXT UNIQUE NOT NULL,
    department_name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraint to profiles for department
ALTER TABLE profiles 
ADD CONSTRAINT fk_profiles_department 
FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL;

-- ACADEMIC YEARS
CREATE TABLE IF NOT EXISTS academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL, -- e.g. "2024-2025"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEMESTERS
CREATE TABLE IF NOT EXISTS semesters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    semester_number INTEGER NOT NULL CHECK (semester_number BETWEEN 1 AND 8),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (academic_year_id, semester_number)
);

-- CLASS SECTIONS
CREATE TABLE IF NOT EXISTS class_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE RESTRICT,
    semester_id UUID NOT NULL REFERENCES semesters(id) ON DELETE RESTRICT,
    section_name TEXT NOT NULL, -- e.g. "Sem V-A"
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (department_id, semester_id, section_name)
);

-- SUBJECTS
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_code TEXT UNIQUE NOT NULL, -- e.g. "CS-501"
    subject_name TEXT NOT NULL, -- e.g. "Operating Systems"
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    semester_id UUID NOT NULL REFERENCES semesters(id) ON DELETE RESTRICT,
    credits INTEGER DEFAULT 3 CHECK (credits > 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FACULTY
CREATE TABLE IF NOT EXISTS faculty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    faculty_code TEXT UNIQUE NOT NULL, -- e.g. "FAC-CS-01"
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    designation TEXT NOT NULL, -- e.g. "Associate Professor"
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- STUDENTS
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    enrollment_number TEXT UNIQUE NOT NULL, -- e.g. "21CS001"
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE RESTRICT,
    semester_id UUID NOT NULL REFERENCES semesters(id) ON DELETE RESTRICT,
    section TEXT NOT NULL, -- e.g. "V-A"
    admission_year INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'graduated', 'suspended')),
    guardian_name TEXT,
    guardian_phone TEXT,
    guardian_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SUBJECT ASSIGNMENTS (Faculty assigned to Class Section & Subject)
CREATE TABLE IF NOT EXISTS subject_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID NOT NULL REFERENCES faculty(id) ON DELETE RESTRICT,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE RESTRICT,
    class_section_id UUID NOT NULL REFERENCES class_sections(id) ON DELETE RESTRICT,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE RESTRICT,
    room_number TEXT,
    time_slot TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (faculty_id, subject_id, class_section_id, academic_year_id)
);

-- ENROLLMENTS (Students enrolled in Class Section)
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_section_id UUID NOT NULL REFERENCES class_sections(id) ON DELETE RESTRICT,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE RESTRICT,
    enrollment_status TEXT NOT NULL DEFAULT 'enrolled' CHECK (enrollment_status IN ('enrolled', 'withdrawn', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (student_id, class_section_id, academic_year_id)
);

-- ATTENDANCE SESSIONS
CREATE TABLE IF NOT EXISTS attendance_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_assignment_id UUID NOT NULL REFERENCES subject_assignments(id) ON DELETE RESTRICT,
    attendance_date DATE NOT NULL,
    session_number INTEGER NOT NULL CHECK (session_number > 0),
    start_time TIME,
    end_time TIME,
    created_by UUID NOT NULL REFERENCES profiles(id),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'locked')),
    submitted_at TIMESTAMPTZ,
    hash_signature TEXT, -- Cryptographic integrity seal
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (subject_assignment_id, attendance_date, session_number)
);

-- ATTENDANCE RECORDS (Normalized individual student attendances per session)
CREATE TABLE IF NOT EXISTS attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attendance_session_id UUID NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    attendance_status TEXT NOT NULL CHECK (attendance_status IN ('present', 'absent', 'late', 'excused')),
    marked_by UUID NOT NULL REFERENCES profiles(id),
    marked_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (attendance_session_id, student_id)
);

-- HOLIDAYS
CREATE TABLE IF NOT EXISTS holidays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    holiday_date DATE UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ATTENDANCE CORRECTION REQUESTS
CREATE TABLE IF NOT EXISTS attendance_correction_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attendance_record_id UUID NOT NULL REFERENCES attendance_records(id) ON DELETE CASCADE,
    requested_by UUID NOT NULL REFERENCES profiles(id),
    requested_status TEXT NOT NULL CHECK (requested_status IN ('present', 'absent', 'late', 'excused')),
    reason TEXT NOT NULL,
    request_status TEXT NOT NULL DEFAULT 'pending' CHECK (request_status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ,
    review_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT NOT NULL CHECK (notification_type IN ('alert', 'session', 'correction', 'system', 'report')),
    action_url TEXT,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AUDIT LOGS (Immutable historical ledger of administrative and attendance modifications)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_profile_id UUID NOT NULL REFERENCES profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SYSTEM SETTINGS
CREATE TABLE IF NOT EXISTS system_settings (
    id TEXT PRIMARY KEY DEFAULT 'current_settings',
    attendance_threshold_percentage NUMERIC NOT NULL DEFAULT 75.0,
    critical_threshold_percentage NUMERIC NOT NULL DEFAULT 65.0,
    late_counts_as_attended BOOLEAN NOT NULL DEFAULT true,
    allow_student_correction_requests BOOLEAN NOT NULL DEFAULT true,
    institution_name TEXT NOT NULL DEFAULT 'Jawahar Education Society''s Institute of Technology, Management & Research, Nashik',
    semester_code TEXT NOT NULL DEFAULT 'Fall 2024',
    biometric_sync_enabled BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. High-Performance Indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_students_enrollment ON students(enrollment_number);
CREATE INDEX IF NOT EXISTS idx_students_dept ON students(department_id, semester_id);
CREATE INDEX IF NOT EXISTS idx_attendance_sessions_date ON attendance_sessions(attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_sessions_assign ON attendance_sessions(subject_assignment_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_session ON attendance_records(attendance_session_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_student ON attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_profile_id, read_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_profile_id, created_at DESC);

-- ============================================================================
-- 5. Row-Level Security (RLS) Configuration
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_correction_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Helper security functions
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- --- PROFILES POLICIES ---
CREATE POLICY "Public profiles are viewable by authenticated users" 
ON profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE TO authenticated 
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND 
  role = (SELECT role FROM profiles WHERE id = auth.uid()) -- Cannot self-promote
);

CREATE POLICY "Admins have full control over profiles" 
ON profiles FOR ALL TO authenticated 
USING (is_admin());

-- --- ACADEMIC STRUCTURE (Departments, Subjects, Sections) ---
CREATE POLICY "Academic structure readable by all authenticated users"
ON departments FOR SELECT TO authenticated USING (true);

CREATE POLICY "Academic structure managed by admin"
ON departments FOR ALL TO authenticated USING (is_admin());

CREATE POLICY "Subjects readable by all authenticated users"
ON subjects FOR SELECT TO authenticated USING (true);

CREATE POLICY "Subjects managed by admin"
ON subjects FOR ALL TO authenticated USING (is_admin());

CREATE POLICY "Sections readable by all authenticated users"
ON class_sections FOR SELECT TO authenticated USING (true);

CREATE POLICY "Sections managed by admin"
ON class_sections FOR ALL TO authenticated USING (is_admin());

-- --- FACULTY POLICIES ---
CREATE POLICY "Faculty records viewable by all authenticated users"
ON faculty FOR SELECT TO authenticated USING (true);

CREATE POLICY "Faculty managed by admin"
ON faculty FOR ALL TO authenticated USING (is_admin());

-- --- STUDENTS POLICIES ---
CREATE POLICY "Students directory readable by faculty and admin"
ON students FOR SELECT TO authenticated 
USING (
  is_admin() OR 
  get_current_user_role() = 'faculty' OR 
  profile_id = auth.uid()
);

CREATE POLICY "Students managed by admin"
ON students FOR ALL TO authenticated USING (is_admin());

-- --- ATTENDANCE SESSIONS POLICIES ---
CREATE POLICY "Attendance sessions viewable by faculty, admin, or enrolled students"
ON attendance_sessions FOR SELECT TO authenticated
USING (
  is_admin() OR
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM subject_assignments sa
    JOIN faculty f ON sa.faculty_id = f.id
    WHERE sa.id = attendance_sessions.subject_assignment_id AND f.profile_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM subject_assignments sa
    JOIN enrollments e ON e.class_section_id = sa.class_section_id
    JOIN students s ON e.student_id = s.id
    WHERE sa.id = attendance_sessions.subject_assignment_id AND s.profile_id = auth.uid()
  )
);

CREATE POLICY "Faculty can insert attendance sessions for assigned classes"
ON attendance_sessions FOR INSERT TO authenticated
WITH CHECK (
  is_admin() OR
  EXISTS (
    SELECT 1 FROM subject_assignments sa
    JOIN faculty f ON sa.faculty_id = f.id
    WHERE sa.id = subject_assignment_id AND f.profile_id = auth.uid()
  )
);

CREATE POLICY "Faculty can update their own unsubmitted sessions"
ON attendance_sessions FOR UPDATE TO authenticated
USING (
  is_admin() OR
  (created_by = auth.uid() AND status != 'locked')
);

-- --- ATTENDANCE RECORDS POLICIES ---
CREATE POLICY "Attendance records viewable by admin, marking faculty, or student owner"
ON attendance_records FOR SELECT TO authenticated
USING (
  is_admin() OR
  marked_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM students s
    WHERE s.id = attendance_records.student_id AND s.profile_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM attendance_sessions ses
    JOIN subject_assignments sa ON ses.subject_assignment_id = sa.id
    JOIN faculty f ON sa.faculty_id = f.id
    WHERE ses.id = attendance_records.attendance_session_id AND f.profile_id = auth.uid()
  )
);

CREATE POLICY "Faculty can mark attendance records for authorized sessions"
ON attendance_records FOR INSERT TO authenticated
WITH CHECK (
  is_admin() OR
  EXISTS (
    SELECT 1 FROM attendance_sessions ses
    JOIN subject_assignments sa ON ses.subject_assignment_id = sa.id
    JOIN faculty f ON sa.faculty_id = f.id
    WHERE ses.id = attendance_session_id AND f.profile_id = auth.uid()
  )
);

CREATE POLICY "Records can be updated by admin or authorized faculty before locking"
ON attendance_records FOR UPDATE TO authenticated
USING (
  is_admin() OR
  (
    EXISTS (
      SELECT 1 FROM attendance_sessions ses
      JOIN subject_assignments sa ON ses.subject_assignment_id = sa.id
      JOIN faculty f ON sa.faculty_id = f.id
      WHERE ses.id = attendance_records.attendance_session_id 
        AND f.profile_id = auth.uid()
        AND ses.status != 'locked'
    )
  )
);

-- Prevent unauthorized student deletion of attendance records
CREATE POLICY "Only admin can delete attendance records"
ON attendance_records FOR DELETE TO authenticated
USING (is_admin());

-- --- NOTIFICATIONS POLICIES ---
CREATE POLICY "Users can view and manage their own notifications"
ON notifications FOR ALL TO authenticated
USING (recipient_profile_id = auth.uid())
WITH CHECK (recipient_profile_id = auth.uid());

-- --- AUDIT LOGS POLICIES ---
CREATE POLICY "Audit logs viewable only by admins"
ON audit_logs FOR SELECT TO authenticated
USING (is_admin());

CREATE POLICY "Audit logs insertable by system or users"
ON audit_logs FOR INSERT TO authenticated
WITH CHECK (actor_profile_id = auth.uid());

-- --- SETTINGS ---
CREATE POLICY "Settings viewable by all authenticated users"
ON system_settings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Settings manageable by admin"
ON system_settings FOR ALL TO authenticated USING (is_admin());
