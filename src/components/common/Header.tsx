/**
 * Application Header matching Google Stitch Design
 * Features CAMS emblem, notification center, profile modal,
 * and quick role-switcher.
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { 
  Bell, 
  CheckCircle2, 
  Database, 
  LogOut, 
  ShieldCheck, 
  User, 
  X
} from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
  onOpenSupabaseConfig?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle = 'CAMS Portal',
  onBack,
  showBack = false,
  onOpenSupabaseConfig,
  onNavigateTab
}) => {
  const { currentUser, role, loginAs, availableProfiles, signOut } = useAuth();
  const { notifications, unreadNotificationsCount, markNotificationRead, markAllNotificationsRead, isSupabaseLive } = useDatabase();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Logo asset from Stitch
  const CAMS_LOGO = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxfYWOHo_nPqu6BCWG9FJM6ZB6gsZ1Z88lu33TkTtRR3LaAhtGVmFYm204SWkzMXZMgd2eize42u5kiMtKPAQxK1vkxVhfz49JdsNgwhRXm-BEwKNj73_vQiEv3BIc_J5fUHy4Kq-0gT75bdRlIUKxpvsHGs8IqBDLDGliQKWTraKuYSa95P4NR6YRdEs2E6endxP-97jukGVOjlT5rOiqG0ngf6NWQYi1Mck4I-12o_Kdj05eBEE6';

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#f8f9ff]/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_8px_rgba(0,0,0,0.03)] pt-safe">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Left: Back Button / Logo & Titles */}
        <div className="flex items-center gap-2.5 min-w-0">
          {showBack && onBack ? (
            <button
              onClick={onBack}
              aria-label="Go Back"
              className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
          ) : null}

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigateTab && onNavigateTab('dashboard')}>
            <img
              src={CAMS_LOGO}
              alt="CAMS Emblem"
              className="h-8 w-auto object-contain shrink-0"
              onError={(e) => {
                // Fallback to high-contrast collegiate shield if external asset fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 leading-none">
                {subtitle}
              </span>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate leading-snug">
                {title}
              </h1>
            </div>
          </div>
        </div>

        {/* Center / Desktop Navigation shortcuts */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          <button
            onClick={() => onNavigateTab && onNavigateTab('dashboard')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 hover:text-blue-600 hover:bg-white transition-all"
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigateTab && onNavigateTab('attendance')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 hover:text-blue-600 hover:bg-white transition-all"
          >
            Roll Call
          </button>
          <button
            onClick={() => onNavigateTab && onNavigateTab('students')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 hover:text-blue-600 hover:bg-white transition-all"
          >
            Students
          </button>
          <button
            onClick={() => onNavigateTab && onNavigateTab('alerts')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 hover:text-blue-600 hover:bg-white transition-all"
          >
            Defaulters
          </button>
          <button
            onClick={() => onNavigateTab && onNavigateTab('reports')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 hover:text-blue-600 hover:bg-white transition-all"
          >
            Reports
          </button>
          <button
            onClick={() => onNavigateTab && onNavigateTab('dsa')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-blue-700 bg-blue-50/70 hover:bg-blue-100/70 transition-all"
          >
            DSA Lab
          </button>
        </div>

        {/* Right: Database Indicator, Notifications, Profile Avatar */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Supabase Status Button */}
          <button
            onClick={onOpenSupabaseConfig}
            title={isSupabaseLive ? 'Connected to live Supabase PostgreSQL' : 'Local Persistent Database (Click to configure Supabase)'}
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
              isSupabaseLive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isSupabaseLive ? 'Supabase Live' : 'Persistent Storage'}</span>
          </button>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              className="relative min-w-[42px] min-h-[42px] flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[17px] h-4 px-1 rounded-full bg-red-600 text-white text-[10px] font-bold leading-none animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">Notifications</span>
                    {unreadNotificationsCount > 0 && (
                      <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                        {unreadNotificationsCount} unread
                      </span>
                    )}
                  </div>
                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 my-1">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.action_url && onNavigateTab) {
                            onNavigateTab(n.action_url);
                            setShowNotifications(false);
                          }
                        }}
                        className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                          !n.read_at ? 'bg-blue-50/60 hover:bg-blue-50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <p className={`text-xs ${!n.read_at ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                            {n.title}
                          </p>
                          {!n.read_at && (
                            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar with dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="User Profile and Role Switcher"
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-200 transition-all"
            >
              <div className="relative">
                {currentUser?.avatar_url ? (
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.full_name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    {currentUser?.full_name ? currentUser.full_name.slice(0, 2).toUpperCase() : 'US'}
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
            </button>

            {/* Quick Role & Profile Switcher Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold overflow-hidden shrink-0">
                      {currentUser?.avatar_url ? (
                        <img src={currentUser.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        currentUser?.full_name?.slice(0, 2)
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{currentUser?.full_name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold uppercase">
                        {currentUser?.role === 'faculty' ? 'Admin & Faculty' : currentUser?.role}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setShowUserMenu(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Switch Account Quick Options for Evaluation */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1 mb-1">
                    Quick Role Switcher (Demo)
                  </span>
                  <div className="space-y-1">
                    {availableProfiles.slice(0, 4).map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          loginAs(p.id);
                          setShowUserMenu(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          currentUser?.id === p.id
                            ? 'bg-blue-50 text-blue-700 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="truncate">
                          <span className="block truncate font-medium">{p.full_name}</span>
                          <span className="text-[10px] text-slate-400 capitalize">{p.role}</span>
                        </div>
                        {currentUser?.id === p.id && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      onOpenSupabaseConfig && onOpenSupabaseConfig();
                      setShowUserMenu(false);
                    }}
                    className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Database className="w-3.5 h-3.5" />
                    DB Settings
                  </button>
                  <button
                    onClick={() => {
                      signOut();
                      setShowUserMenu(false);
                    }}
                    className="text-red-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
