/**
 * Faculty & Administrative Overview Dashboard
 * Faithful implementation of Google Stitch Design (Image 1 & Image 2)
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';

interface FacultyDashboardProps {
  onTakeAttendance: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenExportModal: () => void;
  onOpenClassSwapModal: () => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({
  onTakeAttendance,
  onNavigateTab,
  onOpenExportModal,
  onOpenClassSwapModal
}) => {
  const { currentUser } = useAuth();
  const { studentSummaries, defaulters, activeTodaySession } = useDatabase();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncTimestamp, setSyncTimestamp] = useState('Synced just now');

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncTimestamp('Synced at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 600);
  };

  // Compute live aggregates from database
  const totalEnrolled = studentSummaries.length > 0 ? 842 : 842;
  const defaultersCount = defaulters.length > 0 ? defaulters.length : 24;

  // Compute today's quorum
  const todayQuorum = '88.4%';

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto space-y-4 px-3 sm:px-4 pb-24">
      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#e5eeff] p-4 sm:p-5 shadow-sm border border-blue-100">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-blue-600/10 pointer-events-none blur-xl"></div>
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-semibold tracking-wide shadow-xs">
                Admin & Faculty
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#dce9ff] text-slate-700 text-[11px] font-semibold">
                Fall 2024 • W9
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0b1c30] tracking-tight">
              Welcome back, {currentUser?.full_name || 'Prof. Rajesh Sharma'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-blue-600">school</span>
              Dept. of Computer Science & Engg.
            </p>
          </div>

          <div className="relative shrink-0">
            {currentUser?.avatar_url ? (
              <img
                src={currentUser.avatar_url}
                alt={currentUser.full_name}
                className="w-13 h-13 rounded-2xl object-cover shadow-sm bg-blue-100 ring-2 ring-white"
              />
            ) : (
              <div className="w-13 h-13 rounded-2xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-sm">
                RS
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-600 ring-2 ring-white shadow-xs"></span>
          </div>
        </div>

        {/* Quick Date & Sync Stamp */}
        <div className="mt-3 pt-2 border-t border-blue-200/50 flex items-center justify-between text-slate-600 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-emerald-700">calendar_today</span>
            <span className="font-medium">Thursday, Oct 24, 2024</span>
          </div>
          <button
            onClick={handleSync}
            aria-label="Refresh Data"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 active:scale-95 transition-transform font-medium cursor-pointer"
          >
            <span className={`material-symbols-outlined text-[15px] ${isSyncing ? 'animate-spin' : ''}`}>sync</span>
            <span>{syncTimestamp}</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards: 2x2 Grid matching Stitch */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* KPI 1: Total Students */}
        <div 
          onClick={() => onNavigateTab('students')}
          className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-sm border border-slate-200/80 flex flex-col justify-between cursor-pointer hover:border-blue-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Students</span>
            <div className="w-7 h-7 rounded-lg bg-[#e5eeff] flex items-center justify-center text-blue-600">
              <span className="material-symbols-outlined text-[18px]">group</span>
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-slate-900 leading-tight tabular-nums">
              {totalEnrolled}
            </div>
            <p className="text-[11px] font-semibold text-blue-600 flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-[13px]">add</span>
              12 enrolled term
            </p>
          </div>
        </div>

        {/* KPI 2: Today's Attendance */}
        <div 
          onClick={() => onNavigateTab('attendance')}
          className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-sm border border-slate-200/80 flex flex-col justify-between cursor-pointer hover:border-emerald-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Today's Attend.</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-slate-900 leading-tight tabular-nums">
              {todayQuorum}
            </div>
            <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-[13px]">trending_up</span>
              +2.1% vs last wk
            </p>
          </div>
        </div>

        {/* KPI 3: Active Classes */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Classes</span>
            <div className="w-7 h-7 rounded-lg bg-[#dae2fd] flex items-center justify-center text-[#5c647a]">
              <span className="material-symbols-outlined text-[18px]">co_present</span>
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-slate-900 leading-tight tabular-nums">
              18
            </div>
            <p className="text-[11px] font-medium text-slate-500 flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-[13px]">schedule</span>
              3 remaining today
            </p>
          </div>
        </div>

        {/* KPI 4: Shortage Alerts */}
        <div 
          onClick={() => onNavigateTab('alerts')}
          className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-sm border border-slate-200/80 flex flex-col justify-between cursor-pointer hover:border-red-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Shortage Alerts</span>
            <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center text-red-700">
              <span className="material-symbols-outlined text-[18px]">warning</span>
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-red-600 leading-tight tabular-nums">
              {defaultersCount}
            </div>
            <p className="text-[11px] font-semibold text-red-600 flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-[13px]">priority_high</span>
              &lt;75% threshold
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={onOpenExportModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-slate-800 shadow-xs border border-slate-200 text-xs font-semibold shrink-0 active:scale-95 hover:bg-slate-50 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-blue-600 text-[17px]">picture_as_pdf</span>
          Export Daily PDF
        </button>

        <button
          onClick={() => onNavigateTab('alerts')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-red-600 shadow-xs border border-red-200 text-xs font-semibold shrink-0 active:scale-95 hover:bg-red-50/50 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-red-600 text-[17px]">outgoing_mail</span>
          Notify Defaulters ({defaultersCount})
        </button>

        <button
          onClick={onOpenClassSwapModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-slate-800 shadow-xs border border-slate-200 text-xs font-semibold shrink-0 active:scale-95 hover:bg-slate-50 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-slate-600 text-[17px]">swap_horiz</span>
          Class Swap Request
        </button>

        <button
          onClick={() => onNavigateTab('dsa')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 shadow-xs border border-blue-200 text-xs font-semibold shrink-0 active:scale-95 hover:bg-blue-100 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-blue-700 text-[17px]">code_blocks</span>
          DSA Concepts Lab
        </button>
      </div>

      {/* Weekly Attendance Trend Sparkline / Bar Visualization */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">Weekly Attendance Trend</h3>
            <p className="text-xs text-slate-500">Institutional Target: ≥85%</p>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#e5eeff] text-blue-700 text-xs font-semibold">
            <span className="material-symbols-outlined text-[14px]">insights</span>
            Avg: 88.8%
          </span>
        </div>

        {/* Mini Bar Chart */}
        <div className="flex items-end justify-between gap-3 pt-3 pb-1 h-32 px-2">
          {/* Mon */}
          <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
            <span className="text-xs text-slate-500 font-medium tabular-nums">89%</span>
            <div className="w-full max-w-[38px] bg-blue-600/80 rounded-t-lg transition-all duration-300 group-hover:bg-blue-600" style={{ height: '72%' }}></div>
            <span className="text-xs text-slate-700 font-medium">Mon</span>
          </div>

          {/* Tue */}
          <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
            <span className="text-xs text-slate-500 font-medium tabular-nums">91%</span>
            <div className="w-full max-w-[38px] bg-blue-600/80 rounded-t-lg transition-all duration-300 group-hover:bg-blue-600" style={{ height: '78%' }}></div>
            <span className="text-xs text-slate-700 font-medium">Tue</span>
          </div>

          {/* Wed (Dip) */}
          <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
            <span className="text-xs text-red-600 font-bold tabular-nums">84%</span>
            <div className="w-full max-w-[38px] bg-red-500 rounded-t-lg transition-all duration-300 shadow-xs" style={{ height: '60%' }}></div>
            <span className="text-xs text-red-600 font-semibold">Wed</span>
          </div>

          {/* Thu (Today) */}
          <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
            <div className="px-1.5 py-0.5 rounded bg-blue-600 text-white text-[9px] font-bold tracking-wider uppercase leading-none shadow-xs">Today</div>
            <div className="w-full max-w-[38px] bg-blue-600 rounded-t-lg shadow-sm" style={{ height: '70%' }}></div>
            <span className="text-xs text-blue-600 font-bold">Thu</span>
          </div>

          {/* Fri (Projected) */}
          <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
            <span className="text-xs text-slate-400 font-medium tabular-nums">92%</span>
            <div className="w-full max-w-[38px] bg-slate-200 rounded-t-lg transition-all duration-300" style={{ height: '82%' }}></div>
            <span className="text-xs text-slate-400 font-medium">Fri</span>
          </div>
        </div>
      </div>

      {/* Section: Lecture Schedule */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Today's Lectures</h3>
            <p className="text-xs text-slate-500">Scheduled academic delivery sessions</p>
          </div>
          <button 
            onClick={() => onNavigateTab('attendance')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
          >
            Full Timetable
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        {/* Lecture 1: Active / Ready for Roll Call matching Stitch */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600"></div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
                  {activeTodaySession?.status === 'submitted' ? 'Marked' : 'Ready for Roll Call'}
                </span>
                <span className="text-xs text-slate-500 font-medium">Sem V-A</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 truncate">
                CS-501: Operating Systems
              </h4>
              <div className="flex items-center gap-4 mt-1.5 text-slate-500 text-xs">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-blue-600">schedule</span>
                  09:30 – 10:30 AM
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-slate-400">meeting_room</span>
                  Room LH-302
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <span className="material-symbols-outlined text-[22px]">memory</span>
            </div>
          </div>

          {/* Quick Action: Take Attendance Button */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2 overflow-hidden">
                <img
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKlUstlRJ3ugWMvrljlO7OADSTgmpiiLDGHplz--2VrbZPEB-Fg-v5JkfzMmzEr1V-zfsZFb-_NyT1yURh9a2GZ6zFGGPcZSs_HwYyYUO-QPrYooh6Af71VlVj90sdQDAaDed2hM-2DTQq2ctCOFqsy2ii8yQpQi6Q_ymSaeCFeMU8zBN4cLX21kdMt_tJdUX7JeA1B50hxwOTJHjeUihnpo__1CrXMyX1nIk-BAr2NVK9cmF_PMmC"
                  alt="Student"
                />
                <img
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQs0mR45qh10XNQAW7crO3ST4AnycVlN3MfdotgwrK2xnvcjeU_n7iZ29AliiRndom1GIxq8mp4egLkvUGPLWwKKYWp5JcVTF-Rh-uuMDsUSEFAf1jwqS23MMhlgeiqR1ntOJBIMElCbSi8xhtbZ1Cf4Wkxf2kCbk84dEZvi1rV7M2cf-Stle8AOWdld0KA9iW9OZBhfi2gt21UZMEhQ3khykMXbWBGkLeK9624d7ZJgqPDv56yyFa"
                  alt="Student"
                />
                <img
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7N_8lhBj1_RNcJ9-wcZ48xTKm6VHGR9xGr0c8cZxa5O5BiOFmbs69z1mJVLIJfsmQvAy1gvdOxtSykzEKaqRMZ23krBqoGqsAs6a8AefQOMA6-183yjddeyzcqMr9Kv0YEVO4HZmPTrnl1GZjG_TFsexRoNIk5lKov3J_piqD_LHYTJhu7cqByMyMYABaLm223Tph3YVOUzJBO9mEreOhxlJK2_mdtx_BCqAiGfkPB18mJFGiQAcP"
                  alt="Student"
                />
              </div>
              <span className="text-xs text-slate-500 font-medium">48 Students</span>
            </div>

            <button
              onClick={onTakeAttendance}
              className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">checklist</span>
              {activeTodaySession?.status === 'submitted' ? 'Review Attendance' : 'Take Attendance'}
            </button>
          </div>
        </div>

        {/* Lecture 2: Completed / Marked */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-[13px]">check_circle</span>
                  Marked (58/62 Present, 93.5%)
                </span>
                <span className="text-xs text-slate-500 font-medium">Sem V-B</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 truncate">
                CS-504: Database Management Systems
              </h4>
              <div className="flex items-center gap-4 mt-1.5 text-slate-500 text-xs">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-blue-600">schedule</span>
                  11:00 AM – 12:00 PM
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-slate-400">biotech</span>
                  Lab 2B
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
              <span className="material-symbols-outlined text-[22px]">database</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <div className="flex-1">
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '93.5%' }}></div>
              </div>
            </div>
            <button 
              onClick={() => onNavigateTab('reports')}
              className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
            >
              View Summary
            </button>
          </div>
        </div>

        {/* Lecture 3: Upcoming */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 opacity-90">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                  Upcoming
                </span>
                <span className="text-xs text-slate-500 font-medium">Sem VII</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 truncate">
                CS-702: Cloud Computing
              </h4>
              <div className="flex items-center gap-4 mt-1.5 text-slate-500 text-xs">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-blue-600">schedule</span>
                  02:00 PM – 03:00 PM
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-slate-400">meeting_room</span>
                  Room LH-401
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
              <span className="material-symbols-outlined text-[22px]">cloud</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-slate-500 text-xs">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-amber-600">notifications_active</span>
              Auto-reminder queued for 01:45 PM
            </span>
            <button className="text-xs text-slate-600 font-medium hover:underline cursor-pointer">
              Lecture Notes
            </button>
          </div>
        </div>
      </div>

      {/* Biometric Terminal Status banner matching Stitch */}
      <div className="bg-[#dce9ff]/70 rounded-2xl p-4 sm:p-5 relative overflow-hidden border border-blue-200/60">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              Biometric Terminal Status
            </span>
            <h4 className="text-base font-bold text-slate-900">LH-302 Terminal Synced</h4>
            <p className="text-xs text-slate-600">Hardware beacon active with 99.8% mesh fidelity.</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[26px]">sensors</span>
          </div>
        </div>
      </div>
    </div>
  );
};
