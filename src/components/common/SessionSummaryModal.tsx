/**
 * Completed Lecture Session Summary Modal
 * Shows details of marked session with student attendance roster
 */

import React from 'react';
import { X, CheckCircle2, Clock, MapPin, ShieldCheck, Download } from 'lucide-react';
import { db } from '../../db/storage';

interface SessionSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId?: string;
}

export const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({
  isOpen,
  onClose,
  sessionId = 'session-cs504-22'
}) => {
  if (!isOpen) return null;

  const session = db.getAttendanceSessionById(sessionId) || {
    id: 'session-cs504-22',
    subject_assignment_id: 'assign-cs504-5b',
    attendance_date: '2024-10-24',
    session_number: 22,
    start_time: '11:00 AM',
    end_time: '12:00 PM',
    status: 'submitted',
    submitted_at: '2024-10-24T12:02:14Z',
    hash_signature: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    records_count: { total: 62, present: 58, absent: 4, late: 0 }
  };

  const sampleRoster = [
    { roll: '21CS001', name: 'Aarav Patel', status: 'present', timestamp: '11:04 AM (Beacon verified)' },
    { roll: '21CS002', name: 'Ananya Sharma', status: 'present', timestamp: '11:02 AM (Card scan)' },
    { roll: '21CS003', name: 'Devendra Singh', status: 'present', timestamp: '11:01 AM (Card scan)' },
    { roll: '21CS004', name: 'Ishaan Verma', status: 'absent', timestamp: 'Not Detected (Unexcused)' },
    { roll: '21CS005', name: 'Kavya Nair', status: 'present', timestamp: '11:00 AM (Beacon verified)' },
    { roll: '21CS006', name: 'Meera Krishnan', status: 'present', timestamp: '11:03 AM (Card scan)' },
    { roll: '21CS007', name: 'Pooja Hegde', status: 'present', timestamp: '11:01 AM (Beacon verified)' },
    { roll: '21CS014', name: 'Nikhil Saxena', status: 'absent', timestamp: 'Not Detected' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto text-xs">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Finalized & Locked
              </span>
              <span className="text-slate-400 font-mono text-[11px]">Lec #22</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              CS-504: Database Management Systems
            </h2>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Odd Term 2024–25 • Thursday, Oct 24, 2024 • Lab 2B
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quorum Metric Cards */}
        <div className="grid grid-cols-4 gap-2 my-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-[10px] font-bold text-slate-400 block">ENROLLED</span>
            <span className="text-lg font-bold text-slate-900">62</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
            <span className="text-[10px] font-bold text-emerald-700 block">PRESENT</span>
            <span className="text-lg font-bold text-emerald-800 font-mono">58</span>
          </div>
          <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-center">
            <span className="text-[10px] font-bold text-red-700 block">ABSENT</span>
            <span className="text-lg font-bold text-red-800 font-mono">4</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-center">
            <span className="text-[10px] font-bold text-blue-700 block">QUORUM</span>
            <span className="text-lg font-bold text-blue-800 font-mono">93.5%</span>
          </div>
        </div>

        {/* Cryptographic Signature Seal */}
        <div className="p-3 bg-[#eff4ff] border border-blue-100 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Cryptographic Integrity Verification
            </span>
            <span className="text-[10px] font-mono text-slate-400">SHA-256</span>
          </div>
          <p className="font-mono text-[10px] text-slate-600 break-all select-all">
            {session.hash_signature || 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'}
          </p>
          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
            <span>Marked by Prof. Rajesh Sharma</span>
            <span>Locked at 12:02 PM</span>
          </div>
        </div>

        {/* Student Records Roster Preview */}
        <div className="mt-4 space-y-2">
          <h4 className="font-bold text-slate-900 text-xs">Marked Cohort Sample</h4>
          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-48 overflow-y-auto">
            {sampleRoster.map(s => (
              <div key={s.roll} className="p-2.5 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{s.name}</span>
                    <span className="font-mono text-[10px] text-slate-400">#{s.roll}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{s.timestamp}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    s.status === 'present' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {s.status === 'present' ? 'Present' : 'Absent'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4 mt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold cursor-pointer"
          >
            Close Summary
          </button>
        </div>
      </div>
    </div>
  );
};
