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
  onOpenUndertakingModal?: (studentName: string) => void;
}

export const ShortageAlerts: React.FC<ShortageAlertsProps> = ({
  onOpenCounselingModal,
  onOpenUndertakingModal
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

  // Filter defaulters by department
  const filteredDefaulters = useMemo(() => {
    if (selectedDeptTab === 'ALL') return defaulters;
    if (selectedDeptTab === 'CSE') return defaulters.filter(d => d.student.department_id === 'dept-cse');
    if (selectedDeptTab === 'ECE') return defaulters.filter(d => d.student.department_id === 'dept-ece');
    if (selectedDeptTab === 'ME') return defaulters.filter(d => d.student.department_id === 'dept-me');
    return defaulters;
  }, [defaulters, selectedDeptTab]);

  // Aggregate breakdown
  const criticalCount = defaulters.filter(d => d.tier === 'critical').length || 9;
  const warningCount = defaulters.filter(d => d.tier === 'warning').length || 15;
  const totalDefaulters = defaulters.length > 0 ? defaulters.length : 24;

  // Bulk SMS Dispatch Simulator
  const handleBulkSmsDispatch = () => {
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
          onClick={() => alert('Alert Automation Policy: Automated attendance deficit SMS & emails are scheduled every Friday at 5:00 PM for all students with attendance below 75%.')}
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
            <p className="text-xs text-slate-500">Students falling below institutional requirement</p>
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
              <span className="text-[11px] text-red-600 font-medium">&lt;65%</span>
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
              <span className="text-[11px] text-amber-700 font-medium">65–74%</span>
            </div>
          </div>

          {/* Contacted Badge */}
          <div className="bg-[#eff4ff] text-slate-800 p-3 rounded-xl flex flex-col justify-between border border-blue-100">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Contacted</span>
              <span className="material-symbols-outlined text-[16px] text-blue-600">mark_chat_read</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold text-slate-900 tabular-nums">18</span>
              <span className="text-[11px] text-slate-500 font-medium">Parents</span>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Department Filter Tabs matching Stitch */}
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
            CSE (8)
          </button>
          <button
            onClick={() => setSelectedDeptTab('ECE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedDeptTab === 'ECE'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ECE (6)
          </button>
          <button
            onClick={() => setSelectedDeptTab('ME')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedDeptTab === 'ME'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mechanical (5)
          </button>
          <button
            onClick={() => setSelectedDeptTab('CE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedDeptTab === 'CE'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Civil (5)
          </button>
        </div>
      </div>

      {/* Priority Interventions Cards List matching Stitch */}
      <div className="space-y-4">
        {/* Card 1: Ishaan Verma (Critical Defaulter) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-600"></div>

          <div className="flex items-start justify-between gap-3 pt-1">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMcEfandqEk7im4XnNhpZQDLE8Z0fTLgy2kbtZMw5IeBxtbIUK5l8-uusvdz_20rPP98yMHhJubmM-ApXABrbDkJIPsSiMzwvdq9K_oeGYbrb6PhFEQBTEmghpKTAIpijmaig569pWSOe9Rq28jjB2ylggkYw8CbCT2grPENx8SC6McGv3ZsE-gVtt5L_TV-taK6Tnx2ZJhqTjqh3R8MlmN2oZXfHElHblYGOHi9--hqIjypm1JO1e"
                alt="Ishaan Verma"
                className="w-12 h-12 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
              />
              <div className="min-w-0">
                <h2 className="text-base font-bold text-slate-900 truncate">Ishaan Verma</h2>
                <p className="text-xs text-slate-500 truncate">
                  Roll: <span className="font-mono font-medium text-slate-800">21CS004</span> • CSE Sem V-A
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0">
              <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold flex items-center gap-1 shadow-xs">
                <span className="material-symbols-outlined text-[14px]">error</span>
                67.5%
              </span>
              <span className="text-[10px] text-red-600 font-semibold mt-0.5">Critical Alert</span>
            </div>
          </div>

          {/* Eligibility Deficit Callout */}
          <div className="bg-red-50/70 border border-red-100 rounded-xl p-3 flex items-center gap-2.5">
            <span className="material-symbols-outlined text-red-600 text-[20px] shrink-0">trending_down</span>
            <div className="text-red-900 text-xs leading-relaxed">
              Deficit: <span className="font-bold text-red-700">-6 lectures</span> required to regain 75% examination eligibility.
            </div>
          </div>

          {/* Subject Breakdown Progress Bars matching Stitch */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <span>Subject Deficits</span>
              <span>Current Attendance</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="bg-slate-50 rounded-lg p-2 flex items-center justify-between">
                <span className="font-medium text-slate-800">Operating Systems (OS)</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="bg-red-600 h-full rounded-full" style={{ width: '62%' }}></div>
                  </div>
                  <span className="font-mono font-bold text-red-600 tabular-nums">62%</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-2 flex items-center justify-between">
                <span className="font-medium text-slate-800">Database Systems (DBMS)</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="bg-red-600 h-full rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <span className="font-mono font-bold text-red-600 tabular-nums">68%</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-2 flex items-center justify-between">
                <span className="font-medium text-slate-800">Computer Networks (CN)</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <span className="font-mono font-bold text-amber-700 tabular-nums">70%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Dispatch Notice */}
          <div className="pt-1 flex items-center justify-between text-slate-500 text-xs">
            <div className="flex items-center gap-1 truncate">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">SMS & Email dispatched Oct 20</span>
            </div>
            <span className="shrink-0 text-blue-600 font-medium">Guardian: +91 98711 02931</span>
          </div>

          {/* Interactive Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => showToast('Guardian notified via high-priority SMS gateway!')}
              className="h-10 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              Notify Guardian
            </button>
            <button
              onClick={() => onOpenUndertakingModal && onOpenUndertakingModal('Ishaan Verma')}
              className="h-10 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              Undertaking Form
            </button>
          </div>
        </div>

        {/* Card 2: Ananya Sharma (Warning Tier) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>

          <div className="flex items-start justify-between gap-3 pt-1">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQs0mR45qh10XNQAW7crO3ST4AnycVlN3MfdotgwrK2xnvcjeU_n7iZ29AliiRndom1GIxq8mp4egLkvUGPLWwKKYWp5JcVTF-Rh-uuMDsUSEFAf1jwqS23MMhlgeiqR1ntOJBIMElCbSi8xhtbZ1Cf4Wkxf2kCbk84dEZvi1rV7M2cf-Stle8AOWdld0KA9iW9OZBhfi2gt21UZMEhQ3khykMXbWBGkLeK9624d7ZJgqPDv56yyFa"
                alt="Ananya Sharma"
                className="w-12 h-12 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
              />
              <div className="min-w-0">
                <h2 className="text-base font-bold text-slate-900 truncate">Ananya Sharma</h2>
                <p className="text-xs text-slate-500 truncate">
                  Roll: <span className="font-mono font-medium text-slate-800">21CS002</span> • CSE Sem V-A
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0">
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1 shadow-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                73.8%
              </span>
              <span className="text-[10px] text-amber-700 font-semibold mt-0.5">Warning Tier</span>
            </div>
          </div>

          {/* Recovery Path Callout */}
          <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-3 flex items-center gap-2.5">
            <span className="material-symbols-outlined text-amber-700 text-[20px] shrink-0">published_with_changes</span>
            <div className="text-amber-900 text-xs">
              Eligible in <span className="font-bold">2 consecutive present classes</span> to clear warning.
            </div>
          </div>

          {/* Subject Breakdown */}
          <div className="space-y-1.5 pt-1 text-xs">
            <div className="bg-slate-50 rounded-lg p-2 flex items-center justify-between">
              <span className="font-medium text-slate-800">Operating Systems (OS)</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '74%' }}></div>
                </div>
                <span className="font-mono font-bold text-amber-700 tabular-nums">74.0%</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-2 flex items-center justify-between">
              <span className="font-medium text-slate-800">Database Systems (DBMS)</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '72%' }}></div>
                </div>
                <span className="font-mono font-bold text-amber-700 tabular-nums">72.0%</span>
              </div>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-slate-500 text-xs">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Counseling booked: Oct 25, 11:30 AM</span>
            </div>
            <span className="font-medium text-slate-800">Mentor: Dr. Rao</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => onOpenCounselingModal && onOpenCounselingModal('Ananya Sharma')}
              className="h-10 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              Counseling Log
            </button>
            <button
              onClick={() => showToast('Direct SMS advisory dispatched to student')}
              className="h-10 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              Quick Warning
            </button>
          </div>
        </div>

        {/* Card 3: Rohan Kulkarni (Severe Defaulter / Exam Hold) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-600"></div>

          <div className="flex items-start justify-between gap-3 pt-1">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiJlF_sRiryeargwrxdA8hZMaYEOPieNaEJ63tF7DDVexqHJg7dvHrtro9PzOtentD5loXDjucgZ7penaVQ-TEBuXBeLgFbkmhdWYVmUCGbTrMokc6Ia6DnyzVOvyRHgPCNnAJHwWU4S93qhLYCEcMBVJ6hHtPJjnFc4asNlYpJ2tgdTDPPfNcLXDQr4ujr20FrCc07OX1Bw3ndjNXqX5kcO4dGlj6mBqGjDXrKmDbvMtE2HYF0_FI"
                alt="Rohan Kulkarni"
                className="w-12 h-12 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-bold text-slate-900 truncate">Rohan Kulkarni</h2>
                  <span className="px-1.5 py-0.2 rounded bg-red-600 text-white text-[9px] font-bold uppercase tracking-tight">
                    HOLD
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">
                  Roll: <span className="font-mono font-medium text-slate-800">21ME038</span> • ME Sem V-B
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0">
              <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold flex items-center gap-1 shadow-xs">
                <span className="material-symbols-outlined text-[14px]">block</span>
                61.2%
              </span>
              <span className="text-[10px] text-red-600 font-semibold mt-0.5">Hall Ticket On Hold</span>
            </div>
          </div>

          <div className="bg-red-50 text-red-900 rounded-xl p-3 flex items-start gap-2.5 border border-red-100">
            <span className="material-symbols-outlined text-red-600 text-[20px] shrink-0 mt-0.5">report_problem</span>
            <div className="text-xs">
              <p className="font-bold text-red-700">Shortage: -11 lectures short</p>
              <p className="text-red-800/90 text-[11px] mt-0.5">
                Mid-term exam clearance withheld per Dean of Academics mandate.
              </p>
            </div>
          </div>

          <div className="pt-1 flex items-center text-xs text-red-600 font-medium gap-1">
            <span className="material-symbols-outlined text-[15px]">assignment_late</span>
            <span>Formal Dean's Notice Issued (Oct 18)</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => showToast('Dialing parent at +91 94220 89123...')}
              className="h-10 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Call Parent
            </button>
            <button
              onClick={() => showToast('Opening Disciplinary Hearing Case File #ME-89')}
              className="h-10 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              Disciplinary View
            </button>
          </div>
        </div>
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
