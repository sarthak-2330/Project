/**
 * Supabase Configuration & Database Diagnostic Center
 * Allows live credentials configuration, connection testing,
 * schema migration copy, and database resets.
 */

import React, { useState } from 'react';
import { db } from '../../db/storage';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  RotateCcw, 
  X, 
  Key, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose
}) => {
  const currentConfig = db.getCustomSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(currentConfig.url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(currentConfig.anonKey);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'sql' | 'guide'>('config');

  if (!isOpen) return null;

  const isLive = db.isUsingLiveSupabase();

  const handleSaveConfig = () => {
    db.setCustomSupabaseConfig(supabaseUrl.trim(), supabaseAnonKey.trim());
    handleTestConnection();
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const result = await db.testSupabaseConnection();
    setIsTesting(false);
    setTestResult(result);
  };

  const handleCopySql = () => {
    // Read schema.sql content
    const schemaSql = `-- PostgreSQL / Supabase Schema for CAMS
-- Execute this script directly in your Supabase SQL Editor
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'faculty', 'student')),
  avatar_url TEXT,
  account_status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- ... Full schema is located in /src/db/schema.sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by authenticated users" ON profiles FOR SELECT TO authenticated USING (true);
`;
    navigator.clipboard.writeText(schemaSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleResetSeed = () => {
    if (window.confirm('Reset all local data back to the clean factory seed state?')) {
      db.resetToFactorySeed();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Database & Supabase Settings</h2>
              <p className="text-[11px] text-slate-500">PostgreSQL backend integration & persistent storage status</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl my-3">
          <button
            onClick={() => setActiveTab('config')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'config' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Connection & Keys
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'sql' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            SQL Migrations (RLS)
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'guide' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Setup Guide
          </button>
        </div>

        {/* Active Tab 1: Config */}
        {activeTab === 'config' && (
          <div className="space-y-3.5">
            {/* Status Callout */}
            <div
              className={`p-3 rounded-xl border flex items-center justify-between ${
                isLive
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-blue-50 text-blue-900 border-blue-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-600' : 'bg-blue-600'}`}></span>
                <span className="font-bold">
                  {isLive ? 'Live Supabase PostgreSQL Connected' : 'Local Persistent Engine Active'}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/70 border border-current">
                {isLive ? 'ONLINE' : 'ACID MOCK / LOCAL'}
              </span>
            </div>

            <p className="text-slate-600 leading-relaxed">
              CAMS connects directly to Supabase PostgreSQL when credentials are provided.
              When running offline or in demo mode, our local relational engine guarantees 100% data persistence across page reloads.
            </p>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Supabase Project URL</label>
              <input
                type="url"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://your-project.supabase.co"
                className="w-full h-9 px-3 rounded-xl border border-slate-200 font-mono text-xs focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Supabase Public Anon Key</label>
              <input
                type="password"
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                className="w-full h-9 px-3 rounded-xl border border-slate-200 font-mono text-xs focus:outline-none focus:border-blue-600"
              />
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  testResult.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
                <span>{testResult.message}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetSeed}
                className="px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Factory Data
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  {isTesting ? 'Testing...' : 'Test Connection'}
                </button>
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer"
                >
                  Save & Connect
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: SQL Migration Script */}
        {activeTab === 'sql' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-slate-600">
                Execute the complete schema & RLS rules located in <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">src/db/schema.sql</code> in your Supabase SQL editor:
              </p>
              <button
                onClick={handleCopySql}
                className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedSql ? 'Copied!' : 'Copy Script'}</span>
              </button>
            </div>

            <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px] max-h-56 overflow-y-auto">
              <pre>{`-- PROFILES & RBAC
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'faculty', 'student'))
);

-- ATTENDANCE SESSIONS & RECORDS
CREATE TABLE attendance_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_assignment_id UUID NOT NULL,
  attendance_date DATE NOT NULL,
  session_number INT NOT NULL,
  status TEXT DEFAULT 'draft',
  hash_signature TEXT
);

CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attendance_session_id UUID REFERENCES attendance_sessions(id),
  student_id UUID REFERENCES students(id),
  attendance_status TEXT CHECK (attendance_status IN ('present','absent','late','excused')),
  UNIQUE (attendance_session_id, student_id)
);

-- RLS POLICIES
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Student can only read own records" ON attendance_records
  FOR SELECT USING (student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()));`}</pre>
            </div>
          </div>
        )}

        {/* Tab 3: Setup Guide */}
        {activeTab === 'guide' && (
          <div className="space-y-2.5 text-slate-700">
            <h4 className="font-bold text-slate-900 text-sm">Deployment & Local Setup Instructions</h4>
            <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed">
              <li>
                <strong>Create Supabase Project:</strong> Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-blue-600 underline">supabase.com</a> and create a new project.
              </li>
              <li>
                <strong>Run Migration SQL:</strong> Open the Supabase SQL Editor and paste the contents of <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">src/db/schema.sql</code>.
              </li>
              <li>
                <strong>Configure Environment:</strong> Copy your project URL and <code className="font-mono">anon</code> key to <code className="font-mono">.env</code> or into this modal.
              </li>
              <li>
                <strong>Default Accounts:</strong>
                <ul className="list-disc pl-4 text-[11px] text-slate-500 mt-1">
                  <li>Admin & Faculty: <code className="font-mono">rajesh.sharma@cams.edu</code></li>
                  <li>Dean Admin: <code className="font-mono">dean.academics@cams.edu</code></li>
                  <li>Student: <code className="font-mono">aarav.patel@student.cams.edu</code></li>
                </ul>
              </li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};
