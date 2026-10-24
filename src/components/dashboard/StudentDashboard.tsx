/**
 * Student Dashboard & Academic Portal
 * Personalized view for enrolled students with attendance gauge,
 * subject breakdown, and correction request submission.
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { AttendanceStatus } from '../../types';
import { db } from '../../db/storage';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Send, 
  Clock, 
  Award, 
  BookOpen,
  X
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { studentSummaries, settings, refreshData } = useDatabase();

  // Find summary for logged-in student
  const studentSummary = studentSummaries.find(
    s => s.student.profile_id === currentUser?.id || s.student.profile?.email === currentUser?.email
  ) || studentSummaries[0];

  const student = studentSummary?.student;
  const percentage = studentSummary?.attendance_percentage ?? 88.4;
  const isEligible = percentage >= settings.attendance_threshold_percentage;
  const isWarning = percentage < settings.attendance_threshold_percentage && percentage >= settings.critical_threshold_percentage;
  const isCritical = percentage < settings.critical_threshold_percentage;

  // Correction Request State
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionSubject, setCorrectionSubject] = useState('CS-501: Operating Systems');
  const [correctionDate, setCorrectionDate] = useState('2024-10-23');
  const [correctionProposedStatus, setCorrectionProposedStatus] = useState<AttendanceStatus>('present');
  const [correctionReason, setCorrectionReason] = useState('');
  const [correctionToast, setCorrectionToast] = useState<string | null>(null);

  const handleSubmitCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionReason.trim()) return;

    db.submitCorrectionRequest({
      attendance_record_id: `rec-manual-${Date.now()}`,
      requested_by: currentUser?.id || 'student-demo',
      requested_status: correctionProposedStatus,
      reason: correctionReason,
      student_name: currentUser?.full_name || 'Student',
      subject_name: correctionSubject,
      attendance_date: correctionDate,
      previous_status: 'absent'
    });

    refreshData();
    setShowCorrectionModal(false);
    setCorrectionReason('');
    setCorrectionToast('Correction request submitted to Dean & Faculty for review!');
    setTimeout(() => setCorrectionToast(null), 3000);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto space-y-4 px-3 sm:px-4 pb-28">
      {/* Student Welcome Header */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {currentUser?.avatar_url ? (
            <img
              src={currentUser.avatar_url}
              alt={currentUser.full_name}
              className="w-13 h-13 rounded-2xl object-cover ring-2 ring-blue-100"
            />
          ) : (
            <div className="w-13 h-13 rounded-2xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center">
              {currentUser?.full_name?.slice(0, 2).toUpperCase() || 'ST'}
            </div>
          )}
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
              Student Academic Dossier
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
              {currentUser?.full_name || 'Aarav Patel'}
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              Roll No: {student?.enrollment_number || '21CS001'} • Sem {student?.section || 'V-A'}
            </p>
          </div>
        </div>

        {/* Exam Eligibility Badge */}
        <div className="shrink-0 flex flex-col items-end">
          {isEligible ? (
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Exam Clearance Active
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold flex items-center gap-1 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              Hall Ticket Withheld
            </span>
          )}
        </div>
      </div>

      {/* Primary Attendance Metric Gauge */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Main Gauge */}
        <div className="sm:col-span-2 bg-[#eff4ff] rounded-2xl p-5 border border-blue-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Cumulative Quorum
            </span>
            <span className="text-xs text-slate-500 font-medium">Gate: 75.0%</span>
          </div>

          <div className="my-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-blue-700 tabular-nums">
              {percentage.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-600 font-medium">
              ({studentSummary?.attended_sessions || 73} of {studentSummary?.total_eligible_sessions || 80} sessions attended)
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCritical ? 'bg-red-600' : isWarning ? 'bg-amber-500' : 'bg-emerald-600'
              }`}
              style={{ width: `${Math.min(100, percentage)}%` }}
            ></div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
            <span>Minimum Gate: 75%</span>
            {!isEligible && (
              <span className="text-red-600 font-bold">
                Requires {studentSummary?.consecutive_classes_needed || 2} consecutive attendances
              </span>
            )}
          </div>
        </div>

        {/* Quick Correction Action Card */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Official Workflow
            </span>
            <h3 className="text-sm font-bold text-slate-900 mt-1">Discrepancy Correction</h3>
            <p className="text-xs text-slate-500 mt-1">
              Missed attendance due to lab glitch or sports representation? Submit verified correction petition.
            </p>
          </div>

          <button
            onClick={() => setShowCorrectionModal(true)}
            className="mt-3 w-full h-10 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Petition Correction</span>
          </button>
        </div>
      </div>

      {/* Subject-Wise Breakdown Cards */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 px-1">Subject-Wise Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {studentSummary?.subject_breakdowns?.map(sub => (
            <div
              key={sub.subject_id}
              className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 font-mono block">
                    {sub.subject_code}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{sub.subject_name}</h4>
                </div>
                <span
                  className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                    sub.tier === 'critical'
                      ? 'bg-red-100 text-red-800'
                      : sub.tier === 'warning'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {sub.percentage}%
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    sub.tier === 'critical' ? 'bg-red-600' : sub.tier === 'warning' ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${Math.min(100, sub.percentage)}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Attended: {sub.attended} of {sub.eligible} lectures</span>
                <span className={sub.percentage < 75 ? 'text-red-600 font-semibold' : 'text-emerald-700 font-semibold'}>
                  {sub.percentage >= 75 ? 'Clear' : 'Warning'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Ledger */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 space-y-3">
        <h3 className="text-base font-bold text-slate-900">Recent Attendance Records</h3>
        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <div>
                <p className="font-bold text-slate-800">CS-501: Operating Systems (Lec #23)</p>
                <p className="text-[10px] text-slate-400">Wednesday, Oct 23 • 09:30 AM</p>
              </div>
            </div>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Present
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <div>
                <p className="font-bold text-slate-800">CS-504: Database Systems (Lec #21)</p>
                <p className="text-[10px] text-slate-400">Tuesday, Oct 22 • 11:00 AM</p>
              </div>
            </div>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Present
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <div>
                <p className="font-bold text-slate-800">CS-502: Computer Networks (Lec #19)</p>
                <p className="text-[10px] text-slate-400">Monday, Oct 21 • 01:00 PM</p>
              </div>
            </div>
            <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              Late (Recorded)
            </span>
          </div>
        </div>
      </div>

      {/* Correction Request Modal */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Attendance Correction Petition</h3>
              <button onClick={() => setShowCorrectionModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCorrection} className="space-y-3 mt-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                <select
                  value={correctionSubject}
                  onChange={(e) => setCorrectionSubject(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600"
                >
                  <option value="CS-501: Operating Systems">CS-501: Operating Systems</option>
                  <option value="CS-504: Database Systems">CS-504: Database Systems</option>
                  <option value="CS-502: Computer Networks">CS-502: Computer Networks</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Session Date</label>
                  <input
                    type="date"
                    value={correctionDate}
                    onChange={(e) => setCorrectionDate(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Claimed Status</label>
                  <select
                    value={correctionProposedStatus}
                    onChange={(e) => setCorrectionProposedStatus(e.target.value as AttendanceStatus)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600"
                  >
                    <option value="present">Present</option>
                    <option value="late">Late</option>
                    <option value="excused">Excused (Medical / Sports)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason & Supporting Evidence *</label>
                <textarea
                  rows={3}
                  required
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  placeholder="e.g. Card scanner beacon in LH-302 failed to read RFID card. Professor confirmed manual presence."
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCorrectionModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Submit for Dean's Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {correctionToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{correctionToast}</span>
        </div>
      )}
    </div>
  );
};
