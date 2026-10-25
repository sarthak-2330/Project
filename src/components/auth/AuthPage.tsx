/**
 * Collegiate Authentication & Sign-Up Gate for CAMS
 * Enforces credential verification, faculty-only self-registration,
 * and restricted student access (profiles created exclusively by professors).
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/storage';
import { 
  Building2, 
  GraduationCap, 
  UserPlus, 
  Lock, 
  Mail, 
  BadgeCheck, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { signInWithEmail, signInWithEnrollment, signUpFaculty } = useAuth();

  const [activeTab, setActiveTab] = useState<'faculty' | 'student' | 'signup'>('faculty');
  const [showPassword, setShowPassword] = useState(false);

  // Faculty Login State
  const [facultyEmail, setFacultyEmail] = useState('');
  const [facultyPassword, setFacultyPassword] = useState('');
  const [facultyError, setFacultyError] = useState<string | null>(null);
  const [facultyLoading, setFacultyLoading] = useState(false);

  // Student Login State
  const [studentId, setStudentId] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentError, setStudentError] = useState<string | null>(null);
  const [studentLoading, setStudentLoading] = useState(false);

  // Faculty Registration State
  const [signUpForm, setSignUpForm] = useState({
    full_name: '',
    email: '',
    department_id: 'dept-cse',
    designation: 'Assistant Professor',
    faculty_code: 'FAC-CS-09',
    password: '',
    confirm_password: ''
  });
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signUpLoading, setSignUpLoading] = useState(false);

  const departments = db.getDepartments();

  // Handle Faculty Sign-In
  const handleFacultySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFacultyError(null);
    setFacultyLoading(true);

    try {
      const res = await signInWithEmail(facultyEmail, facultyPassword);
      if (!res.success) {
        setFacultyError(res.error || 'Failed to authenticate faculty credentials.');
      }
    } catch (err: any) {
      setFacultyError(err.message || 'Authentication error.');
    } finally {
      setFacultyLoading(false);
    }
  };

  // Handle Student Sign-In
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError(null);
    setStudentLoading(true);

    try {
      const res = await signInWithEnrollment(studentId, studentPassword);
      if (!res.success) {
        setStudentError(res.error || 'Failed to authenticate student credentials.');
      }
    } catch (err: any) {
      setStudentError(err.message || 'Authentication error.');
    } finally {
      setStudentLoading(false);
    }
  };

  // Handle Faculty Registration
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError(null);

    if (signUpForm.password !== signUpForm.confirm_password) {
      setSignUpError('Passwords do not match. Please re-enter.');
      return;
    }
    if (signUpForm.password.length < 6) {
      setSignUpError('Password must be at least 6 characters.');
      return;
    }

    setSignUpLoading(true);
    try {
      const res = await signUpFaculty({
        full_name: signUpForm.full_name,
        email: signUpForm.email,
        department_id: signUpForm.department_id,
        designation: signUpForm.designation,
        faculty_code: signUpForm.faculty_code,
        password: signUpForm.password
      });

      if (!res.success) {
        setSignUpError(res.error || 'Failed to register faculty account.');
      }
    } catch (err: any) {
      setSignUpError(err.message || 'Registration error.');
    } finally {
      setSignUpLoading(false);
    }
  };

  // Quick fill helper for demo/testing convenience
  const fillFacultyDemo = (email: string) => {
    setFacultyEmail(email);
    setFacultyPassword('password123');
    setFacultyError(null);
  };

  const fillStudentDemo = (enrollment: string) => {
    setStudentId(enrollment);
    setStudentPassword('password123');
    setStudentError(null);
  };

  const CAMS_LOGO = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxfYWOHo_nPqu6BCWG9FJM6ZB6gsZ1Z88lu33TkTtRR3LaAhtGVmFYm204SWkzMXZMgd2eize42u5kiMtKPAQxK1vkxVhfz49JdsNgwhRXm-BEwKNj73_vQiEv3BIc_J5fUHy4Kq-0gT75bdRlIUKxpvsHGs8IqBDLDGliQKWTraKuYSa95P4NR6YRdEs2E6endxP-97jukGVOjlT5rOiqG0ngf6NWQYi1Mck4I-12o_Kdj05eBEE6';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-[#edf2ff] to-[#e8edfc] flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden backdrop-blur-xl">
        {/* Header Emblem matching Google Stitch */}
        <div className="bg-gradient-to-b from-blue-700 to-blue-800 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/10 backdrop-blur-md mb-3 ring-1 ring-white/20 shadow-inner">
            <img 
              src={CAMS_LOGO} 
              alt="CAMS Emblem" 
              className="h-10 w-auto object-contain brightness-110"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }} 
            />
          </div>

          <p className="text-[11px] font-bold tracking-widest uppercase text-blue-200">
            St. Xavier Institute of Engineering & Technology
          </p>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
            CAMS Portal Authentication
          </h1>
          <p className="text-xs text-blue-100/90 mt-1 max-w-sm mx-auto">
            Academic Ledger, Active Roll Call, Defaulter Tracking, and Student Dossier
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 p-1.5 gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('faculty');
              setFacultyError(null);
            }}
            className={`flex-1 py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'faculty'
                ? 'bg-white text-blue-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Faculty Login</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('student');
              setStudentError(null);
            }}
            className={`flex-1 py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'student'
                ? 'bg-white text-blue-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>Student Portal</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setSignUpError(null);
            }}
            className={`flex-1 py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-white text-blue-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4 text-emerald-600" />
            <span>Faculty Sign-Up</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {/* TAB 1: FACULTY LOGIN */}
          {activeTab === 'faculty' && (
            <div className="space-y-4">
              <div className="text-left">
                <h2 className="text-base font-bold text-slate-900">Faculty & Administrative Sign In</h2>
                <p className="text-xs text-slate-500">
                  Enter your verified university credentials to manage attendance and academic records.
                </p>
              </div>

              {facultyError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{facultyError}</span>
                </div>
              )}

              <form onSubmit={handleFacultySubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institutional Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={facultyEmail}
                      onChange={(e) => setFacultyEmail(e.target.value)}
                      placeholder="e.g. rajesh.sharma@cams.edu"
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">Password</label>
                    <span className="text-[11px] text-slate-400 font-mono">Demo: password123</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={facultyPassword}
                      onChange={(e) => setFacultyPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full h-10 pl-9 pr-10 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={facultyLoading}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {facultyLoading ? (
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  ) : (
                    <>
                      <span>Verify Credentials & Enter CAMS</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Quick-Fill Presets for Evaluator */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  1-Click Demo Profiles (Evaluator Fast-Fill):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => fillFacultyDemo('rajesh.sharma@cams.edu')}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 text-left transition-colors cursor-pointer text-xs"
                  >
                    <p className="font-bold text-slate-900 truncate">Prof. Rajesh Sharma</p>
                    <p className="text-[10px] text-slate-500">CSE Assoc. Professor</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillFacultyDemo('dean.academics@cams.edu')}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 text-left transition-colors cursor-pointer text-xs"
                  >
                    <p className="font-bold text-slate-900 truncate">Dr. Aris Thorne</p>
                    <p className="text-[10px] text-slate-500">Dean of Academics</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillFacultyDemo('priya.rao@cams.edu')}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 text-left transition-colors cursor-pointer text-xs"
                  >
                    <p className="font-bold text-slate-900 truncate">Dr. Priya Rao</p>
                    <p className="text-[10px] text-slate-500">CSE Asst. Professor</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillFacultyDemo('vikram.seth@cams.edu')}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 text-left transition-colors cursor-pointer text-xs"
                  >
                    <p className="font-bold text-slate-900 truncate">Prof. Vikram Seth</p>
                    <p className="text-[10px] text-slate-500">ECE Professor</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STUDENT PORTAL LOGIN */}
          {activeTab === 'student' && (
            <div className="space-y-4">
              <div className="text-left">
                <h2 className="text-base font-bold text-slate-900">Student Academic Portal</h2>
                <p className="text-xs text-slate-500">
                  Access your personal attendance dossier, subject breakdown, and academic calendar.
                </p>
              </div>

              {/* Crucial Institutional Policy Callout */}
              <div className="p-3 bg-amber-50/80 border border-amber-200 text-amber-900 text-xs rounded-2xl flex items-start gap-2.5">
                <BadgeCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <span className="font-bold block text-amber-950">Strict Institutional Access Policy:</span>
                  Students cannot register themselves on this portal. Student profiles and credentials are provisioned exclusively by your course professors and department chairs.
                </div>
              </div>

              {studentError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{studentError}</span>
                </div>
              )}

              <form onSubmit={handleStudentSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Enrollment Number or Email
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g. 21CS001 or student@cams.edu"
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">Student Password</label>
                    <span className="text-[11px] text-slate-400 font-mono">Default: password123</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full h-10 pl-9 pr-10 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={studentLoading}
                  className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {studentLoading ? (
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  ) : (
                    <>
                      <span>Verify & Access Student Dossier</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Quick-Fill Presets for Evaluator */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Sample Enrolled Students (Evaluator Fast-Fill):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => fillStudentDemo('21CS001')}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 text-left transition-colors cursor-pointer text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900 truncate">21CS001</p>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">88.4%</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Aarav Patel (CSE V-A)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillStudentDemo('21CS002')}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 text-left transition-colors cursor-pointer text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900 truncate">21CS002</p>
                      <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">73.2%</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Ananya Sharma (CSE V-A)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillStudentDemo('21CS004')}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 text-left transition-colors cursor-pointer text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900 truncate">21CS004</p>
                      <span className="text-[9px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-bold">62.5%</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Ishaan Verma (Critical Defaulter)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillStudentDemo('21ME038')}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 text-left transition-colors cursor-pointer text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900 truncate">21ME038</p>
                      <span className="text-[9px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-bold">56.0%</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Rohan Kulkarni (Disciplinary)</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NEW FACULTY SIGN-UP */}
          {activeTab === 'signup' && (
            <div className="space-y-4">
              <div className="text-left">
                <h2 className="text-base font-bold text-slate-900">New Faculty Registration</h2>
                <p className="text-xs text-slate-500">
                  Register as an instructor or academic officer for Fall 2024.
                </p>
              </div>

              {/* Informative distinction callout */}
              <div className="p-3 bg-blue-50/80 border border-blue-200 text-blue-900 text-xs rounded-2xl flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <span className="font-semibold block">Faculty Only Registration:</span>
                  Are you a student? Student accounts are issued by your professors in the Students Directory. Contact your faculty mentor if you need access.
                </div>
              </div>

              {signUpError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{signUpError}</span>
                </div>
              )}

              <form onSubmit={handleSignUpSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name & Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={signUpForm.full_name}
                    onChange={(e) => setSignUpForm({ ...signUpForm, full_name: e.target.value })}
                    placeholder="e.g. Dr. Sunil Kumar"
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institutional Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={signUpForm.email}
                    onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                    placeholder="sunil.kumar@cams.edu"
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Department *
                    </label>
                    <select
                      value={signUpForm.department_id}
                      onChange={(e) => setSignUpForm({ ...signUpForm, department_id: e.target.value })}
                      className="w-full h-9 px-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-600 bg-white"
                    >
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.department_code} ({d.department_name})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Designation *
                    </label>
                    <select
                      value={signUpForm.designation}
                      onChange={(e) => setSignUpForm({ ...signUpForm, designation: e.target.value })}
                      className="w-full h-9 px-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-600 bg-white"
                    >
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Professor">Professor</option>
                      <option value="Head of Department">Head of Department</option>
                      <option value="Adjunct Lecturer">Adjunct Lecturer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Faculty Employee Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={signUpForm.faculty_code}
                    onChange={(e) => setSignUpForm({ ...signUpForm, faculty_code: e.target.value })}
                    placeholder="FAC-CS-09"
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 uppercase focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={signUpForm.password}
                      onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                      placeholder="Min 6 characters"
                      className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={signUpForm.confirm_password}
                      onChange={(e) => setSignUpForm({ ...signUpForm, confirm_password: e.target.value })}
                      placeholder="Re-enter password"
                      className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={signUpLoading}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
                >
                  {signUpLoading ? (
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Create Account & Enter Portal</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>St. Xavier Institute CAMS v2.4</span>
          <span className="flex items-center gap-1 font-mono text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Session Server
          </span>
        </div>
      </div>
    </div>
  );
};
