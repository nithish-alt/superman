import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TeacherRecord, TeacherEvacuationStatus } from '../types';
import { InteractiveCampusMap } from '../components/map/InteractiveCampusMap';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Search,
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

export const TeacherTrackingPage: React.FC = () => {
  const {
    satelliteMapImage,
    teachers,
    updateTeacherStatus,
    userRole,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherRecord | null>(teachers[0]);

  const teacherStatuses: TeacherEvacuationStatus[] = [
    'Leading Students',
    'Moving to Exit',
    'Moving to Assembly Point',
    'Reached Assembly Point',
    'Needs Assistance',
  ];

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignedGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics
  const totalFaculty = 84;
  const marshalsActive = teachers.length;
  const safeAtAssembly = teachers.filter(
    (t) => t.evacuationStatus === 'Reached Assembly Point'
  ).length;
  const inTransit = teachers.filter(
    (t) =>
      t.evacuationStatus === 'Leading Students' ||
      t.evacuationStatus === 'Moving to Exit' ||
      t.evacuationStatus === 'Moving to Assembly Point'
  ).length;
  const requiringAssistance = teachers.filter(
    (t) => t.evacuationStatus === 'Needs Assistance'
  ).length;

  const getStatusColor = (status: TeacherEvacuationStatus) => {
    switch (status) {
      case 'Reached Assembly Point':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Leading Students':
      case 'Moving to Assembly Point':
      case 'Moving to Exit':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'Needs Assistance':
        return 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Users className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white">TEACHER TRACKING SYSTEM</h1>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-mono">
              Floor Marshals Command
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Live command console for the Chairman and Incident Commander to verify whether faculty floor marshals are safely guiding their assigned student cohorts.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-800 px-3 py-2 rounded-lg border border-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-white font-semibold">Incident Command Active</span>
        </div>
      </div>

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] text-slate-400 uppercase font-mono">Total Faculty</div>
          <div className="text-2xl font-black text-white font-mono mt-1">{totalFaculty}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">84 Trained Floor Marshals</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] text-emerald-400 uppercase font-mono">At Assembly Safe</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {76 + safeAtAssembly}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Accounted with cohorts</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] text-blue-400 uppercase font-mono">Leading / In Transit</div>
          <div className="text-2xl font-black text-blue-400 font-mono mt-1">
            {6 + inTransit}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Clearing corridors</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] text-red-400 uppercase font-mono">Needs Assistance</div>
          <div className="text-2xl font-black text-red-400 font-mono mt-1">
            {requiringAssistance}
          </div>
          <div className="text-[10px] text-red-400/80 mt-0.5">Stairway assistance requested</div>
        </div>
      </div>

      {/* MAIN GRID: Map + Teacher Information Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Map with Teacher Markers */}
        <div className="lg:col-span-7 space-y-4">
          <InteractiveCampusMap
            imageSrc={satelliteMapImage}
            teachers={teachers}
            showTeachers={true}
            heightClass="h-[520px]"
          />

          <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Purple square icons mark key floor marshals on campus walkways.</span>
            </span>
            <span className="font-mono text-emerald-400 text-[11px]">5 Marshals Logged</span>
          </div>
        </div>

        {/* Right Column: Teacher Information Panel */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="space-y-2 pb-3 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Faculty Marshals Roster</h3>
              <span className="text-[11px] font-mono text-slate-400">
                {filteredTeachers.length} Marshals
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search teacher, subject or group..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Teacher Cards List */}
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {filteredTeachers.map((teacher) => {
              const isSelected = selectedTeacher?.id === teacher.id;

              return (
                <div
                  key={teacher.id}
                  onClick={() => setSelectedTeacher(teacher)}
                  className={`p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-850 border-indigo-500 shadow-lg ring-1 ring-indigo-500/40'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-white text-xs">{teacher.name}</div>
                      <div className="text-[11px] text-indigo-300 font-mono">
                        {teacher.employeeId} · {teacher.emergencyRole}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{teacher.subject}</div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getStatusColor(
                        teacher.evacuationStatus
                      )}`}
                    >
                      {teacher.evacuationStatus}
                    </span>
                  </div>

                  {/* Assigned Cohort & Assembly Status */}
                  <div className="mt-3 p-2.5 bg-slate-900/90 rounded-lg border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Assigned Cohort:</span>
                      <span className="font-semibold text-white">
                        {teacher.assignedGroup} ({teacher.studentCount} students)
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Current Position:</span>
                      <span className="text-slate-300 truncate max-w-[180px]">
                        {teacher.currentLocation}
                      </span>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-medium pt-1 border-t border-slate-800/60">
                      Assembly Status: {teacher.assemblyPointStatus}
                    </div>
                  </div>

                  {/* Status Modification & Phone Link */}
                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">
                      Reported: {teacher.lastReport}
                    </span>

                    <div
                      className="flex items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-[10px] text-slate-400">Update:</span>
                      <select
                        value={teacher.evacuationStatus}
                        onChange={(e) =>
                          updateTeacherStatus(
                            teacher.id,
                            e.target.value as TeacherEvacuationStatus
                          )
                        }
                        className="bg-slate-900 border border-slate-700 text-white rounded px-2 py-0.5 text-[10px] font-semibold focus:outline-none focus:border-indigo-400"
                      >
                        {teacherStatuses.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
