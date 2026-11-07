import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  ShieldAlert,
  GraduationCap,
  Users,
  CheckCircle2,
  X,
  Upload,
  Radio,
  MapPin,
  HeartHandshake,
  BookOpen,
} from 'lucide-react';

interface RoleSwitcherModalProps {
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ onClose }) => {
  const { userRole, setUserRole, setActivePage } = useApp();

  const roles: Array<{
    id: UserRole;
    title: string;
    subtitle: string;
    badge: string;
    icon: typeof ShieldAlert;
    accentColor: string;
    borderActive: string;
    capabilities: string[];
    defaultLanding: string;
  }> = [
    {
      id: 'CHAIRMAN',
      title: 'Chairman / Administrator',
      subtitle: 'Dr. Ramesh Sharma · Emergency Incident Commander',
      badge: 'Full Command Privileges',
      icon: ShieldAlert,
      accentColor: 'from-amber-500/20 to-red-500/10 text-amber-300',
      borderActive: 'border-amber-500 ring-2 ring-amber-500/30',
      capabilities: [
        'Upload & calibrate school satellite image map',
        'Mark and edit Exit Gates & Assembly Points',
        'Activate Campus Evacuation Modes (EXIT & ASSEMBLY)',
        'Broadcast critical alerts to students & faculty',
        'Monitor live student & teacher evacuation status',
        'Review and dispatch incoming SOS requests',
      ],
      defaultLanding: 'dashboard',
    },
    {
      id: 'TEACHER',
      title: 'Teacher / Floor Marshal',
      subtitle: 'Mrs. Priya Nair · Senior Faculty & Block A Lead',
      badge: 'Evacuation Marshal',
      icon: Users,
      accentColor: 'from-blue-500/20 to-indigo-500/10 text-blue-300',
      borderActive: 'border-blue-500 ring-2 ring-blue-500/30',
      capabilities: [
        'Receive real-time disaster alerts & siren warnings',
        'Follow interactive safe evacuation routes',
        'Track assigned cohort (68 Students, Class 11)',
        'Update student safety & roll-call status with 1 click',
        'Report missing or injured students to control desk',
        'Coordinate directly in Marshals & Faculty chat',
      ],
      defaultLanding: 'student-tracking',
    },
    {
      id: 'STUDENT',
      title: 'Student (Class 11)',
      subtitle: 'Aryan Patel · Roll #DPS-2026-0941',
      badge: 'Student Safety Portal',
      icon: GraduationCap,
      accentColor: 'from-emerald-500/20 to-teal-500/10 text-emerald-300',
      borderActive: 'border-emerald-500 ring-2 ring-emerald-500/30',
      capabilities: [
        'Access interactive school satellite evacuation map',
        'Follow clear directional arrows to safety zones',
        'One-click "Confirm My Safety" button to check in',
        'Red SOS Emergency assistance button with GPS',
        'Send urgent messages to class teacher & safety team',
        'Study simple Indian disaster guides (Flood, Fire, etc.)',
      ],
      defaultLanding: 'evacuation',
    },
  ];

  const handleSelectRole = (role: UserRole) => {
    setUserRole(role);
    // Switch to appropriate initial view if appropriate
    if (role === 'STUDENT') {
      setActivePage('evacuation');
    } else if (role === 'TEACHER') {
      setActivePage('student-tracking');
    } else {
      setActivePage('dashboard');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">Select Demo User Role</span>
              <span className="text-xs bg-red-600/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded font-mono">
                Interactive Persona Mode
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Switch roles to experience how the Chairman, Teachers, and Students interact with the emergency system.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto">
          {roles.map((r) => {
            const isSelected = userRole === r.id;
            const Icon = r.icon;

            return (
              <div
                key={r.id}
                onClick={() => handleSelectRole(r.id)}
                className={`cursor-pointer rounded-xl border p-5 transition-all flex flex-col justify-between hover:scale-[1.01] ${
                  isSelected
                    ? `${r.borderActive} bg-slate-800/90 shadow-xl`
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.accentColor} flex items-center justify-center border border-white/10`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    {isSelected ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">{r.badge}</span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white mb-0.5">{r.title}</h3>
                  <p className="text-xs text-slate-400 mb-4">{r.subtitle}</p>

                  <div className="space-y-2 border-t border-slate-800 pt-3">
                    <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                      Role Privileges
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {r.capabilities.map((cap, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-blue-400 shrink-0 mt-0.5">·</span>
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectRole(r.id);
                    }}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {isSelected ? 'Currently Selected' : `Switch to ${r.title.split('/')[0]}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info note */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Local demo state is synchronized across all three personas simultaneously.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
