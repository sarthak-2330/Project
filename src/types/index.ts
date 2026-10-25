/**
 * College Attendance Management System (CAMS)
 * Core Domain & Database Types
 */

export type UserRole = 'admin' | 'faculty' | 'student';
export type AccountStatus = 'active' | 'suspended' | 'pending';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';
export type CorrectionRequestStatus = 'pending' | 'approved' | 'rejected';
export type NotificationType = 'alert' | 'session' | 'correction' | 'system' | 'report';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  account_status: AccountStatus;
  department_id?: string;
  password?: string;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  department_code: string;
  department_name: string;
  description?: string;
  created_at: string;
}

export interface AcademicYear {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface Semester {
  id: string;
  academic_year_id: string;
  semester_number: number;
  start_date: string;
  end_date: string;
}

export interface ClassSection {
  id: string;
  department_id: string;
  academic_year_id: string;
  semester_id: string;
  section_name: string; // e.g. "Sem V-A", "Sem V-B"
}

export interface Subject {
  id: string;
  subject_code: string; // e.g. "CS-501"
  subject_name: string; // e.g. "Operating Systems"
  department_id: string;
  semester_id: string;
  credits?: number;
  room_default?: string;
  created_at?: string;
}

export interface Faculty {
  id: string;
  profile_id: string;
  faculty_code: string; // e.g. "FAC-CS-04"
  department_id: string;
  designation: string; // e.g. "Associate Professor & Head of Labs"
  status: 'active' | 'on_leave' | 'inactive';
  profile?: Profile;
  department?: Department;
}

export interface SubjectAssignment {
  id: string;
  faculty_id: string;
  subject_id: string;
  class_section_id: string;
  academic_year_id: string;
  room_number?: string;
  time_slot?: string;
  subject?: Subject;
  class_section?: ClassSection;
  faculty?: Faculty;
}

export interface Student {
  id: string;
  profile_id: string;
  enrollment_number: string; // e.g. "21CS001"
  department_id: string;
  academic_year_id: string;
  semester_id: string;
  section: string; // e.g. "V-A"
  admission_year: number;
  status: 'active' | 'graduated' | 'suspended';
  guardian_name?: string;
  guardian_phone?: string;
  guardian_email?: string;
  created_at?: string;
  profile?: Profile;
  department?: Department;
}

export interface Enrollment {
  id: string;
  student_id: string;
  class_section_id: string;
  academic_year_id: string;
  enrollment_status: 'enrolled' | 'withdrawn' | 'completed';
}

export interface AttendanceSession {
  id: string;
  subject_assignment_id: string;
  attendance_date: string; // YYYY-MM-DD
  session_number: number;
  start_time?: string;
  end_time?: string;
  created_by: string; // faculty profile id
  status: 'draft' | 'submitted' | 'locked';
  submitted_at?: string;
  hash_signature?: string; // SHA-256 integrity seal
  created_at: string;
  // Joins
  subject_assignment?: SubjectAssignment;
  records_count?: {
    total: number;
    present: number;
    absent: number;
    late: number;
  };
}

export interface AttendanceRecord {
  id: string;
  attendance_session_id: string;
  student_id: string;
  attendance_status: AttendanceStatus;
  marked_by: string;
  marked_at: string;
  updated_at?: string;
  // Joins
  student?: Student;
}

export interface Holiday {
  id: string;
  holiday_date: string;
  title: string;
  description?: string;
}

export interface AttendanceCorrectionRequest {
  id: string;
  attendance_record_id: string;
  requested_by: string; // profile_id (student or faculty)
  requested_status: AttendanceStatus;
  reason: string;
  request_status: CorrectionRequestStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  review_note?: string;
  created_at: string;
  // Virtual
  student_name?: string;
  subject_name?: string;
  attendance_date?: string;
  previous_status?: AttendanceStatus;
}

export interface AppNotification {
  id: string;
  recipient_profile_id: string;
  title: string;
  message: string;
  notification_type: NotificationType;
  read_at?: string;
  created_at: string;
  action_url?: string;
}

export interface AuditLog {
  id: string;
  actor_profile_id: string;
  actor_name?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface SystemSettings {
  attendance_threshold_percentage: number; // default: 75.0
  critical_threshold_percentage: number; // default: 65.0
  late_counts_as_attended: boolean; // default: true
  allow_student_correction_requests: boolean;
  institution_name: string;
  semester_code: string;
  biometric_sync_enabled: boolean;
}

/**
 * Calculated Metrics Types
 */
export interface StudentAttendanceSummary {
  student: Student;
  total_eligible_sessions: number;
  present_sessions: number;
  absent_sessions: number;
  late_sessions: number;
  attended_sessions: number; // present + (late if configured)
  attendance_percentage: number | null; // null if 0 sessions (N/A)
  tier: 'safe' | 'warning' | 'critical';
  lectures_deficit: number; // lectures needed to hit 75%
  consecutive_classes_needed: number;
  subject_breakdowns: {
    subject_id: string;
    subject_code: string;
    subject_name: string;
    eligible: number;
    attended: number;
    percentage: number;
    tier: 'safe' | 'warning' | 'critical';
  }[];
}

export interface ClassAttendanceSummary {
  class_section_id: string;
  section_name: string;
  subject_id: string;
  subject_code: string;
  subject_name: string;
  total_students: number;
  avg_attendance_percentage: number;
  defaulters_count: number;
}

/**
 * DSA Demonstration Models (Mini-Project)
 */
export interface DsaNode<T> {
  value: T;
  next?: DsaNode<T> | null;
  prev?: DsaNode<T> | null;
}

export interface DsaExecutionStep {
  step: number;
  description: string;
  stateSnapshot?: any;
  comparisonsCount?: number;
  swapsCount?: number;
}
