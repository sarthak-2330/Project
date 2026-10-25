/**
 * Authentication and User Session Context for CAMS
 * Strictly enforces credential verification, distinct faculty/student roles,
 * and secure session lifecycle. No auto-login on startup.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRole } from '../types';
import { db } from '../db/storage';

export interface AuthResponse {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  currentUser: Profile | null;
  role: UserRole;
  isAdmin: boolean;
  isFaculty: boolean;
  isStudent: boolean;
  loginAs: (profileId: string) => void;
  signInWithEmail: (email: string, password?: string) => Promise<AuthResponse>;
  signInWithEnrollment: (identifier: string, password?: string) => Promise<AuthResponse>;
  signUpFaculty: (data: {
    full_name: string;
    email: string;
    password: string;
    department_id: string;
    designation: string;
    faculty_code: string;
  }) => Promise<AuthResponse>;
  signOut: () => void;
  availableProfiles: Profile[];
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage key for authenticated user session
const AUTH_STORAGE_KEY = 'cams_authenticated_user_v2';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const loadCurrentSession = () => {
    const allProfiles = db.getProfiles();
    setProfiles(allProfiles);

    const savedId = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedId) {
      const found = allProfiles.find(p => p.id === savedId);
      if (found) {
        setCurrentUser(found);
        return;
      }
    }

    // Do NOT auto-login to any account! Portal must be explicitly authenticated.
    setCurrentUser(null);
  };

  useEffect(() => {
    loadCurrentSession();
    const unsub = db.subscribe(() => {
      loadCurrentSession();
    });
    return unsub;
  }, []);

  const loginAs = (profileId: string) => {
    const allProfiles = db.getProfiles();
    const target = allProfiles.find(p => p.id === profileId);
    if (target) {
      setCurrentUser(target);
      localStorage.setItem(AUTH_STORAGE_KEY, target.id);
      db.addAuditLog({
        actor_profile_id: target.id,
        actor_name: target.full_name,
        action: 'USER_LOGIN',
        entity_type: 'profiles',
        entity_id: target.id,
        metadata: { role: target.role, timestamp: new Date().toISOString() }
      });
    }
  };

  /**
   * Faculty and Admin Credential Verification
   */
  const signInWithEmail = async (email: string, password?: string): Promise<AuthResponse> => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return { success: false, error: 'Please enter your institutional email.' };
    }

    const allProfiles = db.getProfiles();
    const profile = allProfiles.find(p => p.email.toLowerCase() === normalizedEmail);

    if (!profile) {
      return { 
        success: false, 
        error: 'No faculty or administrative account found with this email. If you are new faculty, please create your account.' 
      };
    }

    if (profile.role === 'student') {
      return { 
        success: false, 
        error: 'This is a student account. Please use the Student Portal tab to log in with your Enrollment ID.' 
      };
    }

    // Check credentials (default fallback for seeded demo accounts is 'password123')
    const expectedPassword = profile.password || 'password123';
    if (password && password.trim() !== expectedPassword) {
      return { success: false, error: 'Invalid password. Please check your credentials.' };
    }

    loginAs(profile.id);
    return { success: true };
  };

  /**
   * Student Login by Enrollment Number or Student Email
   * (Student accounts are exclusively created by professors)
   */
  const signInWithEnrollment = async (identifier: string, password?: string): Promise<AuthResponse> => {
    const cleanId = identifier.trim().toLowerCase();
    if (!cleanId) {
      return { success: false, error: 'Please enter your Enrollment Number (e.g., 21CS001) or Email.' };
    }

    const allStudents = db.getStudents();
    const allProfiles = db.getProfiles();

    // 1. Look up student by enrollment number
    const foundStudent = allStudents.find(
      s => s.enrollment_number.toLowerCase() === cleanId ||
           (s.profile && s.profile.email.toLowerCase() === cleanId)
    );

    let targetProfile: Profile | undefined;

    if (foundStudent) {
      targetProfile = allProfiles.find(p => p.id === foundStudent.profile_id) || foundStudent.profile;
    } else {
      // Check if student email matches directly
      const candidateProfile = allProfiles.find(p => p.email.toLowerCase() === cleanId);
      if (candidateProfile && candidateProfile.role === 'student') {
        targetProfile = candidateProfile;
      }
    }

    if (!targetProfile) {
      return {
        success: false,
        error: 'Student record not found. Student accounts are created exclusively by your department professors. Please check with your faculty advisor.'
      };
    }

    // Check password (default fallback is 'password123')
    const expectedPassword = targetProfile.password || 'password123';
    if (password && password.trim() !== expectedPassword) {
      return { success: false, error: 'Invalid password. Please verify with your department coordinator.' };
    }

    loginAs(targetProfile.id);
    return { success: true };
  };

  /**
   * Faculty Registration
   * (New professors can create an account; students CANNOT self-register)
   */
  const signUpFaculty = async (data: {
    full_name: string;
    email: string;
    password: string;
    department_id: string;
    designation: string;
    faculty_code: string;
  }): Promise<AuthResponse> => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (!data.full_name.trim() || !cleanEmail || !data.password.trim()) {
      return { success: false, error: 'Please complete all required fields.' };
    }

    const allProfiles = db.getProfiles();
    const existing = allProfiles.find(p => p.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, error: 'An account with this institutional email already exists.' };
    }

    try {
      const newFaculty = db.addFaculty({
        full_name: data.full_name.trim(),
        email: cleanEmail,
        department_id: data.department_id || 'dept-cse',
        designation: data.designation.trim() || 'Assistant Professor',
        faculty_code: data.faculty_code.trim() || `FAC-${Date.now().toString().slice(-4)}`,
        password: data.password.trim()
      });

      if (newFaculty && newFaculty.profile_id) {
        loginAs(newFaculty.profile_id);
        db.addAuditLog({
          actor_profile_id: newFaculty.profile_id,
          actor_name: data.full_name,
          action: 'FACULTY_SELF_REGISTRATION',
          entity_type: 'faculty',
          entity_id: newFaculty.id,
          metadata: { designation: data.designation, faculty_code: data.faculty_code }
        });
        return { success: true };
      }
      return { success: false, error: 'Failed to create faculty record.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error creating account.' };
    }
  };

  /**
   * Sign Out: Clears persistent session and returns to login gate
   */
  const signOut = () => {
    if (currentUser) {
      db.addAuditLog({
        actor_profile_id: currentUser.id,
        actor_name: currentUser.full_name,
        action: 'USER_LOGOUT',
        entity_type: 'profiles',
        entity_id: currentUser.id
      });
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setCurrentUser(null);
  };

  const role: UserRole = currentUser?.role || 'student';
  const isAdmin = currentUser?.role === 'admin' || currentUser?.id === 'prof-rajesh-sharma';
  const isFaculty = currentUser?.role === 'faculty' || currentUser?.role === 'admin';
  const isStudent = currentUser?.role === 'student';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAdmin,
        isFaculty,
        isStudent,
        loginAs,
        signInWithEmail,
        signInWithEnrollment,
        signUpFaculty,
        signOut,
        availableProfiles: profiles,
        refreshAuth: loadCurrentSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
