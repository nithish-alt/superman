import React, { useState } from 'react';
import {
  ShieldAlert,
  Bell,
  Volume2,
  VolumeX,
  AlertTriangle,
  Flame,
  CheckCircle2,
  ChevronDown,
  UserCheck,
  PhoneCall,
  Menu,
  Clock,
  Play,
  Square,
  Upload,
  MapPin,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RoleSwitcherModal } from '../common/RoleSwitcherModal';

export const TopNavigation: React.FC = () => {
  const {
    userRole,
    emergencyStatus,
    setEmergencyStatus,
    isSirenPlaying,
    toggleSiren,
    isLiveDrillActive,
    drillElapsedSeconds,
    toggleLiveDrill,
    setActivePage,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const roleLabels: Record<string, { title: string; badgeColor: string }> = {
    CHAIRMAN: { title: 'Chairman / Administrator', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    TEACHER: { title: 'Faculty / Floor Marshal', badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    STUDENT: { title: 'Student (Class 11)', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  };

  const statusConfig = {
    Normal: {
      label: 'Normal Operation',
      sub: 'Preparedness Level 1',
      color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
    },
    Warning: {
      label: 'Weather Warning',
      sub: 'Preparedness Level 2',
      color: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      icon: AlertTriangle,
    },
    'Evacuation Active': {
      label: 'Evacuation Active',
      sub: 'High Alert Protocol',
      color: 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse',
      icon: Flame,
    },
  };

  const currentStatus = statusConfig[emergencyStatus];
  const StatusIcon = currentStatus.icon;

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <>
      <header className="h-16 bg-slate-900/95 border-b border-slate-800 backdrop-blur sticky top-0 z-30 px-3 lg:px-6 flex items-center justify-between gap-3">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActivePage('dashboard')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30 group-hover:bg-red-500 transition-colors">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight">SURAKSHA</span>
                <span className="text-[11px] font-semibold bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30">
                  CAMPUS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block truncate max-w-xs">
                Disaster Preparedness & Evacuation Management
              </p>
            </div>
          </button>
        </div>

        {/* Center/Right Actions: Real-Time Live Drill & Upload School Photo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Direct Button: Upload School Photo & Choose Points */}
          <button
            onClick={() => setActivePage('map-management')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 rounded-lg text-xs font-bold transition-all shadow-sm"
            title="Upload your school satellite photo & mark exit/assemble points"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>School Map & Points</span>
          </button>

          {/* REAL-TIME LIVE DRILL SIMULATION TOGGLE */}
          <button
            onClick={toggleLiveDrill}
            className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all border ${
              isLiveDrillActive
                ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-600/40 animate-pulse'
                : 'bg-slate-800/90 hover:bg-slate-750 text-slate-200 border-slate-700'
            }`}
            title="Start or Pause Real-Time Live Evacuation Drill Simulation"
          >
            {isLiveDrillActive ? (
              <>
                <Square className="w-3.5 h-3.5 fill-white" />
                <span className="font-mono">{formatTimer(drillElapsedSeconds)}</span>
                <span className="hidden md:inline text-[10px] uppercase tracking-wider">DRILL ACTIVE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                <span className="hidden sm:inline">LIVE DRILL</span>
              </>
            )}
          </button>

          {/* Emergency Siren Audio Button */}
          <button
            onClick={toggleSiren}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              isSirenPlaying
                ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-600/40 animate-pulse'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
            title="Toggle Campus Audio Siren Drill (Web Audio)"
          >
            {isSirenPlaying ? (
              <>
                <VolumeX className="w-4 h-4 text-white" />
                <span className="hidden md:inline">Siren On</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline">Siren</span>
              </>
            )}
          </button>

          {/* Emergency Status Indicator Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all ${currentStatus.color}`}
            >
              <StatusIcon className="w-4 h-4 shrink-0" />
              <div className="text-left hidden xl:block">
                <div className="leading-tight">{currentStatus.label}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {isStatusDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
                <div className="text-[11px] font-semibold uppercase text-slate-400 px-2 py-1">
                  Change Campus State
                </div>
                {(['Normal', 'Warning', 'Evacuation Active'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setEmergencyStatus(st);
                      setIsStatusDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      emergencyStatus === st ? 'bg-slate-800 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{statusConfig[st].label}</span>
                    {emergencyStatus === st && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick SOS Trigger Button */}
          <button
            onClick={() => setActivePage('sos')}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/30 transition-transform active:scale-95"
            title="Open Emergency SOS Interface"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
            <span>SOS</span>
          </button>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">Alerts & Live Feed</span>
                    <span className="text-xs font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                      {notifications.length}
                    </span>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 p-1">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No active alerts or notifications
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => markNotificationAsRead(item.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          item.isRead ? 'opacity-70 hover:bg-slate-800/40' : 'bg-slate-800/60 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-semibold text-white">{item.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">{item.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 line-clamp-2">{item.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Demo Role Switcher */}
          <button
            onClick={() => setIsRoleModalOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg text-left transition-all"
            title="Switch Demo Role"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 font-bold text-xs">
              {userRole[0]}
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-white leading-tight">
                {userRole === 'CHAIRMAN' ? 'Dr. Ramesh Sharma' : userRole === 'TEACHER' ? 'Mrs. Priya Nair' : 'Aryan Patel'}
              </div>
              <div className="text-[10px] text-slate-400">{roleLabels[userRole]?.title}</div>
            </div>
            <UserCheck className="w-3.5 h-3.5 text-slate-400 ml-1 hidden sm:block" />
          </button>
        </div>
      </header>

      {/* Role Switcher Modal */}
      {isRoleModalOpen && <RoleSwitcherModal onClose={() => setIsRoleModalOpen(false)} />}
    </>
  );
};
