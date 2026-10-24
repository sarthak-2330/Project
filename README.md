# College Attendance Management System (CAMS)

A complete, production-grade, full-stack **College Attendance Management System (CAMS)** built with React, TypeScript, Tailwind CSS, and Supabase PostgreSQL. Designed to faithfully reproduce the Google Stitch reference UI with high-density data presentation, instant tactile attendance toggling, cryptographically locked sessions, comprehensive shortage alerting, and an interactive Data Structures & Algorithms (DSA) mini-project laboratory.

---

## 1. System Architecture & Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide React icons, Material Symbols Outlined.
- **Backend & Database:** Supabase PostgreSQL with complete Row-Level Security (RLS) policies, atomic attendance transactions, foreign keys, and indexes.
- **Resilient Persistence:** Dual-engine architecture:
  1. Live Supabase PostgreSQL connection via `@supabase/supabase-js`.
  2. Resilient local relational engine with full schema parity, ACID simulation, and event broadcasting to guarantee zero data loss across browser refreshes and evaluation restarts.
- **Design Reference:** Google Stitch Corporate Modern Minimalist aesthetic (`#2563EB` primary, `#0F172A` dark navy, `#F8FAFC` slate background, and accessible semantic status tokens).

---

## 2. Core Modules & Stitch Screens

### A. Dashboard (`/dashboard`)
- **Welcome Banner:** Professor headshot avatar, presence badge, academic term status, and one-click data sync with micro-interaction.
- **2x2 KPI Grid:** Total Students (842), Today's Attendance (88.4%), Active Classes (18), and Shortage Alerts (24).
- **Weekly Trend Visualization:** Interactive bar chart with institutional target threshold ($\ge 85\%$) and daily performance.
- **Today's Lectures:**
  - Active Lecture Ready for Roll Call (CS-501 Operating Systems, LH-302, 09:30–10:30 AM).
  - Completed Session Summary (CS-504 DBMS Lab, Marked 58/62 Present, 93.5%).
  - Upcoming Session (CS-702 Cloud Computing).
- **Biometric Terminal Status:** Real-time hardware mesh sync beacon indicator for room LH-302.

### B. Active Roll Call (`/attendance`)
- **Cohort Quorum Gauge:** Live 4-way counter ribbon (`Total`, `PRS`, `ABS`, `LAT`) and dynamic multi-segmented quorum bar.
- **Instant Controls:** Batch "All Present" action, roster reset, and live name/roll number search.
- **3-State Segmented Toggles:** Fast, single-click tactile toggles (`Present`, `Absent`, `Late`) for each student.
- **Docked Submission Action Bar:** Cryptographically signed attendance lock with SHA-256 digital seal, faculty signature verification, and immutable audit log entry.

### C. Students Directory (`/students`)
- Search by name, roll number, or USN with QR scanner affordance.
- Department filter chips (`All Depts`, `CSE`, `ECE`, `ME`, `Below 75%`).
- Cohort Snapshot metric banner (`86.2% Avg Attendance`).
- Student profile cards with lectures attended ratio, percentage bar, examination eligibility status, and quick actions.
- Add Student modal with uniqueness validation.
- Bulk CSV Import modal utilizing a FIFO job queue.

### D. Shortage Alerts & Defaulter Interventions (`/alerts`)
- **Auto-Dispatch Status:** Scheduled parent advisory notification banner.
- **Policy Alert Panel:** 24 Defaulters breakdown matrix (Critical $<65\%$, Warning $65\text{--}74\%$, Contacted 18 parents).
- **Mathematical Deficit Callout:** Dynamically calculates exact consecutive lectures required to regain 75% eligibility:
  $$\text{Deficit} = \left\lceil \frac{0.75 \times T - P}{0.25} \right\rceil$$
- **Priority Interventions:** Ishaan Verma (Critical Defaulter), Ananya Sharma (Warning Tier), Rohan Kulkarni (Hall Ticket Withheld).
- **Department Operations:** Bulk SMS warning dispatch simulator and CSV defaulter download.

### E. Attendance Reports (`/reports`)
- Audited student rosters with department, subject, and date range filters.
- Cohort mean statistics, pass/shortage ratio, and full CSV export.
- Print-friendly layout for administrative boards and university inspections.

### F. Engineering Mini-Project: DSA Laboratory (`/dsa`)
Practical demonstration of 5 core Data Structures and Algorithms applied to attendance data:
1. **Hash Table Lookup:** Average-case $O(1)$ key retrieval using direct hashing versus $O(\log N)$ relational B-Tree indexing.
2. **Sorting Visualizer:** QuickSort vs MergeSort on student attendance percentages with live execution timing, comparison counters, and swap metrics.
3. **FIFO Queue:** Queue buffer enforcing First-In, First-Out discipline for bulk student CSV imports and parent SMS dispatches.
4. **Doubly Linked List:** Chronological lecture history traversal with bidirectional node pointer inspection (`prev <- Node -> next`).
5. **Search Comparison:** Step-by-step benchmark comparing Linear Search $O(N)$ with Binary Search $O(\log_2 N)$ on sorted enrollment numbers.

---

## 3. Database Schema & RLS Policies

The complete SQL schema is located in `/src/db/schema.sql` and includes:
- `profiles`: User accounts, emails, roles (`admin`, `faculty`, `student`), and status.
- `departments`: Academic faculties (CSE, ECE, ME, CE).
- `academic_years` & `semesters`: Term spans and active flags.
- `class_sections`: Section assignments (Sem V-A, Sem V-B).
- `subjects`: Course codes, credits, and default lecture halls.
- `faculty`: Faculty IDs, designations, and department associations.
- `students`: Matriculation IDs, sections, and guardian contact details.
- `subject_assignments`: Faculty-to-subject-to-section mapping.
- `enrollments`: Student cohort registrations.
- `attendance_sessions`: Lecture metadata, session numbers, and SHA-256 hash signatures.
- `attendance_records`: Normalized individual attendance statuses with unique composite constraints `(attendance_session_id, student_id)`.
- `attendance_correction_requests`: Formal review petitions with reason, proposed status, and approval workflow.
- `notifications`: In-app alert dispatch center.
- `audit_logs`: Immutable security ledger recording all logins, attendance submissions, and policy changes.
- **Row-Level Security (RLS):** Explicit database-level policies ensuring students can only view their own attendance, faculty can only mark assigned classes, and administrators maintain supervisory control.

---

## 4. Setup & Deployment Guide

### Environment Variables
Copy `.env.example` to `.env`:
```bash
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
```

### Running Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### In-App Supabase Integration
1. Click the database status button in the top navigation header (`Persistent Storage` or `Supabase Live`).
2. Enter your Supabase Project URL and Anon Key.
3. Click "Test Connection" and "Save & Connect".
4. Copy the complete SQL script from the "SQL Migrations" tab and run it in your Supabase SQL Editor.
