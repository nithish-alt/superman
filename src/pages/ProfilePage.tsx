import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RoleSwitcherModal } from '../components/common/RoleSwitcherModal';
import {
  User,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Users,
  ShieldAlert,
  Phone,
  Heart,
  AlertCircle,
  Clock,
  Compass,
  ArrowRight,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    userRole,
    students,
    teachers,
    confirmStudentSafetyQuickAction,
  } = useApp();

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [safetyCheckedFeedback, setSafetyCheckedFeedback] = useState(false);

  // Derive active persona information
  let persona = {
    name: 'Dr. Ramesh Sharma',
    roleTitle: 'Chairman & Incident Commander',
    id: 'ADMIN-CMD-001',
    organization: 'Delhi Public School & Junior Science College (South Campus)',
    phone: '+91 98200 12345',
    email: 'chairman.sharma@dps-campus.edu.in',
    bloodGroup: 'B+',
    emergencyContact: '+91 98200 99881 (Emergency Control Room)',
    assignedDuties: 'Incident Commander, Broadcast Authorizer, Satellite Cadastre Lead',
    medicalAlert: 'None',
    status: 'Command Active',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  };

  if (userRole === 'TEACHER') {
    const t = teachers[0];
    persona = {
      name: t.name,
      roleTitle: 'Senior Faculty & Lead Floor Marshal',
      id: t.employeeId,
      organization: 'Science Department (Block A)',
      phone: t.phone,
      email: 'priya.nair@dps-campus.edu.in',
      bloodGroup: 'A+',
      emergencyContact: '+91 98450 99882 (Family / Staff Liaison)',
      assignedDuties: `Floor Marshal Block A · Guiding ${t.assignedGroup} (${t.studentCount} students)`,
      medicalAlert: 'Carries emergency Asthma inhaler kit',
      status: t.evacuationStatus,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    };
  } else if (userRole === 'STUDENT') {
    const s = students[0];
    persona = {
      name: s.name,
      roleTitle: 'Student (Class 11 Science)',
      id: s.studentId,
      organization: 'Senior Secondary Wing',
      phone: s.phone,
      email: 'aryan.patel@student.dps-campus.edu.in',
      bloodGroup: s.bloodGroup,
      emergencyContact: `${s.parentPhone} (Parents)`,
      assignedDuties: 'Student Safety Captain (Section A) · Follows Floor Marshal Nair',
      medicalAlert: s.medicalNotes || 'Mild dust allergy',
      status: s.evacuationStatus,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    };
  }

  const handleStudentCheckIn = () => {
    confirmStudentSafetyQuickAction(persona.name);
    setSafetyCheckedFeedback(true);
    setTimeout(() => setSafetyCheckedFeedback(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow">
              <User className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white">USER PROFILE & EMERGENCY CREDENTIALS</h1>
            <span className={`text-xs px-2 py-0.5 rounded font-mono border ${persona.badgeColor}`}>
              {userRole}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Institutional credential card, biometric medical indicators, and personal evacuation status for emergency audits.
          </p>
        </div>

        <button
          onClick={() => setIsRoleModalOpen(true)}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-lg text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
        >
          <Users className="w-4 h-4 text-blue-400" />
          <span>Switch Demo User Role</span>
        </button>
      </div>

      {safetyCheckedFeedback && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3.5 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Safety status successfully transmitted to the central control desk!</span>
        </div>
      )}

      {/* Profile Card & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: ID Card Presentation */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
          <div className="flex items-start justify-between">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-600/30">
              {persona.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${persona.badgeColor}`}
            >
              {persona.roleTitle.split('&')[0]}
            </span>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">{persona.name}</h2>
            <div className="text-xs text-blue-400 font-mono mt-0.5">{persona.id}</div>
            <div className="text-xs text-slate-400 mt-1">{persona.organization}</div>
          </div>

          {/* Quick Safety Check-In Action (especially for Student & Teacher) */}
          {userRole === 'STUDENT' && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300">Evacuation Status:</span>
                <span className="text-xs font-mono font-bold text-white">{persona.status}</span>
              </div>
              <button
                onClick={handleStudentCheckIn}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>CONFIRM MY SAFETY AT ASSEMBLY POINT</span>
              </button>
            </div>
          )}

          <div className="space-y-2.5 pt-3 border-t border-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Blood Group:</span>
              <span className="font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                {persona.bloodGroup}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Emergency Phone:</span>
              <span className="font-mono text-slate-200">{persona.phone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Next of Kin / Parent:</span>
              <span className="font-mono text-slate-200">{persona.emergencyContact}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Institutional Email:</span>
              <span className="text-slate-300 font-mono text-[11px] truncate max-w-[200px]">
                {persona.email}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Emergency Protocol Duties & Medical Alerts */}
        <div className="lg:col-span-7 space-y-5">
          {/* Duties Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Assigned Emergency Response Role
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {persona.assignedDuties}
            </p>
          </div>

          {/* Medical Indicators Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Heart className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Paramedic Triage Indicators
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Known Medical Alerts</span>
                <span className="font-semibold text-white">{persona.medicalAlert}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Triage Priority Tag</span>
                <span className="font-mono text-emerald-400 font-bold">Standard Green / Safe</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isRoleModalOpen && <RoleSwitcherModal onClose={() => setIsRoleModalOpen(false)} />}
    </div>
  );
};
