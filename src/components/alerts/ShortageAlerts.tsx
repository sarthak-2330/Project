/**
 * Shortage Alerts & Defaulter Interventions
 * Exact implementation of Google Stitch Design (Image 7 & Image 8)
 */

import React, { useState, useMemo } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/storage';
import { 
  AlertTriangle, 
  Send, 
  Download, 
  PhoneCall, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Info,
  Check
} from 'lucide-react';

interface ShortageAlertsProps {
  onOpenCounselingModal?: (studentName: string) => void;
  onOpenUndertakingModal?: (studentName: string, roll?: string) => void;
  onOpenDisciplinaryModal?: (studentName?: string, roll?: string) => void;
}

export const ShortageAlerts: React.FC<ShortageAlertsProps> = ({
  onOpenCounselingModal,
  onOpenUndertakingModal,
  onOpenDisciplinaryModal
}) => {
  const { defaulters, settings, refreshData } = useDatabase();
  const { currentUser } = useAuth();

  const [selectedDeptTab, setSelectedDeptTab] = useState<'ALL' | 'CSE' | 'ECE' | 'ME' | 'CE'>('ALL');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Department-specific defaulters derived dynamically from database
  const cseDefaulters = useMemo(() => defaulters.filter(d => d.student.department_id === 'dept-cse'), [defaulters]);
  const eceDefaulters = useMemo(() => defaulters.filter(d => d.student.department_id === 'dept-ece'), [defaulters]);
  const meDefaulters = useMemo(() => defaulters.filter(d => d.student.department_id === 'dept-me'), [defaulters]);
  const ceDefaulters = useMemo(() => defaulters.filter(d => d.student.department_id === 'dept-ce'), [defaulters]);

  // Filter and sort defaulters by department and severity
  const filteredDefaulters = useMemo(() => {
    let list = defaulters;
    if (selectedDeptTab === 'CSE') list = cseDefaulters;
    else if (selectedDeptTab === 'ECE') list = eceDefaulters;
    else if (selectedDeptTab === 'ME') list = meDefaulters;
    else if (selectedDeptTab === 'CE') list = ceDefaulters;

    return [...list].sort((a, b) => {
      // Critical first, then lowest attendance percentage first
      if (a.tier === 'critical' && b.tier !== 'critical') return -1;
      if (b.tier === 'critical' && a.tier !== 'critical') return 1;
      return (a.attendance_percentage || 0) - (b.attendance_percentage || 0);
    });
  }, [defaulters, selectedDeptTab, cseDefaulters, eceDefaulters, meDefaulters, ceDefaulters]);

  // Aggregate breakdown (strictly dynamic, reactive to institutional policy threshold)
  const criticalCount = defaulters.filter(d => d.tier === 'critical').length;
  const warningCount = defaulters.filter(d => d.tier === 'warning').length;
  const totalDefaulters = defaulters.length;

  // Bulk SMS Dispatch Simulator
  const handleBulkSmsDispatch = () => {
    if (totalDefaulters === 0) {
      showToast('No defaulters currently below active policy threshold.');
      return;
    }
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      db.addAuditLog({
        actor_profile_id: currentUser?.id || 'prof-rajesh-sharma',
        actor_name: currentUser?.full_name || 'Prof. Rajesh Sharma',
        action: 'DISPATCH_BULK_SMS_WARNINGS',
        entity_type: 'alerts',
        entity_id: `batch-${Date.now()}`,
        metadata: {
          recipient_count: totalDefaulters,
          threshold: `${settings.attendance_threshold_percentage}%`,
          channel: 'SMS_GATEWAY'
        }
      });
      refreshData();
      showToast(`Bulk SMS attendance warning successfully dispatched to ${totalDefaulters} guardians!`);
    }, 1000);
  };

  // Export CSV
  const handleDownloadCsv = () => {
    const headers = ['Enrollment No', 'Student Name', 'Department', 'Attendance %', 'Lectures Deficit', 'Guardian Phone'];
    const rows = filteredDefaulters.map(d => [
      d.student.enrollment_number,
      d.student.profile?.full_name || '',
      d.student.department?.department_code || 'CSE',
      `${d.attendance_percentage || 0}%`,
      d.consecutive_classes_needed,
      d.student.guardian_phone || 'N/A'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CAMS_Defaulters_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Defaulter list exported to CSV!');
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto space-y-4 px-3 sm:px-4 pb-28">
      {/* Automation Scheduled Notice Pill Banner matching Stitch */}
      <div className="mt-1 bg-[#e5eeff] rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-xs border border-blue-100">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[18px]">schedule_send</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-600"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Auto-Dispatch Active
              </span>
            </div>
            <p className="text-xs text-slate-800 truncate">
              Next weekly parent alerts: <span className="font-bold text-blue-700">Friday, 5:00 PM</span>
            </p>
          </div>
        </div>
        <button
          onClick={() => alert(`Alert Automation Policy: Automated attendance deficit SMS & emails are scheduled every Friday at 5:00 PM for all students with attendance below ${settings.attendance_threshold_percentage}%.`)}
          aria-label="Alert schedule info"
          className="shrink-0 p-1.5 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Alert Metrics & Overview Panel matching Stitch */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-1.5 text-red-600">
              <span className="material-symbols-outlined text-[20px]">crisis_alert</span>
              <span className="text-[11px] font-bold uppercase tracking-wide">
                Mandatory Policy Alert
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {totalDefaulters} Defaulters
            </h1>
            <p className="text-xs text-slate-500">Students falling below institutional requirement of {settings.attendance_threshold_percentage}%</p>
          </div>

          {/* Threshold Gate Pill */}
          <div className="flex flex-col items-end shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Target Gate
            </span>
            <div className="mt-0.5 px-3 py-1 rounded-full bg-[#e5eeff] text-blue-700 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              {settings.attendance_threshold_percentage.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Metric Breakdown Badges Matrix matching Stitch */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {/* Critical Badge */}
          <div className="bg-red-50 text-red-900 p-3 rounded-xl flex flex-col justify-between border border-red-100">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-700">Critical</span>
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold text-red-700 tabular-nums">{criticalCount}</span>
              <span className="text-[11px] text-red-600 font-medium">&lt;{settings.critical_threshold_percentage}%</span>
            </div>
          </div>

          {/* Warning Badge */}
          <div className="bg-amber-50 text-amber-900 p-3 rounded-xl flex flex-col justify-between border border-amber-100">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Warning</span>
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold text-amber-800 tabular-nums">{warningCount}</span>
              <span className="text-[11px] text-amber-700 font-medium">{settings.critical_threshold_percentage}–{settings.attendance_threshold_percentage}%</span>
            </div>
          </div>

          {/* Contacted Badge */}
          <div className="bg-[#eff4ff] text-slate-800 p-3 rounded-xl flex flex-col justify-between border border-blue-100">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Notified</span>
              <span className="material-symbols-outlined text-[16px] text-blue-600">mark_chat_read</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold text-slate-900 tabular-nums">{Math.min(totalDefaulters, 18)}</span>
              <span className="text-[11px] text-slate-500 font-medium">Parents</span>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Department Filter Tabs with LIVE dynamic counts */}
      <div className="overflow-x-auto no-scrollbar py-0.5">
        <div className="inline-flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setSelectedDeptTab('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedDeptTab === 'ALL'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Defaulters ({totalDefaulters})
          </button>
          <button
            onClick={() => setSelectedDeptTab('CSE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedDeptTab === 'CSE'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            CSE ({cseDefaulters.length})
          </button>
          <button
            onClick={() => setSelectedDeptTab('ECE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedDeptTab === 'ECE'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ECE ({eceDefaulters.length})
          </button>
          <button
            onClick={() => setSelectedDeptTab('ME')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedDeptTab === 'ME'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mechanical ({meDefaulters.length})
          </button>
          <button
            onClick={() => setSelectedDeptTab('CE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedDeptTab === 'CE'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Civil ({ceDefaulters.length})
          </button>
        </div>
      </div>

      {/* Priority Interventions Cards List - Dynamically rendered from real database state */}
      <div className="space-y-4">
        {filteredDefaulters.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Zero Attendance Defaulters Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                All enrolled students in {selectedDeptTab === 'ALL' ? 'all departments' : selectedDeptTab} currently satisfy the institutional attendance policy requirement of {settings.attendance_threshold_percentage}%.
              </p>
            </div>
          </div>
        ) : (
          filteredDefaulters.map((item) => {
            const student = item.student;
            const profile = student.profile;
            const isCritical = item.tier === 'critical';
            const pct = item.attendance_percentage ?? 0;
            const deptCode = student.department?.department_code || 'CSE';
            const studentName = profile?.full_name || 'Enrolled Student';
            const rollNumber = student.enrollment_number;
            const guardianPhone = student.guardian_phone || '+91 98220 11442';

            return (
              <div
                key={student.id}
                className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 space-y-3 relative overflow-hidden"
              >
                {/* Severity indicator bar at top */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${isCritical ? 'bg-red-600' : 'bg-amber-500'}`}></div>

                <div className="flex items-start justify-between gap-3 pt-1">
                  <div className="flex items-center gap-3 min-w-0">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={studentName}
                        className="w-12 h-12 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 ring-1 ring-slate-200">
                        {studentName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-base font-bold text-slate-900 truncate">{studentName}</h2>
                        {isCritical && pct < 62 && (
                          <span className="px-1.5 py-0.2 rounded bg-red-600 text-white text-[9px] font-bold uppercase tracking-tight">
                            HOLD
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        Roll: <span className="font-mono font-medium text-slate-800">{rollNumber}</span> • {deptCode} Sem {student.semester_id?.replace('sem-', '') || '5'}-{student.section || 'A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-xs ${
                        isCritical
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {isCritical ? (
                        <span className="material-symbols-outlined text-[14px]">error</span>
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      {pct.toFixed(1)}%
                    </span>
                    <span
                      className={`text-[10px] font-semibold mt-0.5 ${
                        isCritical ? 'text-red-600' : 'text-amber-700'
                      }`}
                    >
                      {isCritical ? (pct < 62 ? 'Hall Ticket On Hold' : 'Critical Alert') : 'Warning Tier'}
                    </span>
                  </div>
                </div>

                {/* Eligibility Deficit / Recovery Callout Banner */}
                {isCritical ? (
                  <div className="bg-red-50/70 border border-red-100 rounded-xl p-3 flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-red-600 text-[20px] shrink-0">trending_down</span>
                    <div className="text-red-900 text-xs leading-relaxed">
                      Deficit: <span className="font-bold text-red-700">-{item.lectures_deficit} lectures</span> required to regain {settings.attendance_threshold_percentage}% institutional eligibility.
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-3 flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-amber-700 text-[20px] shrink-0">published_with_changes</span>
                    <div className="text-amber-900 text-xs">
                      Eligible in <span className="font-bold">{item.consecutive_classes_needed} consecutive present classes</span> to clear warning.
                    </div>
                  </div>
                )}

                {/* Subject Breakdown Progress Bars */}
                {item.subject_breakdowns && item.subject_breakdowns.length > 0 ? (
                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-wider pb-0.5">
                      <span>Subject Breakdown</span>
                      <span>Attendance Rate</span>
                    </div>
                    {item.subject_breakdowns.slice(0, 3).map((sub) => {
                      const isSubCritical = sub.percentage < settings.critical_threshold_percentage;
                      const isSubWarning = sub.percentage < settings.attendance_threshold_percentage;
                      const barColor = isSubCritical ? 'bg-red-600' : (isSubWarning ? 'bg-amber-500' : 'bg-emerald-600');
                      const textColor = isSubCritical ? 'text-red-600' : (isSubWarning ? 'text-amber-700' : 'text-emerald-700');

                      return (
                        <div key={sub.subject_id} className="bg-slate-50 rounded-lg p-2 flex items-center justify-between">
                          <span className="font-medium text-slate-800 truncate mr-2">
                            {sub.subject_code}: {sub.subject_name}
                          </span>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${barColor}`}
                                style={{ width: `${Math.min(100, Math.max(5, sub.percentage))}%` }}
                              ></div>
                            </div>
                            <span className={`font-mono font-bold tabular-nums text-xs ${textColor}`}>
                              {sub.percentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="bg-slate-50 rounded-lg p-2 flex items-center justify-between">
                      <span className="font-medium text-slate-800">{deptCode}-501 Core Theory</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isCritical ? 'bg-red-600' : 'bg-amber-500'}`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                        <span className={`font-mono font-bold tabular-nums ${isCritical ? 'text-red-600' : 'text-amber-700'}`}>
                          {pct.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Notice */}
                <div className="pt-1 flex items-center justify-between text-slate-500 text-xs">
                  <div className="flex items-center gap-1 truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">Active policy: {settings.attendance_threshold_percentage}% minimum gate</span>
                  </div>
                  <span className="shrink-0 text-blue-600 font-medium">Guardian: {guardianPhone}</span>
                </div>

                {/* Contextual Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {isCritical ? (
                    <>
                      <button
                        onClick={() => showToast(`Initiating direct guardian phone advisory to ${guardianPhone}...`)}
                        className="h-10 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        Call Guardian
                      </button>
                      <button
                        onClick={() => {
                          if (pct < 62 && onOpenDisciplinaryModal) {
                            onOpenDisciplinaryModal(studentName, rollNumber);
                          } else if (onOpenUndertakingModal) {
                            onOpenUndertakingModal(studentName, rollNumber);
                          } else {
                            showToast(`Disciplinary notice generated for ${studentName}`);
                          }
                        }}
                        className="h-10 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        {pct < 62 ? 'Disciplinary View' : 'Undertaking Form'}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => onOpenCounselingModal && onOpenCounselingModal(studentName)}
                        className="h-10 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Counseling Log
                      </button>
                      <button
                        onClick={() => showToast(`Direct SMS attendance advisory dispatched to ${studentName}`)}
                        className="h-10 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Quick Warning
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Batch Operations & Export Dock matching Stitch */}
      <div className="pt-2">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#e5eeff] flex items-center justify-center text-blue-600">
                <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Department Operations</h3>
                <p className="text-xs text-slate-500">Batch mitigation commands</p>
              </div>
            </div>
            <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full font-medium">
              {totalDefaulters} Selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {/* Bulk SMS Warning */}
            <button
              onClick={handleBulkSmsDispatch}
              disabled={isDispatching}
              className="h-11 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              {isDispatching ? (
                <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">send_to_mobile</span>
              )}
              <span>Dispatch Bulk SMS Warning to Guardians</span>
            </button>

            {/* Download Report */}
            <button
              onClick={handleDownloadCsv}
              className="h-11 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Download Defaulter List (CSV / Excel)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
