/**
 * Realistic Development Seed Data for CAMS
 * Fully aligned with Google Stitch UI reference
 */

import {
  Profile,
  Department,
  AcademicYear,
  Semester,
  ClassSection,
  Subject,
  Faculty,
  SubjectAssignment,
  Student,
  Enrollment,
  AttendanceSession,
  AttendanceRecord,
  AppNotification,
  AttendanceCorrectionRequest,
  AuditLog,
  SystemSettings
} from '../types';

export const INITIAL_SETTINGS: SystemSettings = {
  attendance_threshold_percentage: 75.0,
  critical_threshold_percentage: 65.0,
  late_counts_as_attended: true,
  allow_student_correction_requests: true,
  institution_name: 'St. Xavier Institute of Engineering & Technology',
  semester_code: 'Fall 2024 • W9',
  biometric_sync_enabled: true,
};

export const SEED_PROFILES: Profile[] = [
  {
    id: 'prof-rajesh-sharma',
    full_name: 'Prof. Rajesh Sharma',
    email: 'rajesh.sharma@cams.edu',
    role: 'faculty',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz8wCLivRMELqxCHBD2MwkO71qq6imAsdk-f23nriYY0iod6XhtEQTfbPv05UqzPIOwYoyzrCQcA-cdqltZaS9qUJMoNcOzUpwMVlIgqvNwTBWY1_-InVatb4XppHOkn3ZLNhcYQhNYge6hp-fgfV3EPJytoECXlmOqYWk67_PZWMd-9ClSofJjV7lKj9v849v1H0wV8KbUjtq4LP2hfXrVZ-NiAo9ZXKn6-p5VgEluAL4kJSNImaj',
    account_status: 'active',
    department_id: 'dept-cse',
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-10-24T08:00:00Z'
  },
  {
    id: 'admin-dean-thorne',
    full_name: 'Dr. Aris Thorne (Dean of Academics)',
    email: 'dean.academics@cams.edu',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    account_status: 'active',
    department_id: 'dept-cse',
    created_at: '2023-08-01T08:00:00Z',
    updated_at: '2024-10-24T08:00:00Z'
  },
  {
    id: 'prof-priya-rao',
    full_name: 'Dr. Priya Rao',
    email: 'priya.rao@cams.edu',
    role: 'faculty',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    account_status: 'active',
    department_id: 'dept-cse',
    created_at: '2024-02-15T08:00:00Z',
    updated_at: '2024-10-24T08:00:00Z'
  },
  {
    id: 'prof-vikram-seth',
    full_name: 'Prof. Vikram Seth',
    email: 'vikram.seth@cams.edu',
    role: 'faculty',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    account_status: 'active',
    department_id: 'dept-ece',
    created_at: '2024-02-15T08:00:00Z',
    updated_at: '2024-10-24T08:00:00Z'
  },
  // Key Students from Stitch
  {
    id: 'student-aarav-patel',
    full_name: 'Aarav Patel',
    email: 'aarav.patel@student.cams.edu',
    role: 'student',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKlUstlRJ3ugWMvrljlO7OADSTgmpiiLDGHplz--2VrbZPEB-Fg-v5JkfzMmzEr1V-zfsZFb-_NyT1yURh9a2GZ6zFGGPcZSs_HwYyYUO-QPrYooh6Af71VlVj90sdQDAaDed2hM-2DTQq2ctCOFqsy2ii8yQpQi6Q_ymSaeCFeMU8zBN4cLX21kdMt_tJdUX7JeA1B50hxwOTJHjeUihnpo__1CrXMyX1nIk-BAr2NVK9cmF_PMmC',
    account_status: 'active',
    department_id: 'dept-cse',
    created_at: '2024-08-01T08:00:00Z',
    updated_at: '2024-10-24T08:00:00Z'
  },
  {
    id: 'student-ananya-sharma',
    full_name: 'Ananya Sharma',
    email: 'ananya.sharma@student.cams.edu',
    role: 'student',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQs0mR45qh10XNQAW7crO3ST4AnycVlN3MfdotgwrK2xnvcjeU_n7iZ29AliiRndom1GIxq8mp4egLkvUGPLWwKKYWp5JcVTF-Rh-uuMDsUSEFAf1jwqS23MMhlgeiqR1ntOJBIMElCbSi8xhtbZ1Cf4Wkxf2kCbk84dEZvi1rV7M2cf-Stle8AOWdld0KA9iW9OZBhfi2gt21UZMEhQ3khykMXbWBGkLeK9624d7ZJgqPDv56yyFa',
    account_status: 'active',
    department_id: 'dept-cse',
    created_at: '2024-08-01T08:00:00Z',
    updated_at: '2024-10-24T08:00:00Z'
  },
  {
    id: 'student-devendra-singh',
    full_name: 'Devendra Singh',
    email: 'devendra.singh@student.cams.edu',
    role: 'student',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7N_8lhBj1_RNcJ9-wcZ48xTKm6VHGR9xGr0c8cZxa5O5BiOFmbs69z1mJVLIJfsmQvAy1gvdOxtSykzEKaqRMZ23krBqoGqsAs6a8AefQOMA6-183yjddeyzcqMr9Kv0YEVO4HZmPTrnl1GZjG_TFsexRoNIk5lKov3J_piqD_LHYTJhu7cqByMyMYABaLm223Tph3YVOUzJBO9mEreOhxlJK2_mdtx_BCqAiGfkPB18mJFGiQAcP',
    account_status: 'active',
    department_id: 'dept-cse',
    created_at: '2024-08-01T08:00:00Z',
    updated_at: '2024-10-24T08:00:00Z'
  },
  {
    id: 'student-ishaan-verma',
    full_name: 'Ishaan Verma',
    email: 'ishaan.verma@student.cams.edu',
    role: 'student',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMcEfandqEk7im4XnNhpZQDLE8Z0fTLgy2kbtZMw5IeBxtbIUK5l8-uusvdz_20rPP98yMHhJubmM-ApXABrbDkJIPsSiMzwvdq9K_oeGYbrb6PhFEQBTEmghpKTAIpijmaig569pWSOe9Rq28jjB2ylggkYw8CbCT2grPENx8SC6McGv3ZsE-gVtt5L_TV-taK6Tnx2ZJhqTjqh3R8MlmN2oZXfHElHblYGOHi9--hqIjypm1JO1e',
    account_status: 'active',
    department_id: 'dept-cse',
    created_at: '2024-08-01T08:00:00Z',
    updated_at: '2024-10-24T08:00:00Z'
  },
  {
    id: 'student-kavya-nair',
    full_name: 'Kavya Nair',
    email: 'kavya.nair@student.cams.edu',
    role: 'student',
    account_status: 'active',
    department_id: 'dept-cse',
    created_at: '2024-08-01T08:00:00Z',
    updated_at: '2024-10-24T08:00:00Z'
  },
  {
    id: 'student-meera-krishnan',
    full_name: 'Meera Krishnan',
    email: 'meera.krishnan@student.cams.edu',
    role: 'student',
    account_status: 'active',
    department_id: 'dept-cse',
    created_at: '2024-08-01T08:00:00Z',
    updated_at: '2024-10-24T08:00:00Z'
  },
  {
    id: 'student-pooja-hegde',
    full_name: 'Pooja Hegde',
    email: 'pooja.hegde@student.cams.edu',
    role: 'student',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAtvYFnrIP_y3GEUTV9G6uGL39LZ5Pe4NBsdrhO4vB1Z_ZDE6Cgj7QkRhb_wmCkkwzg0tx2tKFIYxlKpxQHpRLWZeoXhyyH2b6YnLvKHvNcAAyycgUUliJhrlodjSySr2OM7E_ZEnCd_U77KB0BO2doKQ1SyKt-jfvPFo_4GA2ooe5uhs6nvOeoFI0j_wXTaIj_ACz3XTW0PzCGKXqOB4QP6C02mb2PYthKC7AbC4OmLXEDxZoEuqs',
    account_status: 'active',
    department_id: 'dept-cse',
    created_at: '2024-08-01T08:00:00Z',
    updated_at: '2024-10-24T08:00:00Z'
  },
  {
    id: 'student-rohan-kulkarni',
    full_name: 'Rohan Kulkarni',
    email: 'rohan.kulkarni@student.cams.edu',
    role: 'student',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiJlF_sRiryeargwrxdA8hZMaYEOPieNaEJ63tF7DDVexqHJg7dvHrtro9PzOtentD5loXDjucgZ7penaVQ-TEBuXBeLgFbkmhdWYVmUCGbTrMokc6Ia6DnyzVOvyRHgPCNnAJHwWU4S93qhLYCEcMBVJ6hHtPJjnFc4asNlYpJ2tgdTDPPfNcLXDQr4ujr20FrCc07OX1Bw3ndjNXqX5kcO4dGlj6mBqGjDXrKmDbvMtE2HYF0_FI',
    account_status: 'active',
    department_id: 'dept-me',
    created_at: '2024-08-01T08:00:00Z',
    updated_at: '2024-10-24T08:00:00Z'
  }
];

