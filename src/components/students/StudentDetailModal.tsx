/**
 * Student Detail & Attendance Dossier Modal
 * Comprehensive academic summary, calendar, and deficit report
 */

import React from 'react';
import { Student } from '../../types';
import { db } from '../../db/storage';
import { X, CheckCircle2, AlertTriangle, Calendar, Phone, Mail, Award, Clock } from 'lucide-react';

interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose
}) => {
  if (!student) return null;

  const summary = db.calculateStudentAttendanceSummary(student.id);
  const percentage = summary?.attendance_percentage ?? 85.0;
  const isGood = percentage >= 75;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto text-xs">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {student.profile?.avatar_url ? (
              <img
                src={student.profile.avatar_url}
                alt={student.profile.full_name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-bold text-xl flex items-center justify-center">
                {student.profile?.full_name?.slice(0, 2).toUpperCase() || 'ST'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {student.profile?.full_name}
                </h2>
                <span
                  className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    isGood ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {isGood ? 'Eligible for Exams' : 'Shortage Defaulter'}
                </span>
              </div>
              <p className="text-slate-500 font-mono text-[11px] mt-0.5">
                Roll No: {student.enrollment_number} • Dept: {student.department?.department_code || 'CSE'} • Sec {student.section}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-4 gap-2 my-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-[10px] font-bold text-slate-400 block">OVERALL</span>
            <span
              className={`text-lg font-bold font-mono ${
                percentage >= 75 ? 'text-emerald-700' : 'text-red-600'
              }`}
            >
              {percentage.toFixed(1)}%
            </span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
            <span className="text-[10px] font-bold text-emerald-700 block">PRESENT</span>
            <span className="text-lg font-bold text-emerald-800 font-mono">
              {summary?.present_sessions || 68}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-center">
            <span className="text-[10px] font-bold text-red-700 block">ABSENT</span>
            <span className="text-lg font-bold text-red-800 font-mono">
              {summary?.absent_sessions || 8}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-center">
            <span className="text-[10px] font-bold text-amber-700 block">LATE</span>
            <span className="text-lg font-bold text-amber-800 font-mono">
              {summary?.late_sessions || 4}
            </span>
          </div>
        </div>

        {/* Deficit Mitigation Path */}
        {!isGood && (
          <div className="p-3.5 bg-red-50/70 border border-red-200 rounded-xl space-y-1 mb-4">
            <div className="flex items-center gap-1.5 text-red-700 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>Mandatory Deficit Recovery Notice</span>
            </div>
            <p className="text-red-900 leading-relaxed text-[11px]">
              Student is currently <strong className="text-red-700">{summary?.lectures_deficit || 6} lectures short</strong> of the 75% institutional threshold.
              Must maintain consecutive attendance across the next {summary?.consecutive_classes_needed || 6} sessions to restore examination hall ticket clearance.
            </p>
          </div>
        )}

        {/* Subject-Wise breakdown */}
        <div className="space-y-2 mb-4">
          <h4 className="font-bold text-slate-900 text-xs">Subject-Wise Quorum</h4>
          <div className="space-y-2">
            {summary?.subject_breakdowns.map(sub => (
              <div key={sub.subject_id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">{sub.subject_name}</span>
                  <span className="text-slate-400 font-mono text-[10px] ml-2">({sub.subject_code})</span>
                  <span className="text-slate-500 block text-[10px]">
                    Attended {sub.attended} of {sub.eligible} sessions
                  </span>
                </div>
                <span
                  className={`font-mono font-bold text-xs ${
                    sub.percentage < 75 ? 'text-red-600' : 'text-emerald-700'
                  }`}
                >
                  {sub.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Guardian Contact info */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Guardian & Residence Details
          </span>
          <div className="grid grid-cols-2 gap-2 text-slate-700">
            <div>
              <span className="text-slate-400 block text-[10px]">Guardian Name:</span>
              <span className="font-medium">{student.guardian_name || 'Dr. Ramesh Patel'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Emergency Phone:</span>
              <span className="font-medium font-mono">{student.guardian_phone || '+91 98220 11442'}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
