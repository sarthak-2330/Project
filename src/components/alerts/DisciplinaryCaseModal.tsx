/**
 * Disciplinary Hearing & Exam Hold Case File Modal
 * Official Dean of Academics review dossier for critical shortage cases
 */

import React, { useState } from 'react';
import { X, ShieldAlert, AlertTriangle, CheckCircle2, FileText, Lock } from 'lucide-react';
import { db } from '../../db/storage';

interface DisciplinaryCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  enrollmentNumber?: string;
}

export const DisciplinaryCaseModal: React.FC<DisciplinaryCaseModalProps> = ({
  isOpen,
  onClose,
  studentName = 'Rohan Kulkarni',
  enrollmentNumber = '21ME038'
}) => {
  const [actionDone, setActionDone] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGrantProvisionalClearance = () => {
    setActionDone('Provisional clearance granted on condition of 100% attendance in remaining 14 sessions.');
    db.addAuditLog({
      actor_profile_id: 'admin-dean-thorne',
      actor_name: 'Dr. Aris Thorne (Dean of Academics)',
      action: 'GRANT_PROVISIONAL_EXAM_CLEARANCE',
      entity_type: 'students',
      entity_id: enrollmentNumber,
      metadata: { student: studentName, resolution: 'CONDITIONAL_PROVISIONAL' }
    });
  };

  const handleUpholdHold = () => {
    setActionDone('Hall Ticket Withholding confirmed. Case forwarded to Academic Disciplinary Board.');
    db.addAuditLog({
      actor_profile_id: 'admin-dean-thorne',
      actor_name: 'Dr. Aris Thorne (Dean of Academics)',
      action: 'UPHOLD_EXAM_WITHHOLDING',
      entity_type: 'students',
      entity_id: enrollmentNumber,
      metadata: { student: studentName, resolution: 'UPHELD_WITHHOLDING' }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in text-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-700">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Dean's Disciplinary Review Case File</h2>
                <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono font-bold text-[9px]">
                  HOLD
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Case #DISC-2024-ME-038 • Respondent: {studentName} ({enrollmentNumber})</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 space-y-3">
          {/* Status Alert Banner */}
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-red-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Examination Clearance Withheld
              </span>
              <span className="font-mono font-bold text-red-700">61.2% Attendance</span>
            </div>
            <p className="text-red-800 text-[11px]">
              Shortage exceeds maximum permissible discretionary waiver limit (11 lectures short). Mid-term examination entry barred per Dean mandate issued Oct 18, 2024.
            </p>
          </div>

          {/* Timeline of Notices */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs">Procedural Timeline & Notice History</h4>
            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
              <div className="p-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">Formal Dean's Show-Cause Notice Dispatched</span>
                  <span className="text-slate-400 block text-[10px]">Notice delivered via registered post & registered email to parent</span>
                </div>
                <span className="font-mono text-slate-500 text-[10px]">Oct 18, 2024</span>
              </div>

              <div className="p-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">Parent Telephonic Inquiry</span>
                  <span className="text-slate-400 block text-[10px]">Guardian contacted at +91 94220 89123. Acknowledged illness leave request</span>
                </div>
                <span className="font-mono text-slate-500 text-[10px]">Oct 19, 2024</span>
              </div>

              <div className="p-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">Medical Certificate Scrutiny</span>
                  <span className="text-slate-400 block text-[10px]">Civil Hospital OP slip verified by Campus Chief Medical Officer</span>
                </div>
                <span className="font-mono text-slate-500 text-[10px]">Oct 22, 2024</span>
              </div>
            </div>
          </div>

          {actionDone && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-medium">
              {actionDone}
            </div>
          )}

          {/* Dean Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={handleGrantProvisionalClearance}
              className="h-10 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Grant Provisional Hall Ticket</span>
            </button>
            <button
              onClick={handleUpholdHold}
              className="h-10 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Lock className="w-4 h-4" />
              <span>Uphold Examination Hold</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold cursor-pointer"
          >
            Close Case File
          </button>
        </div>
      </div>
    </div>
  );
};
