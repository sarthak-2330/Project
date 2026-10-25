/**
 * Student QR Scanner & RFID Beacon Reader Modal
 * Simulates card tap and camera barcode scanning for instant student dossier retrieval
 */

import React, { useState } from 'react';
import { X, QrCode, Search, CheckCircle2, User } from 'lucide-react';
import { db } from '../../db/storage';
import { Student } from '../../types';

interface StudentQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentIdentified: (student: Student) => void;
}

export const StudentQrScannerModal: React.FC<StudentQrScannerModalProps> = ({
  isOpen,
  onClose,
  onStudentIdentified
}) => {
  const [scannedCode, setScannedCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulateScan = (roll: string) => {
    const student = db.getStudentByEnrollmentNumber(roll);
    if (student) {
      onStudentIdentified(student);
      onClose();
    } else {
      setError(`No student record mapped to tag #${roll}`);
    }
  };

  const handleManualScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedCode.trim()) return;
    handleSimulateScan(scannedCode.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in text-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Student ID & RFID Scanner</h2>
              <p className="text-[11px] text-slate-500">Scan digital university badge or enter roll number</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder animation */}
        <div className="my-4 relative bg-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center text-center overflow-hidden border-2 border-dashed border-blue-400/40">
          <div className="w-28 h-28 border-2 border-blue-500 rounded-xl relative flex items-center justify-center mb-3">
            <QrCode className="w-16 h-16 text-blue-400/50" />
            <div className="absolute inset-x-0 top-0 h-0.5 bg-blue-400 animate-pulse"></div>
          </div>
          <p className="text-slate-300 font-medium text-xs">Simulating Optical Camera Viewfinder</p>
          <span className="text-[10px] text-slate-400 mt-1">Tap a preset student badge below for instant lookup</span>
        </div>

        {/* Quick tap sample badges */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Test Digital Badges
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleSimulateScan('21CS001')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left transition-all cursor-pointer"
            >
              <p className="font-bold text-slate-900">Aarav Patel</p>
              <span className="text-[10px] text-slate-400 font-mono">#21CS001 (91.2%)</span>
            </button>
            <button
              onClick={() => handleSimulateScan('21CS002')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-left transition-all cursor-pointer"
            >
              <p className="font-bold text-slate-900">Ananya Sharma</p>
              <span className="text-[10px] text-amber-600 font-mono">#21CS002 (73.8%)</span>
            </button>
            <button
              onClick={() => handleSimulateScan('21CS004')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-red-400 hover:bg-red-50/50 text-left transition-all cursor-pointer"
            >
              <p className="font-bold text-slate-900">Ishaan Verma</p>
              <span className="text-[10px] text-red-600 font-mono">#21CS004 (67.5%)</span>
            </button>
            <button
              onClick={() => handleSimulateScan('21ME038')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-red-400 hover:bg-red-50/50 text-left transition-all cursor-pointer"
            >
              <p className="font-bold text-slate-900">Rohan Kulkarni</p>
              <span className="text-[10px] text-red-600 font-mono">#21ME038 (61.2%)</span>
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-600 text-xs mt-2 font-medium">{error}</p>
        )}

        <form onSubmit={handleManualScanSubmit} className="mt-3 flex gap-2">
          <input
            type="text"
            value={scannedCode}
            onChange={(e) => setScannedCode(e.target.value)}
            placeholder="Or type enrollment roll..."
            className="flex-1 h-9 px-3 rounded-xl border border-slate-200 font-mono uppercase focus:outline-none focus:border-blue-600"
          />
          <button
            type="submit"
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer"
          >
            Lookup
          </button>
        </form>
      </div>
    </div>
  );
};
