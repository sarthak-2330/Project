/**
 * Reactive Database State Context for CAMS
 * Provides live synchronization across all components
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  StudentAttendanceSummary,
  AttendanceSession,
  AppNotification,
  SystemSettings,
  AttendanceCorrectionRequest,
  Student,
  Faculty,
  Subject,
  Department,
  ClassSection
} from '../types';
import { db } from '../db/storage';
import { useAuth } from './AuthContext';

interface DatabaseContextType {
  settings: SystemSettings;
  students: Student[];
  faculty: Faculty[];
  subjects: Subject[];
  departments: Department[];
  classSections: ClassSection[];
  sessions: AttendanceSession[];
  studentSummaries: StudentAttendanceSummary[];
  defaulters: StudentAttendanceSummary[];
  notifications: AppNotification[];
  correctionRequests: AttendanceCorrectionRequest[];
  unreadNotificationsCount: number;
  isSupabaseLive: boolean;
  refreshData: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  activeTodaySession: AttendanceSession | undefined;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [settings, setSettings] = useState<SystemSettings>(db.getSettings());
  const [students, setStudents] = useState<Student[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [classSections, setClassSections] = useState<ClassSection[]>([]);
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [studentSummaries, setStudentSummaries] = useState<StudentAttendanceSummary[]>([]);
  const [defaulters, setDefaulters] = useState<StudentAttendanceSummary[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [correctionRequests, setCorrectionRequests] = useState<AttendanceCorrectionRequest[]>([]);

  const loadAll = useCallback(() => {
    setSettings(db.getSettings());
    setStudents(db.getStudents());
    setFaculty(db.getFaculty());
    setSubjects(db.getSubjects());
    setDepartments(db.getDepartments());
    setClassSections(db.getClassSections());
    setSessions(db.getAttendanceSessions());
    setStudentSummaries(db.getAllStudentsAttendanceSummary());
    setDefaulters(db.getDefaultersList());
    setNotifications(db.getNotifications(currentUser?.id));
    setCorrectionRequests(db.getCorrectionRequests());
  }, [currentUser?.id]);

  useEffect(() => {
    loadAll();
    const unsub = db.subscribe(() => {
      loadAll();
    });
    return unsub;
  }, [loadAll]);

  const markNotificationRead = (id: string) => {
    db.markNotificationAsRead(id);
  };

  const markAllNotificationsRead = () => {
    if (currentUser?.id) {
      db.markAllNotificationsAsRead(currentUser.id);
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read_at).length;
  const isSupabaseLive = db.isUsingLiveSupabase();

  // Find today's active session for CS-501 (matching Stitch reference)
  const activeTodaySession = sessions.find(
    s => s.id === 'session-cs501-24' || (s.attendance_date === '2024-10-24' && s.status === 'draft')
  ) || sessions[0];

  return (
    <DatabaseContext.Provider
      value={{
        settings,
        students,
        faculty,
        subjects,
        departments,
        classSections,
        sessions,
        studentSummaries,
        defaulters,
        notifications,
        correctionRequests,
        unreadNotificationsCount,
        isSupabaseLive,
        refreshData: loadAll,
        markNotificationRead,
        markAllNotificationsRead,
        activeTodaySession
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
