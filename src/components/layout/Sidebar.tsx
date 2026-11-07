import React from 'react';
import { useApp } from '../../context/AppContext';
import { PageId } from '../../types';
import {
  LayoutDashboard,
  MapPin,
  Route,
  PhoneCall,
  BellRing,
  GraduationCap,
  Users,
  Activity,
  Globe2,
  Newspaper,
  MessageSquare,
  BookOpen,
  Settings,
  User,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

interface NavItemConfig {
  id: PageId;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
  badgeColor?: string;
  roles: Array<'CHAIRMAN' | 'TEACHER' | 'STUDENT'>;
  primaryFor?: Array<'CHAIRMAN' | 'TEACHER' | 'STUDENT'>;
}

export const Sidebar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    userRole,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    alerts,
    sosRequests,
  } = useApp();

  const activeAlertsCount = alerts.filter((a) => a.severity === 'Critical' || a.severity === 'High').length;
  const activeSosCount = sosRequests.filter((r) => r.status !== 'Resolved').length;

  const navItems: NavItemConfig[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['CHAIRMAN', 'TEACHER', 'STUDENT'],
    },
    {
      id: 'map-management',
      label: 'Upload Map & Points',
      icon: MapPin,
      roles: ['CHAIRMAN', 'TEACHER', 'STUDENT'],
      badge: 'Workbench',
      badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      primaryFor: ['CHAIRMAN', 'TEACHER', 'STUDENT'],
    },
    {
      id: 'evacuation',
      label: 'Evacuation Management',
      icon: Route,
      badge: 'Interactive',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
      roles: ['CHAIRMAN', 'TEACHER', 'STUDENT'],
      primaryFor: ['CHAIRMAN', 'TEACHER', 'STUDENT'],
    },
    {
      id: 'sos',
      label: 'SOS Emergency',
      icon: PhoneCall,
      badge: activeSosCount > 0 ? `${activeSosCount} Active` : '112',
      badgeColor: 'bg-red-500/20 text-red-300 border border-red-500/30',
      roles: ['CHAIRMAN', 'TEACHER', 'STUDENT'],
      primaryFor: ['STUDENT', 'TEACHER', 'CHAIRMAN'],
    },
    {
      id: 'alerts',
      label: 'Alert Management',
      icon: BellRing,
      badge: activeAlertsCount > 0 ? `${activeAlertsCount} New` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300',
      roles: ['CHAIRMAN', 'TEACHER', 'STUDENT'],
      primaryFor: ['CHAIRMAN', 'TEACHER'],
    },
    {
      id: 'student-tracking',
      label: 'Student Tracking',
      icon: GraduationCap,
      roles: ['CHAIRMAN', 'TEACHER', 'STUDENT'],
      primaryFor: ['CHAIRMAN', 'TEACHER'],
    },
    {
      id: 'teacher-tracking',
      label: 'Teacher Tracking',
      icon: Users,
      roles: ['CHAIRMAN', 'TEACHER'],
      primaryFor: ['CHAIRMAN'],
    },
    {
      id: 'disaster-monitoring',
      label: 'Disaster Monitoring',
      icon: Activity,
      badge: 'IMD',
      badgeColor: 'bg-blue-500/20 text-blue-300',
      roles: ['CHAIRMAN', 'TEACHER', 'STUDENT'],
    },
    {
      id: 'india-disasters',
      label: 'India Disaster Info',
      icon: Globe2,
      roles: ['CHAIRMAN', 'TEACHER', 'STUDENT'],
    },
    {
      id: 'disaster-news',
      label: 'Disaster News',
      icon: Newspaper,
      roles: ['CHAIRMAN', 'TEACHER', 'STUDENT'],
    },
    {
      id: 'messaging',
      label: 'Messaging',
      icon: MessageSquare,
      badge: 'Chat',
      badgeColor: 'bg-indigo-500/20 text-indigo-300',
      roles: ['CHAIRMAN', 'TEACHER', 'STUDENT'],
    },
    {
      id: 'safety-guides',
      label: 'Disaster Safety Guides',
      icon: BookOpen,
      roles: ['CHAIRMAN', 'TEACHER', 'STUDENT'],
      primaryFor: ['STUDENT', 'TEACHER'],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      roles: ['CHAIRMAN', 'TEACHER', 'STUDENT'],
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      roles: ['CHAIRMAN', 'TEACHER', 'STUDENT'],
    },
  ];

  // Filter items visible to role (or highlight role priorities)
  const visibleItems = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <aside
      className={`bg-slate-900 border-r border-slate-800 transition-all duration-200 z-20 flex flex-col justify-between shrink-0 ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top: Section Header */}
      <div>
        <div className="h-12 px-3 border-b border-slate-800 flex items-center justify-between text-slate-400">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Campus Navigator</span>
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors mx-auto"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="p-2 space-y-0.5 overflow-y-auto max-h-[calc(100vh-14rem)]">
          {visibleItems.map((item) => {
            const isActive = activePage === item.id;
            const Icon = item.icon;
            const isPrimary = item.primaryFor?.includes(userRole);

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                title={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : isPrimary ? 'text-blue-400' : 'text-slate-400'
                  }`}
                />
                {!isSidebarCollapsed && (
                  <div className="flex items-center justify-between w-full truncate">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ml-2 shrink-0 ${
                          isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Emergency Help Box */}
      {!isSidebarCollapsed && (
        <div className="p-3 m-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-md bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">India Emergency 112</div>
              <div className="text-[10px] text-slate-400">NDRF Helpline: 1078</div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Institutional disaster mock exercise. All communications logged for protocol review.
          </p>
        </div>
      )}
    </aside>
  );
};
