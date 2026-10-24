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
import { Student } from './types';

const MainAppContent: React.FC = () => {
  const { currentUser, role, isStudent } = useAuth();
  const { defaulters } = useDatabase();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showClassSwapModal, setShowClassSwapModal] = useState(false);
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
            onOpenCounselingModal={(name) => alert(`Counseling session scheduled with Mentor Dr. Rao for ${name} on Oct 25, 11:30 AM`)}
            onOpenUndertakingModal={(name) => alert(`Standard Academic Disciplinary Undertaking generated and sent to guardian of ${name}`)}
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
        alertCount={defaulters.length > 0 ? 5 : 0}
      />

      {/* Modals */}
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
