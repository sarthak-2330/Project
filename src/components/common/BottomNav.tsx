/**
 * Bottom Navigation Bar matching Google Stitch Reference
 * High-touch mobile bar with badge notifications and active indicators
 */

import React from 'react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  alertCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  alertCount = 5
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#f8f9ff]/90 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1">
        {/* Tab 1: Dashboard */}
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-all ${
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
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-all ${
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
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-all ${
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
          className={`relative flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-all ${
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
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-all ${
            activeTab === 'profile' || activeTab === 'academic' || activeTab === 'dsa'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
          <span className="text-[10px] font-medium leading-none">Profile</span>
        </button>
      </div>
    </nav>
  );
};
