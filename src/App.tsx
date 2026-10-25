/**
 * College Attendance Management System (CAMS)
 * Root Application Router & Component
 * Fully faithful to Google Stitch Visual Reference
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DatabaseProvider, useDatabase } from './context/DatabaseContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { FacultyDashboard } from './components/dashboard/FacultyDashboard';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { ActiveRollCall } from './components/attendance/ActiveRollCall';
import { StudentsDirectory } from './components/students/StudentsDirectory';
import { ShortageAlerts } from './components/alerts/ShortageAlerts';
import { AttendanceReports } from './components/reports/AttendanceReports';
import { DsaConceptsPage } from './components/dsa/DsaConceptsPage';
import { AcademicSettings } from './components/academic/AcademicSettings';
import { SupabaseConfigModal } from './components/settings/SupabaseConfigModal';
import { StudentDetailModal } from './components/students/StudentDetailModal';
import { ExportDailyPdfModal } from './components/common/ExportDailyPdfModal';
import { ClassSwapModal } from './components/common/ClassSwapModal';
import { TimetableModal } from './components/common/TimetableModal';
import { SessionSummaryModal } from './components/common/SessionSummaryModal';
import { LectureNotesModal } from './components/common/LectureNotesModal';
import { BiometricTerminalModal } from './components/common/BiometricTerminalModal';
import { CounselingLogModal } from './components/alerts/CounselingLogModal';
import { UndertakingFormModal } from './components/alerts/UndertakingFormModal';
import { DisciplinaryCaseModal } from './components/alerts/DisciplinaryCaseModal';
import { Student } from './types';

const MainAppContent: React.FC = () => {
  const { currentUser, role, isStudent } = useAuth();
  const { defaulters } = useDatabase();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showClassSwapModal, setShowClassSwapModal] = useState(false);
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [showSessionSummaryModal, setShowSessionSummaryModal] = useState(false);
  const [showLectureNotesModal, setShowLectureNotesModal] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [counselingStudent, setCounselingStudent] = useState<string | null>(null);
  const [undertakingStudent, setUndertakingStudent] = useState<{ name: string; roll: string } | null>(null);
  const [disciplinaryStudent, setDisciplinaryStudent] = useState<{ name: string; roll: string } | null>(null);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);

  // Derive dynamic page title matching Stitch
  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return isStudent ? 'Student Dossier' : 'Dashboard';
      case 'attendance':
        return 'Active Roll Call';
      case 'students':
        return 'Students';
      case 'alerts':
        return 'Alerts';
      case 'reports':
        return 'Reports & Ledger';
      case 'dsa':
        return 'DSA Concepts Lab';
      case 'academic':
      case 'profile':
        return isStudent ? 'Student Dossier' : 'Academic Settings';
      default:
        return 'Dashboard';
    }
  };

  const getPageSubtitle = () => {
    switch (activeTab) {
      case 'attendance':
        return 'CAMS Session';
      default:
        return 'CAMS Portal';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header matching Google Stitch */}
      <Header
        title={getPageTitle()}
        subtitle={getPageSubtitle()}
        showBack={activeTab !== 'dashboard'}
        onBack={() => setActiveTab('dashboard')}
        onOpenSupabaseConfig={() => setShowSupabaseModal(true)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 w-full pt-20 pb-20">
        {/* If student role is logged in, show student-tailored dashboard */}
        {isStudent && (activeTab === 'dashboard' || activeTab === 'profile') && (
          <StudentDashboard />
        )}

        {/* Faculty & Admin Dashboard */}
        {!isStudent && activeTab === 'dashboard' && (
          <FacultyDashboard
            onTakeAttendance={() => setActiveTab('attendance')}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenExportModal={() => setShowExportModal(true)}
            onOpenClassSwapModal={() => setShowClassSwapModal(true)}
            onOpenTimetable={() => setShowTimetableModal(true)}
            onOpenSessionSummary={() => setShowSessionSummaryModal(true)}
            onOpenLectureNotes={() => setShowLectureNotesModal(true)}
            onOpenBiometricTerminal={() => setShowBiometricModal(true)}
          />
        )}

        {/* Active Roll Call / Take Attendance */}
        {activeTab === 'attendance' && (
          <ActiveRollCall
            onBack={() => setActiveTab('dashboard')}
            onAttendanceSubmitted={() => setActiveTab('dashboard')}
          />
        )}

        {/* Students Directory */}
        {activeTab === 'students' && (
          <StudentsDirectory
            onSelectStudent={(student) => setSelectedStudentForDetail(student)}
          />
        )}

        {/* Shortage Alerts / Defaulter Management */}
        {activeTab === 'alerts' && (
          <ShortageAlerts
            onOpenCounselingModal={(name) => setCounselingStudent(name)}
            onOpenUndertakingModal={(name, roll) => setUndertakingStudent({ name, roll: roll || '21CS004' })}
            onOpenDisciplinaryModal={(name, roll) => setDisciplinaryStudent({ name: name || 'Rohan Kulkarni', roll: roll || '21ME038' })}
          />
        )}

        {/* Reports & Official Exports */}
        {activeTab === 'reports' && <AttendanceReports />}

        {/* DSA Concepts Laboratory (Mini-Project) */}
        {activeTab === 'dsa' && <DsaConceptsPage />}

        {/* Academic Settings (for Admin / Faculty Profile tab) */}
        {!isStudent && (activeTab === 'academic' || activeTab === 'profile') && (
          <AcademicSettings />
        )}
      </main>

      {/* Bottom Navigation Bar matching Stitch */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        alertCount={defaulters.length}
      />

      {/* Modals & Dialogs */}
      <SupabaseConfigModal
        isOpen={showSupabaseModal}
        onClose={() => setShowSupabaseModal(false)}
      />

      <ExportDailyPdfModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />

      <ClassSwapModal
        isOpen={showClassSwapModal}
        onClose={() => setShowClassSwapModal(false)}
      />

      <StudentDetailModal
        student={selectedStudentForDetail}
        onClose={() => setSelectedStudentForDetail(null)}
      />

      <TimetableModal
        isOpen={showTimetableModal}
        onClose={() => setShowTimetableModal(false)}
      />

      <SessionSummaryModal
        isOpen={showSessionSummaryModal}
        onClose={() => setShowSessionSummaryModal(false)}
      />

      <LectureNotesModal
        isOpen={showLectureNotesModal}
        onClose={() => setShowLectureNotesModal(false)}
      />

      <BiometricTerminalModal
        isOpen={showBiometricModal}
        onClose={() => setShowBiometricModal(false)}
      />

      <CounselingLogModal
        isOpen={!!counselingStudent}
        studentName={counselingStudent || 'Ananya Sharma'}
        onClose={() => setCounselingStudent(null)}
      />

      <UndertakingFormModal
        isOpen={!!undertakingStudent}
        studentName={undertakingStudent?.name || 'Ishaan Verma'}
        enrollmentNumber={undertakingStudent?.roll || '21CS004'}
        onClose={() => setUndertakingStudent(null)}
      />

      <DisciplinaryCaseModal
        isOpen={!!disciplinaryStudent}
        studentName={disciplinaryStudent?.name || 'Rohan Kulkarni'}
        enrollmentNumber={disciplinaryStudent?.roll || '21ME038'}
        onClose={() => setDisciplinaryStudent(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DatabaseProvider>
        <MainAppContent />
      </DatabaseProvider>
    </AuthProvider>
  );
}
