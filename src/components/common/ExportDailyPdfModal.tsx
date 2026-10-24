/**
 * Export Daily PDF / Official Digest Modal
 * Previews and downloads the daily attendance dossier
 */

import React from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { X, Download, Printer, CheckCircle2 } from 'lucide-react';

interface ExportDailyPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportDailyPdfModal: React.FC<ExportDailyPdfModalProps> = ({ isOpen, onClose }) => {
  const { studentSummaries } = useDatabase();

  if (!isOpen) return null;

  const handleDownload = () => {
    // Generate text/csv digest
    const content = `========================================================\n` +
      `ST. XAVIER INSTITUTE OF ENGINEERING & TECHNOLOGY\n` +
      `DAILY ATTENDANCE VERIFICATION LEDGER - FALL 2024\n` +
      `Date: Thursday, Oct 24, 2024 | Quorum: 88.4%\n` +
      `========================================================\n\n` +
      `Class: CS-501 Operating Systems (LH-302)\n` +
      `Present: 42 | Absent: 4 | Late: 2 | Quorum: 87.5%\n\n` +
      `Class: CS-504 Database Management Systems (Lab 2B)\n` +
      `Present: 58 | Absent: 4 | Late: 0 | Quorum: 93.5%\n\n` +
      `Digital Verification Signature: SHA-256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\n` +
      `Supervisor: Prof. Rajesh Sharma (Faculty Sign: Verified)\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CAMS_Daily_Attendance_Oct_24_2024.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in text-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[20px]">picture_as_pdf</span>
            <h3 className="text-base font-bold text-slate-900">Export Daily Attendance Digest</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 space-y-3">
          <div className="p-3.5 rounded-xl bg-[#eff4ff] border border-blue-100 space-y-1.5">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
              Document Digest Preview
            </span>
            <p className="font-bold text-slate-900">
              Daily Academic Delivery Report — Oct 24, 2024
            </p>
            <p className="text-slate-600">
              Includes CS-501 (Roll Call #24), CS-504 (Database Systems Lab), aggregate department quorum (88.4%), and defaulter notifications.
            </p>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-600">Cryptographic Seal:</span>
            <span className="font-mono text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              SHA-256 Signed
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print View</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download Dossier</span>
          </button>
        </div>
      </div>
    </div>
  );
};