export const SEED_DEPARTMENTS: Department[] = [
  {
    id: 'dept-cse',
    department_code: 'CSE',
    department_name: 'Dept. of Computer Science & Engg.',
    description: 'Undergraduate and postgraduate computing & artificial intelligence programs.',
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 'dept-ece',
    department_code: 'ECE',
    department_name: 'Dept. of Electronics & Communication',
    description: 'Embedded systems, telecommunications, and VLSI microelectronics.',
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 'dept-me',
    department_code: 'ME',
    department_name: 'Dept. of Mechanical Engineering',
    description: 'Thermodynamics, robotics, and advanced manufacturing.',
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 'dept-ce',
    department_code: 'CE',
    department_name: 'Dept. of Civil Engineering',
    description: 'Structural engineering, geodesy, and environmental infrastructure.',
    created_at: '2023-01-01T00:00:00Z'
  }
];

export const SEED_ACADEMIC_YEARS: AcademicYear[] = [
  {
    id: 'ay-2024-25',
    name: 'Academic Cycle 2024–25 (Odd Term)',
    start_date: '2024-08-01',
    end_date: '2024-12-20',
    is_active: true
  }
];

export const SEED_SEMESTERS: Semester[] = [
  {
    id: 'sem-5',
    academic_year_id: 'ay-2024-25',
    semester_number: 5,
    start_date: '2024-08-01',
    end_date: '2024-12-20'
  },
  {
    id: 'sem-7',
    academic_year_id: 'ay-2024-25',
    semester_number: 7,
    start_date: '2024-08-01',
    end_date: '2024-12-20'
  }
];

