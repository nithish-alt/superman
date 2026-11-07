import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudentRecord, StudentEvacuationStatus } from '../types';
import { InteractiveCampusMap } from '../components/map/InteractiveCampusMap';
import {
  GraduationCap,
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Phone,
  ArrowRight,
  ShieldAlert,
  Info,
  Edit2,
  Check,
} from 'lucide-react';

export const StudentTrackingPage: React.FC = () => {
  const {
    satelliteMapImage,
    students,
    updateStudentStatus,
    userRole,
    confirmStudentSafetyQuickAction,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(students[0]);

  // Statistics
  const totalRoster = 1420;
  const safeStudents = students.filter(
    (s) => s.evacuationStatus === 'Reached Assembly Point' || s.evacuationStatus === 'Reached Exit'
  ).length;
  const movingStudents = students.filter(
    (s) => s.evacuationStatus === 'Moving to Assembly Point' || s.evacuationStatus === 'Moving to Exit'
  ).length;
  const assistanceNeeded = students.filter((s) => s.evacuationStatus === 'Needs Assistance').length;
  const notConfirmed = students.filter((s) => s.evacuationStatus === 'Not Confirmed').length;

  // Filtered list
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.assignedTeacher.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || s.evacuationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const allStatuses: StudentEvacuationStatus[] = [
    'Moving to Exit',
    'Reached Exit',
    'Moving to Assembly Point',
    'Reached Assembly Point',
    'Needs Assistance',
    'Not Confirmed',
  ];

  const statusBadgeStyle = (status: StudentEvacuationStatus) => {
    switch (status) {
      case 'Reached Assembly Point':
      case 'Reached Exit':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Moving to Assembly Point':
      case 'Moving to Exit':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'Needs Assistance':
        return 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse';
      case 'Not Confirmed':
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white">STUDENT TRACKING SYSTEM</h1>
            <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded font-mono">
              Live Muster Roll
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time student headcount verification, cohort geolocations, and evacuation status tracking across campus sectors and emergency assembly points.
          </p>
        </div>

        {/* Student Quick Action for Student Persona */}
        {userRole === 'STUDENT' && (
          <button
            onClick={() => confirmStudentSafetyQuickAction()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30"
          >
            <Check className="w-4 h-4" />
            <span>I AM SAFE (CONFIRM MY STATUS)</span>
          </button>
        )}
      </div>

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] text-slate-400 uppercase font-mono">Total Students</div>
          <div className="text-2xl font-black text-white font-mono mt-1">{totalRoster}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Classes 6 to 12</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] text-emerald-400 uppercase font-mono">Safe Students</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {1380 + safeStudents}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Reached Assembly / Exit</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] text-blue-400 uppercase font-mono">Moving to Safety</div>
          <div className="text-2xl font-black text-blue-400 font-mono mt-1">
            {28 + movingStudents}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">In Transit with Teachers</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] text-red-400 uppercase font-mono">Needs Assistance</div>
          <div className="text-2xl font-black text-red-400 font-mono mt-1">
            {assistanceNeeded}
          </div>
          <div className="text-[10px] text-red-400/80 mt-0.5">First Aid / Marshals Relayed</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] text-amber-400 uppercase font-mono">Not Confirmed</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">
            {notConfirmed}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Pending Roll-Call</div>
        </div>
      </div>

      {/* MAIN GRID: Interactive Map + Student Information Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Map with Student Markers */}
        <div className="lg:col-span-7 space-y-4">
          <InteractiveCampusMap
            imageSrc={satelliteMapImage}
            students={students}
            showStudents={true}
            heightClass="h-[520px]"
          />

          <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Simulated Campus GPS: Coordinates shown represent demo muster locations.</span>
            </span>
            <span className="font-mono text-emerald-400 text-[11px]">8 Cohorts Tracked</span>
          </div>
        </div>

        {/* Student Roster & Update Panel */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
          {/* Search & Filter Header */}
          <div className="space-y-2.5 pb-3 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Student Information Panel</h3>
              <span className="text-[11px] font-mono text-slate-400">
                Showing {filteredStudents.length} Students
              </span>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search name, ID or teacher..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="Moving to Exit">Moving to Exit</option>
                <option value="Reached Exit">Reached Exit</option>
                <option value="Moving to Assembly Point">Moving to Assembly Point</option>
                <option value="Reached Assembly Point">Reached Assembly Point</option>
                <option value="Needs Assistance">Needs Assistance</option>
                <option value="Not Confirmed">Not Confirmed</option>
              </select>
            </div>
          </div>

          {/* Student Cards List */}
          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {filteredStudents.map((student) => {
              const isSelected = selectedStudent?.id === student.id;

              return (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`p-3 rounded-lg border text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-850 border-blue-500 shadow-md ring-1 ring-blue-500/40'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-white text-xs">{student.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {student.studentId} · {student.grade} ({student.section})
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${statusBadgeStyle(
                        student.evacuationStatus
                      )}`}
                    >
                      {student.evacuationStatus}
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-1 text-[11px] text-slate-400">
                    <div>
                      Teacher: <span className="text-slate-300">{student.assignedTeacher}</span>
                    </div>
                    <div>
                      Location: <span className="text-slate-300 truncate">{student.currentLocation}</span>
                    </div>
                  </div>

                  {student.medicalNotes && (
                    <div className="mt-1.5 p-1.5 bg-red-950/50 border border-red-800/60 text-red-300 rounded text-[10px]">
                      Medical Alert: {student.medicalNotes}
                    </div>
                  )}

                  {/* Teacher or Chairman Status Update Action */}
                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">
                      Updated: {student.lastUpdated}
                    </span>

                    {/* Change Status Dropdown */}
                    <div
                      className="flex items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-[10px] text-slate-400">Set Status:</span>
                      <select
                        value={student.evacuationStatus}
                        onChange={(e) =>
                          updateStudentStatus(
                            student.id,
                            e.target.value as StudentEvacuationStatus
                          )
                        }
                        className="bg-slate-900 border border-slate-700 text-white rounded px-2 py-0.5 text-[10px] font-semibold focus:outline-none focus:border-blue-400"
                      >
                        {allStatuses.map((st) => (
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
