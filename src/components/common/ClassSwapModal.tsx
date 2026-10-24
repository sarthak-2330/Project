/**
 * Class Swap Request Modal
 * Allows faculty to petition timetable lecture substitutions with peer professors
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { db } from '../../db/storage';
import { X, CheckCircle2, RefreshCw } from 'lucide-react';

interface ClassSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClassSwapModal: React.FC<ClassSwapModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { faculty, refreshData } = useDatabase();

  const [fromSubject, setFromSubject] = useState('CS-501: Operating Systems');
  const [targetFaculty, setTargetFaculty] = useState('Dr. Priya Rao');
  const [swapDate, setSwapDate] = useState('2024-10-25');
  const [reason, setReason] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.addAuditLog({
      actor_profile_id: currentUser?.id || 'prof-rajesh-sharma',
      actor_name: currentUser?.full_name || 'Prof. Rajesh Sharma',
      action: 'SUBMIT_CLASS_SWAP_REQUEST',
      entity_type: 'timetable_swap',
      entity_id: `swap-${Date.now()}`,
      metadata: {
        fromSubject,
        targetFaculty,
        swapDate,
        reason
      }
    });

    db.addNotification({
      recipient_profile_id: 'admin-dean-thorne',
      title: 'Class Swap Petition Submitted',
      message: `${currentUser?.full_name || 'Prof. Rajesh Sharma'} requested class swap with ${targetFaculty} for ${fromSubject} on ${swapDate}.`,
      notification_type: 'system',
      action_url: 'dashboard'
    });

    refreshData();
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in text-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[20px]">swap_horiz</span>
            <h3 className="text-base font-bold text-slate-900">Class Swap Request</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">Swap Petition Registered</h4>
            <p className="text-slate-500">Notice dispatched to {targetFaculty} & Dean of Academics.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 mt-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Assigned Class</label>
              <select
                value={fromSubject}
                onChange={(e) => setFromSubject(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600"
              >
                <option value="CS-501: Operating Systems (LH-302, 09:30 AM)">
                  CS-501: Operating Systems (LH-302, 09:30 AM)
                </option>
                <option value="CS-504: Database Systems (Lab 2B, 11:00 AM)">
                  CS-504: Database Systems (Lab 2B, 11:00 AM)
                </option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Substitute Faculty Member</label>
              <select
                value={targetFaculty}
                onChange={(e) => setTargetFaculty(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600"
              >
                <option value="Dr. Priya Rao">Dr. Priya Rao (Computer Networks)</option>
                <option value="Prof. Vikram Seth">Prof. Vikram Seth (Electronics)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Swap Date</label>
              <input
                type="date"
                required
                value={swapDate}
                onChange={(e) => setSwapDate(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Academic Rationale *</label>
              <textarea
                rows={2}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Presiding over Final-Year Capstone Project Evaluation Committee."
                className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer"
              >
                Submit Petition
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