export const SEED_CLASS_SECTIONS: ClassSection[] = [
  {
    id: 'sec-cse-5a',
    department_id: 'dept-cse',
    academic_year_id: 'ay-2024-25',
    semester_id: 'sem-5',
    section_name: 'Sem V-A'
  },
  {
    id: 'sec-cse-5b',
    department_id: 'dept-cse',
    academic_year_id: 'ay-2024-25',
    semester_id: 'sem-5',
    section_name: 'Sem V-B'
  },
  {
    id: 'sec-cse-7',
    department_id: 'dept-cse',
    academic_year_id: 'ay-2024-25',
    semester_id: 'sem-7',
    section_name: 'Sem VII'
  },
  {
    id: 'sec-me-5b',
    department_id: 'dept-me',
    academic_year_id: 'ay-2024-25',
    semester_id: 'sem-5',
    section_name: 'ME Sem V-B'
  }
];

export const SEED_SUBJECTS: Subject[] = [
  {
    id: 'sub-cs-501',
    subject_code: 'CS-501',
    subject_name: 'Operating Systems',
    department_id: 'dept-cse',
    semester_id: 'sem-5',
    credits: 4,
    room_default: 'LH-302'
  },
  {
    id: 'sub-cs-504',
    subject_code: 'CS-504',
    subject_name: 'Database Management Systems',
    department_id: 'dept-cse',
    semester_id: 'sem-5',
    credits: 4,
    room_default: 'Lab 2B'
  },
  {
    id: 'sub-cs-702',
    subject_code: 'CS-702',
    subject_name: 'Cloud Computing',
    department_id: 'dept-cse',
    semester_id: 'sem-7',
    credits: 3,
    room_default: 'LH-401'
  },
  {
    id: 'sub-cs-502',
    subject_code: 'CS-502',
    subject_name: 'Computer Networks',
    department_id: 'dept-cse',
    semester_id: 'sem-5',
    credits: 4,
    room_default: 'LH-301'
  },
  {
    id: 'sub-cs-503',
    subject_code: 'CS-503',
    subject_name: 'Design & Analysis of Algorithms',
    department_id: 'dept-cse',
    semester_id: 'sem-5',
    credits: 4,
    room_default: 'LH-304'
  }
];

export const SEED_FACULTY: Faculty[] = [
  {
    id: 'fac-rajesh-sharma',
    profile_id: 'prof-rajesh-sharma',
    faculty_code: 'FAC-CS-04',
    department_id: 'dept-cse',
    designation: 'Associate Professor & Senior Lab Mentor',
    status: 'active'
  },
  {
    id: 'fac-priya-rao',
    profile_id: 'prof-priya-rao',
    faculty_code: 'FAC-CS-08',
    department_id: 'dept-cse',
    designation: 'Assistant Professor & Class Counselor',
    status: 'active'
  },
  {
    id: 'fac-vikram-seth',
    profile_id: 'prof-vikram-seth',
    faculty_code: 'FAC-EC-02',
    department_id: 'dept-ece',
    designation: 'Professor',
    status: 'active'
  }
];

