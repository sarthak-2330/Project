/**
 * Bottom Navigation Bar matching Google Stitch Reference
 * High-touch mobile bar with role-aware view switches.
 */

import React from 'react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  alertCount?: number;
  isStudent?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  alertCount = 5,
  isStudent = false
}) => {
  if (isStudent) {
    return (
      <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#f8f9ff]/90 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-around h-16 max-w-md mx-auto px-1">
          {/* Student Tab 1: My Dossier */}
          <button
            onClick={() => onTabChange('dashboard')}
            className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">assignment_ind</span>
            <span className="text-[10px] font-medium leading-none">My Dossier</span>
          </button>

          {/* Student Tab 2: Academic Subjects */}
          <button
            onClick={() => onTabChange('academics')}
            className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
              activeTab === 'academics'
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">menu_book</span>
            <span className="text-[10px] font-medium leading-none">Subjects</span>
          </button>

          {/* Student Tab 3: DSA Lab */}
          <button
            onClick={() => onTabChange('dsa')}
            className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
              activeTab === 'dsa'
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">code</span>
            <span className="text-[10px] font-medium leading-none">DSA Lab</span>
          </button>

          {/* Student Tab 4: Student Profile */}
          <button
            onClick={() => onTabChange('profile')}
            className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">account_circle</span>
            <span className="text-[10px] font-medium leading-none">My Account</span>
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#f8f9ff]/90 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1">
        {/* Tab 1: Dashboard */}
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
            activeTab === 'dashboard'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">grid_view</span>
          <span className="text-[10px] font-medium leading-none">Dashboard</span>
        </button>

        {/* Tab 2: Attendance / Roll Call */}
        <button
          onClick={() => onTabChange('attendance')}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
            activeTab === 'attendance'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">fact_check</span>
          <span className="text-[10px] font-medium leading-none">Attendance</span>
        </button>

        {/* Tab 3: Students */}
        <button
          onClick={() => onTabChange('students')}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
            activeTab === 'students'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">groups</span>
          <span className="text-[10px] font-medium leading-none">Students</span>
        </button>

        {/* Tab 4: Alerts / Defaulters */}
        <button
          onClick={() => onTabChange('alerts')}
          className={`relative flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
            activeTab === 'alerts'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">warning</span>
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-[15px] h-3.5 px-0.5 rounded-full bg-red-600 text-white text-[9px] font-bold leading-none">
                {alertCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium leading-none">Alerts</span>
        </button>

        {/* Tab 5: Profile / Management */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
            activeTab === 'profile' || activeTab === 'academic'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
          <span className="text-[10px] font-medium leading-none">Settings</span>
        </button>
      </div>
    </nav>
  );
};
