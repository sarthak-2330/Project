/**
 * Official Academic Disciplinary Undertaking Form Modal
 * Generates official compliance undertaking letter for shortage defaulters
 */

import React, { useState } from 'react';
import { X, FileText, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import { db } from '../../db/storage';

interface UndertakingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  enrollmentNumber?: string;
}

export const UndertakingFormModal: React.FC<UndertakingFormModalProps> = ({
  isOpen,
  onClose,
  studentName = 'Ishaan Verma',
  enrollmentNumber = '21CS004'
}) => {
  const [signed, setSigned] = useState(false);

  if (!isOpen) return null;

  const handleSign = () => {
    setSigned(true);
    db.addAuditLog({
      actor_profile_id: 'prof-rajesh-sharma',
      actor_name: 'Prof. Rajesh Sharma',
      action: 'ENDORSE_UNDERTAKING_FORM',
      entity_type: 'undertaking_forms',
      entity_id: `ut-${Date.now()}`,
      metadata: { student: studentName, enrollment: enrollmentNumber }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in text-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Academic Disciplinary Undertaking</h2>
              <p className="text-[11px] text-slate-500">Official Form CAMS-UT-2024 • Academic Regulations</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Official Letter Body */}
        <div className="my-4 p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 font-serif leading-relaxed text-slate-800">
          <div className="text-center border-b border-slate-200 pb-2">
            <h3 className="font-bold uppercase tracking-wider text-xs">
              Jawahar Education Society's Institute of Technology, Management & Research, Nashik
            </h3>
            <p className="text-[10px] text-slate-500 font-sans">
              Office of the Dean (Academic Affairs) & Department of Computer Science
            </p>
          </div>

          <p>
            I, <strong>{studentName}</strong>, bearing Enrollment Number <strong>#{enrollmentNumber}</strong>, 
            registered in Semester V Section A, hereby formally acknowledge that my cumulative attendance 
            currently stands at <span className="font-bold text-red-600">67.5%</span>, falling critically short 
            of the mandatory <strong>75.0% institutional requirement</strong> for mid-term and semester-end examination clearance.
          </p>

          <p>
            I recognize that I have a deficit of <strong>6 mandatory lectures</strong>. I solemnly undertake to attend all scheduled classes, laboratory sessions, 
            and remedial coaching modules without unexcused absence.
          </p>

          <p className="text-[11px] text-slate-600 font-sans">
            Failure to achieve the required 75.0% quota prior to the examination freeze date will result in the forfeiture of examination hall ticket clearance without further appeal.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-slate-700 font-sans text-[11px]">
            <div>
              <p className="font-bold">Student Signature:</p>
              <p className="italic text-slate-400 mt-2">{studentName} (Digitally Recorded)</p>
            </div>
            <div>
              <p className="font-bold">Faculty Advisor Endorsement:</p>
              {signed ? (
                <p className="text-emerald-700 font-bold flex items-center gap-1 mt-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Endorsed by Prof. Rajesh Sharma
                </p>
              ) : (
                <button
                  onClick={handleSign}
                  className="mt-1 px-3 py-1 rounded bg-blue-600 text-white font-semibold text-xs cursor-pointer hover:bg-blue-700"
                >
                  Endorse & Sign
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Undertaking</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold cursor-pointer"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};