export const SEED_SUBJECT_ASSIGNMENTS: SubjectAssignment[] = [
  {
    id: 'assign-cs501-5a',
    faculty_id: 'fac-rajesh-sharma',
    subject_id: 'sub-cs-501',
    class_section_id: 'sec-cse-5a',
    academic_year_id: 'ay-2024-25',
    room_number: 'LH-302',
    time_slot: '09:30 – 10:30 AM'
  },
  {
    id: 'assign-cs504-5b',
    faculty_id: 'fac-rajesh-sharma',
    subject_id: 'sub-cs-504',
    class_section_id: 'sec-cse-5b',
    academic_year_id: 'ay-2024-25',
    room_number: 'Lab 2B',
    time_slot: '11:00 AM – 12:00 PM'
  },
  {
    id: 'assign-cs702-7',
    faculty_id: 'fac-rajesh-sharma',
    subject_id: 'sub-cs-702',
    class_section_id: 'sec-cse-7',
    academic_year_id: 'ay-2024-25',
    room_number: 'LH-401',
    time_slot: '02:00 PM – 03:00 PM'
  },
  {
    id: 'assign-cs502-5a',
    faculty_id: 'fac-priya-rao',
    subject_id: 'sub-cs-502',
    class_section_id: 'sec-cse-5a',
    academic_year_id: 'ay-2024-25',
    room_number: 'LH-301',
    time_slot: '01:00 PM – 02:00 PM'
  }
];

// Helper to generate full cohort of 48 students in CSE Sem V-A matching Google Stitch
export const SEED_STUDENTS: Student[] = [
  {
    id: 'stud-001',
    profile_id: 'student-aarav-patel',
    enrollment_number: '21CS001',
    department_id: 'dept-cse',
    academic_year_id: 'ay-2024-25',
    semester_id: 'sem-5',
    section: 'V-A',
    admission_year: 2021,
    status: 'active',
    guardian_name: 'Dr. Ramesh Patel',
    guardian_phone: '+91 98220 11442',
    guardian_email: 'ramesh.patel@gmail.com'
  },
  {
    id: 'stud-002',
    profile_id: 'student-ananya-sharma',
    enrollment_number: '21CS002',
    department_id: 'dept-cse',
    academic_year_id: 'ay-2024-25',
    semester_id: 'sem-5',
    section: 'V-A',
    admission_year: 2021,
    status: 'active',
    guardian_name: 'Mrs. Sunita Sharma',
    guardian_phone: '+91 98450 67123',
    guardian_email: 'sunita.sharma@yahoo.com'
  },
  {
    id: 'stud-003',
    profile_id: 'student-devendra-singh',
    enrollment_number: '21CS003',
    department_id: 'dept-cse',
    academic_year_id: 'ay-2024-25',
    semester_id: 'sem-5',
    section: 'V-A',
    admission_year: 2021,
    status: 'active',
    guardian_name: 'Mr. Gurpreet Singh',
    guardian_phone: '+91 97112 44901',
    guardian_email: 'gurpreet.singh@gmail.com'
  },
  {
    id: 'stud-004',
    profile_id: 'student-ishaan-verma',
    enrollment_number: '21CS004',
    department_id: 'dept-cse',
    academic_year_id: 'ay-2024-25',
    semester_id: 'sem-5',
    section: 'V-A',
    admission_year: 2021,
    status: 'active',
    guardian_name: 'Mr. Alok Verma',
    guardian_phone: '+91 98711 02931',
    guardian_email: 'alok.verma@corpmail.com'
  },
  {
    id: 'stud-005',
    profile_id: 'student-kavya-nair',
    enrollment_number: '21CS005',
    department_id: 'dept-cse',
    academic_year_id: 'ay-2024-25',
    semester_id: 'sem-5',
    section: 'V-A',
    admission_year: 2021,
    status: 'active',
    guardian_name: 'Mr. S. Nair',
    guardian_phone: '+91 98401 22890'
  },
  {
    id: 'stud-006',
    profile_id: 'student-meera-krishnan',
    enrollment_number: '21CS006',
    department_id: 'dept-cse',
    academic_year_id: 'ay-2024-25',
    semester_id: 'sem-5',
    section: 'V-A',
    admission_year: 2021,
    status: 'active',
    guardian_name: 'Mrs. Radha Krishnan',
    guardian_phone: '+91 98402 33410'
  },
  {
    id: 'stud-007',
    profile_id: 'student-pooja-hegde',
    enrollment_number: '21CS007',
    department_id: 'dept-cse',
    academic_year_id: 'ay-2024-25',
    semester_id: 'sem-5',
    section: 'V-A',
    admission_year: 2021,
    status: 'active',
    guardian_name: 'Mr. M. Hegde',
    guardian_phone: '+91 94480 11928'
  },
  {
    id: 'stud-038',
    profile_id: 'student-rohan-kulkarni',
    enrollment_number: '21ME038',
    department_id: 'dept-me',
    academic_year_id: 'ay-2024-25',
    semester_id: 'sem-5',
    section: 'V-B',
    admission_year: 2021,
    status: 'active',
    guardian_name: 'Mr. S. Kulkarni',
    guardian_phone: '+91 94220 89123',
    guardian_email: 's_kulkarni@gmail.com'
  }
];

