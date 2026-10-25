/**
 * Academic Counseling & Mentorship Intervention Modal
 * Logs mentor meetings, action plans, and attendance commitments
 */

import React, { useState } from 'react';
import { X, Calendar, UserCheck, CheckCircle2, Plus } from 'lucide-react';
import { db } from '../../db/storage';

interface CounselingLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
}

export const CounselingLogModal: React.FC<CounselingLogModalProps> = ({
  isOpen,
  onClose,
  studentName = 'Ananya Sharma'
}) => {
  const [newNote, setNewNote] = useState('');
  const [logs, setLogs] = useState([
    {
      date: 'Oct 15, 2024',
      mentor: 'Dr. Priya Rao',
      notes: 'Reviewed Operating Systems attendance dip. Student noted lab timing clash with sports team practice. Agreed to attend remedial makeup sessions on Fridays.',
      actionPlan: 'Attend next 2 lectures consecutively to cross 75% gate.'
    },
    {
      date: 'Sep 28, 2024',
      mentor: 'Dr. Priya Rao',
      notes: 'Initial shortage alert advisory. Advised student on internal marks weighting.',
      actionPlan: 'Weekly attendance self-check via CAMS Portal.'
    }
  ]);
  const [toast, setToast] = useState(false);

  if (!isOpen) return null;

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setLogs([
      {
        date: 'Today, Oct 24, 2024',
        mentor: 'Dr. Priya Rao',
        notes: newNote.trim(),
        actionPlan: 'Follow-up scheduled for Oct 25, 11:30 AM.'
      },
      ...logs
    ]);

    db.addAuditLog({
      actor_profile_id: 'prof-priya-rao',
      actor_name: 'Dr. Priya Rao',
      action: 'RECORD_COUNSELING_INTERVENTION',
      entity_type: 'counseling_logs',
      entity_id: `counsel-${Date.now()}`,
      metadata: { student: studentName, note: newNote }
    });

    setNewNote('');
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in text-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Faculty Counseling & Mentoring Log</h2>
              <p className="text-[11px] text-slate-500">Mentee: {studentName} • Counselor: Dr. Priya Rao</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Note Form */}
        <form onSubmit={handleAddLog} className="my-4 space-y-2">
          <label className="block font-semibold text-slate-700">Add New Counseling Note & Intervention</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="e.g. Student committed to attending all remaining OS & DBMS lectures this week."
              className="flex-1 h-9 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Note</span>
            </button>
          </div>
          {toast && (
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Counseling intervention recorded in official dossier
            </span>
          )}
        </form>

        {/* Existing Logs */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 text-xs">Past Intervention Sessions</h4>
          {logs.map((log, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-[11px]">{log.mentor}</span>
                <span className="text-slate-400 font-mono text-[10px]">{log.date}</span>
              </div>
              <p className="text-slate-700 leading-relaxed">{log.notes}</p>
              <div className="pt-1 border-t border-slate-200 text-[11px] text-blue-700 font-semibold">
                Action Plan: {log.actionPlan}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4 mt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold cursor-pointer"
          >
            Close Log
          </button>
        </div>
      </div>
    </div>
  );
};
