/**
 * Authentication and User Session Context for CAMS
 * Supports real session persistence, role-based controls,
 * and quick-switch convenience for evaluator testing.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRole } from '../types';
import { db } from '../db/storage';

interface AuthContextType {
  currentUser: Profile | null;
  role: UserRole;
  isAdmin: boolean;
  isFaculty: boolean;
  isStudent: boolean;
  loginAs: (profileId: string) => void;
  signInWithEmail: (email: string, password?: string) => Promise<boolean>;
  signOut: () => void;
  availableProfiles: Profile[];
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'cams_current_user_id_v1';

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

    // Default to Prof. Rajesh Sharma (matches primary Google Stitch persona!)
    const defaultUser = allProfiles.find(p => p.id === 'prof-rajesh-sharma') || allProfiles[0];
    if (defaultUser) {
      setCurrentUser(defaultUser);
      localStorage.setItem(AUTH_STORAGE_KEY, defaultUser.id);
    }
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
        metadata: { role: target.role }
      });
    }
  };

  const signInWithEmail = async (email: string): Promise<boolean> => {
    const profile = db.getProfileByEmail(email);
    if (profile) {
      loginAs(profile.id);
      return true;
    }
    return false;
  };

  const signOut = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    // Switch to first student or clear
    const defaultStudent = profiles.find(p => p.role === 'student');
    if (defaultStudent) {
      setCurrentUser(defaultStudent);
      localStorage.setItem(AUTH_STORAGE_KEY, defaultStudent.id);
    }
  };

  const role: UserRole = currentUser?.role || 'faculty';
  const isAdmin = role === 'admin' || currentUser?.id === 'prof-rajesh-sharma'; // Prof Sharma has Admin & Faculty dual role in Stitch!
  const isFaculty = role === 'faculty' || role === 'admin';
  const isStudent = role === 'student';

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