// Add synthetic students up to 48 in cohort
const COHORT_NAMES = [
  'Aditya Rao', 'Neha Gupta', 'Siddharth Iyer', 'Rhea Chakraborty', 'Karan Malhotra',
  'Tanvi Joshi', 'Manish Reddy', 'Sneha Deshmukh', 'Arjun Kapoor', 'Priyanka Sen',
  'Rohit Bhat', 'Divya Menon', 'Vivek Murthy', 'Ankita Das', 'Gaurav Dubey',
  'Shreya Chatterjee', 'Varun Gandhi', 'Aishwarya Pillai', 'Nikhil Saxena', 'Kriti Sanon',
  'Abhinav Pandey', 'Bhavna Kothari', 'Chetan Bhagat', 'Deepika Agarwal', 'Eshan Roy',
  'Fatima Sheikh', 'Girish Kulkarni', 'Harshita Gaur', 'Indrajit Paul', 'Jaya Bachchan',
  'Kunal Kamra', 'Lavanya Tripathi', 'Mohit Raina', 'Nandita Das', 'Omkar Joshi',
  'Pallavi Sharda', 'Qasim Ali', 'Rashmika Mandanna', 'Suraj Pancholi', 'Tara Sutaria'
];

COHORT_NAMES.forEach((name, idx) => {
  const rollNum = String(idx + 8).padStart(3, '0');
  const profileId = `student-synth-${rollNum}`;
  SEED_PROFILES.push({
    id: profileId,
    full_name: name,
    email: `${name.toLowerCase().replace(/\s+/g, '.')}.21cs@cams.edu`,
    role: 'student',
    account_status: 'active',
    department_id: 'dept-cse',
    created_at: '2024-08-01T08:00:00Z',
    updated_at: '2024-10-24T08:00:00Z'
  });

  SEED_STUDENTS.push({
    id: `stud-${rollNum}`,
    profile_id: profileId,
    enrollment_number: `21CS${rollNum}`,
    department_id: 'dept-cse',
    academic_year_id: 'ay-2024-25',
    semester_id: 'sem-5',
    section: 'V-A',
    admission_year: 2021,
    status: 'active',
    guardian_name: `Guardian of ${name}`,
    guardian_phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`
  });
});

// Multi-department cohort students for ECE, ME, and Civil
const OTHER_DEPT_STUDENTS = [
  // Electronics & Communication (ECE)
  { name: 'Siddharth Roy', roll: '21EC014', deptId: 'dept-ece', phone: '+91 98451 90211' },
  { name: 'Priya Nair', roll: '21EC022', deptId: 'dept-ece', phone: '+91 98452 33411' },
  { name: 'Rahul Mehta', roll: '21EC007', deptId: 'dept-ece', phone: '+91 98453 88921' },
  { name: 'Maya Sen', roll: '21EC031', deptId: 'dept-ece', phone: '+91 98454 55102' },
  { name: 'Vikram Joshi', roll: '21EC003', deptId: 'dept-ece', phone: '+91 98455 11983' },
  { name: 'Pooja Menon', roll: '21EC018', deptId: 'dept-ece', phone: '+91 98456 77204' },
  // Mechanical Engineering (ME)
  { name: 'Aman Verma', roll: '21ME012', deptId: 'dept-me', phone: '+91 98221 44019' },
  { name: 'Rajesh Pillai', roll: '21ME025', deptId: 'dept-me', phone: '+91 98222 66318' },
  { name: 'Sameer Deshpande', roll: '21ME009', deptId: 'dept-me', phone: '+91 98223 88127' },
  { name: 'Karthik Rao', roll: '21ME017', deptId: 'dept-me', phone: '+91 98224 22716' },
  // Civil Engineering (CE)
  { name: 'Tariq Khan', roll: '21CE005', deptId: 'dept-ce', phone: '+91 97111 55901' },
  { name: 'Sneha Patil', roll: '21CE019', deptId: 'dept-ce', phone: '+91 97112 77412' },
  { name: 'Deepa Rawat', roll: '21CE011', deptId: 'dept-ce', phone: '+91 97113 99123' },
  { name: 'Nitin Gadgil', roll: '21CE002', deptId: 'dept-ce', phone: '+91 97114 11834' },
  { name: 'Harish Kumar', roll: '21CE028', deptId: 'dept-ce', phone: '+91 97115 33245' }
];

OTHER_DEPT_STUDENTS.forEach((item, idx) => {
  const profileId = `student-profile-${item.roll.toLowerCase()}`;
  SEED_PROFILES.push({
    id: profileId,
    full_name: item.name,
    email: `${item.name.toLowerCase().replace(/\s+/g, '.')}.${item.roll.toLowerCase()}@cams.edu`,
    role: 'student',
    account_status: 'active',
    department_id: item.deptId,
    created_at: '2024-08-01T08:00:00Z',
    updated_at: '2024-10-24T08:00:00Z'
  });

  SEED_STUDENTS.push({
    id: `stud-${item.roll.toLowerCase()}`,
    profile_id: profileId,
    enrollment_number: item.roll,
    department_id: item.deptId,
    academic_year_id: 'ay-2024-25',
    semester_id: 'sem-5',
    section: 'V-A',
    admission_year: 2021,
    status: 'active',
    guardian_name: `Guardian of ${item.name}`,
    guardian_phone: item.phone
  });
});

// Enrollments
export const SEED_ENROLLMENTS: Enrollment[] = SEED_STUDENTS.map(s => ({
  id: `enr-${s.id}`,
  student_id: s.id,
  class_section_id: s.department_id === 'dept-me' ? 'sec-me-5b' : 'sec-cse-5a',
  academic_year_id: 'ay-2024-25',
  enrollment_status: 'enrolled'
}));

// Build realistic past attendance sessions & records for past 23 lectures
export const SEED_ATTENDANCE_SESSIONS: AttendanceSession[] = [];
export const SEED_ATTENDANCE_RECORDS: AttendanceRecord[] = [];

// Seed 23 past lectures for CS-501 in Sem V-A so today is Lecture #24
const PAST_DATES = [
  '2024-09-02', '2024-09-04', '2024-09-06', '2024-09-09', '2024-09-11',
  '2024-09-13', '2024-09-16', '2024-09-18', '2024-09-20', '2024-09-23',
  '2024-09-25', '2024-09-27', '2024-09-30', '2024-10-03', '2024-10-04',
  '2024-10-07', '2024-10-09', '2024-10-11', '2024-10-14', '2024-10-16',
  '2024-10-18', '2024-10-21', '2024-10-23'
];

PAST_DATES.forEach((date, i) => {
  const sessionId = `session-cs501-${i + 1}`;
  SEED_ATTENDANCE_SESSIONS.push({
    id: sessionId,
    subject_assignment_id: 'assign-cs501-5a',
    attendance_date: date,
    session_number: i + 1,
    start_time: '09:30:00',
    end_time: '10:30:00',
    created_by: 'prof-rajesh-sharma',
    status: 'submitted',
    submitted_at: `${date}T10:35:00Z`,
    hash_signature: `sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`,
    created_at: `${date}T09:30:00Z`
  });

  // Assign individual student records across all cohorts
  SEED_STUDENTS.forEach(student => {
    let status: 'present' | 'absent' | 'late' = 'present';
    
    // Key Stitch reference test accounts:
    if (student.enrollment_number === '21CS001') {
      // Aarav Patel ~ 91.3%
      status = i === 4 || i === 12 ? 'absent' : 'present';
    } else if (student.enrollment_number === '21CS002') {
      // Ananya Sharma ~ 73.9% (Shortage Warning)
      status = i === 2 || i === 6 || i === 10 || i === 15 || i === 18 || i === 21 ? 'absent' : (i === 12 ? 'late' : 'present');
    } else if (student.enrollment_number === '21CS003') {
      // Devendra Singh ~ 87.0%
      status = i === 3 || i === 9 || i === 17 ? 'absent' : 'present';
    } else if (student.enrollment_number === '21CS004') {
      // Ishaan Verma ~ 65.2% (Critical Defaulter)
      status = i % 3 === 0 ? 'absent' : (i % 5 === 0 ? 'late' : 'present');
    } else if (student.enrollment_number === '21ME038') {
      // Rohan Kulkarni ~ 60.9% (Critical Exam Hold)
      status = (i % 2 === 0 && i < 18) ? 'absent' : 'present';
    } else if (student.enrollment_number === '21ME012') {
      // Aman Verma ~ 65.2% (Critical Defaulter)
      status = (i % 3 === 0) ? 'absent' : 'present';
    } else if (student.enrollment_number === '21EC014') {
      // Siddharth Roy ~ 69.6% (Warning Tier)
      status = (i % 3 === 1 && i < 20) ? 'absent' : 'present';
    } else if (student.enrollment_number === '21EC022') {
      // Priya Nair ~ 73.9% (Warning Tier)
      status = (i === 1 || i === 5 || i === 9 || i === 13 || i === 17 || i === 21) ? 'absent' : 'present';
    } else if (student.enrollment_number === '21CE005') {
      // Tariq Khan ~ 69.6% (Warning Tier)
      status = (i === 2 || i === 6 || i === 8 || i === 12 || i === 15 || i === 19 || i === 22) ? 'absent' : 'present';
    } else if (student.enrollment_number === '21CE011') {
      // Deepa Rawat ~ 60.9% (Critical Defaulter)
      status = (i % 2 === 1 && i < 18) ? 'absent' : 'present';
    } else {
      // Cohort synthetic distribution based on roll number
      const rollDigit = parseInt(student.enrollment_number.replace(/\D/g, '') || '1', 10);
      const score = (rollDigit * 19 + i * 11) % 100;
      if (score < 75) status = 'present';
      else if (score < 86) status = 'late';
      else status = 'absent';
    }

    SEED_ATTENDANCE_RECORDS.push({
      id: `rec-${sessionId}-${student.id}`,
      attendance_session_id: sessionId,
      student_id: student.id,
      attendance_status: status,
      marked_by: 'prof-rajesh-sharma',
      marked_at: `${date}T10:30:00Z`
    });
  });
});

// Today's Active Session (Lecture #24 CS-501)
export const TODAY_SESSION_CS501: AttendanceSession = {
  id: 'session-cs501-24',
  subject_assignment_id: 'assign-cs501-5a',
  attendance_date: '2024-10-24',
  session_number: 24,
  start_time: '09:30:00',
  end_time: '10:30:00',
  created_by: 'prof-rajesh-sharma',
  status: 'draft',
  created_at: '2024-10-24T09:30:00Z'
};
SEED_ATTENDANCE_SESSIONS.push(TODAY_SESSION_CS501);

// Today's Completed Session (Lecture #22 CS-504 in Lab 2B: Marked 58/62 Present, 93.5%)
export const TODAY_SESSION_CS504: AttendanceSession = {
  id: 'session-cs504-22',
  subject_assignment_id: 'assign-cs504-5b',
  attendance_date: '2024-10-24',
  session_number: 22,
  start_time: '11:00:00',
  end_time: '12:00:00',
  created_by: 'prof-rajesh-sharma',
  status: 'submitted',
  submitted_at: '2024-10-24T12:02:00Z',
  hash_signature: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
  created_at: '2024-10-24T11:00:00Z'
};
SEED_ATTENDANCE_SESSIONS.push(TODAY_SESSION_CS504);

// Initial records for today's active session matching Stitch Active Roll Call
// Total 48 in cohort: 42 Present, 4 Absent, 2 Late -> 87.5% Quorum Rate!
SEED_STUDENTS.filter(s => s.department_id === 'dept-cse').forEach(student => {
  let status: 'present' | 'absent' | 'late' = 'present';
  if (student.enrollment_number === '21CS002') status = 'absent'; // Ananya Sharma
  else if (student.enrollment_number === '21CS004') status = 'late'; // Ishaan Verma
  else if (student.enrollment_number === '21CS012') status = 'absent';
  else if (student.enrollment_number === '21CS019') status = 'absent';
  else if (student.enrollment_number === '21CS028') status = 'absent';
  else if (student.enrollment_number === '21CS034') status = 'late';

  SEED_ATTENDANCE_RECORDS.push({
    id: `rec-today-${student.id}`,
    attendance_session_id: 'session-cs501-24',
    student_id: student.id,
    attendance_status: status,
    marked_by: 'prof-rajesh-sharma',
    marked_at: '2024-10-24T09:35:00Z'
  });
});

export const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    recipient_profile_id: 'prof-rajesh-sharma',
    title: 'Attendance Shortage Escalation',
    message: '9 students in CSE Sem V-A have breached the critical 65% attendance floor. Disciplinary notice required.',
    notification_type: 'alert',
    created_at: '2024-10-24T08:30:00Z',
    action_url: 'alerts'
  },
  {
    id: 'notif-2',
    recipient_profile_id: 'prof-rajesh-sharma',
    title: 'Biometric Terminal LH-302 Synced',
    message: 'Hardware beacon online with 99.8% mesh fidelity. Ready for active session verification.',
    notification_type: 'system',
    created_at: '2024-10-24T09:15:00Z',
    action_url: 'dashboard'
  },
  {
    id: 'notif-3',
    recipient_profile_id: 'student-ananya-sharma',
    title: 'Attendance Shortage Warning',
    message: 'Your overall attendance is currently 73.8% (Target: 75%). Please attend next 2 lectures consecutively.',
    notification_type: 'alert',
    created_at: '2024-10-23T16:00:00Z',
    action_url: 'attendance'
  },
  {
    id: 'notif-4',
    recipient_profile_id: 'admin-dean-thorne',
    title: 'Mid-Term Exam Clearance Hold',
    message: 'Formal review required for Rohan Kulkarni (21ME038) - attendance at 61.2%.',
    notification_type: 'report',
    created_at: '2024-10-24T07:45:00Z',
    action_url: 'alerts'
  }
];

export const SEED_CORRECTION_REQUESTS: AttendanceCorrectionRequest[] = [
  {
    id: 'corr-01',
    attendance_record_id: 'rec-session-cs501-21-stud-002',
    requested_by: 'student-ananya-sharma',
    requested_status: 'excused',
    reason: 'Represented college in National Robotics Hackathon on Oct 18. Medical certificate & Dean authorization attached.',
    request_status: 'pending',
    created_at: '2024-10-22T11:00:00Z',
    student_name: 'Ananya Sharma',
    subject_name: 'CS-501: Operating Systems',
    attendance_date: '2024-10-18',
    previous_status: 'absent'
  },
  {
    id: 'corr-02',
    attendance_record_id: 'rec-session-cs501-19-stud-003',
    requested_by: 'prof-rajesh-sharma',
    requested_status: 'present',
    reason: 'Biometric card read glitch in LH-302 reader during roll call. Verified lab journal entry.',
    request_status: 'approved',
    reviewed_by: 'admin-dean-thorne',
    reviewed_at: '2024-10-21T15:30:00Z',
    review_note: 'Verified with lab logbook and approved by Dean.',
    created_at: '2024-10-20T10:15:00Z',
    student_name: 'Devendra Singh',
    subject_name: 'CS-501: Operating Systems',
    attendance_date: '2024-10-14',
    previous_status: 'absent'
  }
];

export const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-001',
    actor_profile_id: 'prof-rajesh-sharma',
    actor_name: 'Prof. Rajesh Sharma',
    action: 'SUBMIT_ATTENDANCE_SESSION',
    entity_type: 'attendance_sessions',
    entity_id: 'session-cs504-22',
    metadata: {
      session_number: 22,
      subject_code: 'CS-504',
      present_count: 58,
      absent_count: 4,
      percentage: '93.5%'
    },
    created_at: '2024-10-24T12:02:14Z'
  },
  {
    id: 'audit-002',
    actor_profile_id: 'admin-dean-thorne',
    actor_name: 'Dr. Aris Thorne',
    action: 'DISPATCH_WEEKLY_DEFICIT_ALERTS',
    entity_type: 'alerts',
    entity_id: 'batch-alert-2024-w9',
    metadata: {
      recipients_count: 24,
      sms_dispatched: 18,
      email_dispatched: 24,
      department: 'ALL'
    },
    created_at: '2024-10-24T08:00:00Z'
  },
  {
    id: 'audit-003',
    actor_profile_id: 'admin-dean-thorne',
    actor_name: 'Dr. Aris Thorne',
    action: 'APPROVE_ATTENDANCE_CORRECTION',
    entity_type: 'attendance_correction_requests',
    entity_id: 'corr-02',
    metadata: {
      student_id: 'stud-003',
      previous_status: 'absent',
      updated_status: 'present'
    },
    created_at: '2024-10-21T15:30:00Z'
  }
];
