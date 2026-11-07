import React from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveCampusMap } from '../components/map/InteractiveCampusMap';
import {
  ShieldAlert,
  Users,
  GraduationCap,
  Activity,
  PhoneCall,
  DoorOpen,
  MapPin,
  BellRing,
  Send,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Volume2,
  Newspaper,
  Flame,
  Radio,
  Upload,
  Play,
  Square,
  Sparkles,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    userRole,
    setActivePage,
    satelliteMapImage,
    markers,
    students,
    teachers,
    alerts,
    sosRequests,
    emergencyStatus,
    activeDisasterType,
    customOrigin,
    setCustomOrigin,
    selectedMarkerId,
    setSelectedMarkerId,
    triggerEvacuationQuickAction,
    toggleSiren,
    isSirenPlaying,
    isLiveDrillActive,
    drillElapsedSeconds,
    toggleLiveDrill,
    speakInstruction,
  } = useApp();

  // Statistics calculations
  const totalStudents = 1420;
  const totalTeachers = 84;
  const safeStudentsCount = 1380 + students.filter(
    (s) => s.evacuationStatus === 'Reached Assembly Point' || s.evacuationStatus === 'Reached Exit'
  ).length;
  const activeSosCount = sosRequests.filter((r) => r.status !== 'Resolved').length;
  const activeEmergenciesCount = alerts.filter((a) => a.severity === 'Critical' || a.severity === 'High').length;

  const exitGates = markers.filter((m) => m.type === 'EXIT_GATE');
  const assemblyPoints = markers.filter((m) => m.type === 'ASSEMBLY_POINT');
  const activeTargetMarker = markers.find((m) => m.id === selectedMarkerId) || markers[0];

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* TOP PROMINENT WORKBENCH CALLOUT: Upload School Satellite Photo & Choose Points */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-2 border-blue-500/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>CUSTOM SCHOOL CADASTRE WORKBENCH</span>
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              {exitGates.length} Exit Points · {assemblyPoints.length} Assemble Points Saved
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Upload Your School's Satellite Photo & Set Exit & Assemble Points
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Personalize the disaster preparedness system for your campus. Upload your school's aerial image (from Google Earth or drone photography), then click on the map to choose exit gates and safe assembly points with real-time route pathfinding.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 relative z-10">
          <button
            onClick={() => setActivePage('map-management')}
            className="px-5 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 transition-transform active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Open School Map & Points Workbench</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      {/* REAL-TIME LIVE DRILL HUD STRIP */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 ${
              isLiveDrillActive ? 'bg-rose-600 animate-pulse shadow-lg shadow-rose-600/40' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white uppercase tracking-wider">
                Real-Time Evacuation Drill Engine
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  isLiveDrillActive
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isLiveDrillActive ? 'LIVE DRILL STREAM ACTIVE' : 'DRILL STANDBY'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Ticking elapsed clock, periodic muster arrivals, automated voice cues, and broadcast sirens.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Drill Timer Display */}
          <div className="bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 text-center font-mono">
            <div className="text-[10px] text-slate-500 uppercase">Elapsed Drill Time</div>
            <div className="text-base font-black text-white">{formatTimer(drillElapsedSeconds)}</div>
          </div>

          {/* Toggle Button */}
          <button
            onClick={toggleLiveDrill}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-md ${
              isLiveDrillActive
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isLiveDrillActive ? (
              <>
                <Square className="w-3.5 h-3.5 fill-white" />
                <span>PAUSE DRILL</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>START LIVE DRILL</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 5 MAIN STATISTICS METRICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Students */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase">Total Students</span>
            <GraduationCap className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-2">
            {totalStudents}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Enrolled across Classes 6-12</div>
        </div>

        {/* Total Teachers */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase">Total Teachers</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-2">
            {totalTeachers}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Designated Floor Marshals</div>
        </div>

        {/* Active Emergencies */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[11px] font-mono uppercase">Active Hazards</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono mt-2">
            {activeEmergenciesCount}
          </div>
          <div className="text-[10px] text-amber-400/80 mt-1">Critical alerts broadcast</div>
        </div>

        {/* Safe Students */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[11px] font-mono uppercase">Safe Students</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-2">
            {safeStudentsCount}
          </div>
          <div className="text-[10px] text-emerald-400/80 mt-1">Verified at assembly grounds</div>
        </div>

        {/* Active SOS Requests */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-red-400">
            <span className="text-[11px] font-mono uppercase">Active SOS</span>
            <PhoneCall className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-400 font-mono mt-2">
            {activeSosCount}
          </div>
          <div className="text-[10px] text-red-400/80 mt-1">Medical first-aid priority</div>
        </div>
      </div>

      {/* 4 PRIMARY QUICK ACTIONS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* EXIT Quick Action */}
        <button
          onClick={() => triggerEvacuationQuickAction('EXIT')}
          className="p-4 bg-gradient-to-br from-red-950 via-slate-900 to-slate-900 hover:from-red-900 border border-red-700/60 rounded-xl text-left transition-all group shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-md">
              <DoorOpen className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-red-400 transition-colors" />
          </div>
          <div className="text-sm font-bold text-white">EXIT QUICK ACTION</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Route to safe perimeter egress gates</div>
        </button>

        {/* ASSEMBLY Quick Action */}
        <button
          onClick={() => triggerEvacuationQuickAction('ASSEMBLY')}
          className="p-4 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 hover:from-emerald-900 border border-emerald-700/60 rounded-xl text-left transition-all group shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <MapPin className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="text-sm font-bold text-white">ASSEMBLY QUICK ACTION</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Direct to central open sports fields</div>
        </button>

        {/* SOS Quick Action */}
        <button
          onClick={() => setActivePage('sos')}
          className="p-4 bg-gradient-to-br from-rose-950 via-slate-900 to-slate-900 hover:from-rose-900 border border-rose-700/60 rounded-xl text-left transition-all group shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-md">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-colors" />
          </div>
          <div className="text-sm font-bold text-white">SOS EMERGENCY (112)</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Dispatch Ambulance, Fire or NDRF</div>
        </button>

        {/* SEND ALERT Quick Action */}
        <button
          onClick={() => setActivePage('alerts')}
          className="p-4 bg-gradient-to-br from-blue-950 via-slate-900 to-slate-900 hover:from-blue-900 border border-blue-700/60 rounded-xl text-left transition-all group shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Send className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
          </div>
          <div className="text-sm font-bold text-white">SEND ALERT BROADCAST</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Notify all 1,504 campus personnel</div>
        </button>
      </div>

      {/* MAP PREVIEW & DISASTER TELEMETRY SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Map Preview */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Active School Map & Evacuation Route
              </h3>
            </div>
            <button
              onClick={() => setActivePage('map-management')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              <span>Manage School Photo & Points</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <InteractiveCampusMap
            imageSrc={satelliteMapImage}
            markers={markers}
            selectedMarkerId={activeTargetMarker?.id}
            highlightRouteToMarkerId={activeTargetMarker?.id}
            customOrigin={customOrigin}
            onMarkerSelect={(m) => {
              setSelectedMarkerId(m.id);
              speakInstruction(`Destination selected: ${m.name}`);
            }}
            heightClass="h-[440px]"
          />

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1">
            <span className="font-mono">
              Egress Gates: <strong className="text-white">{exitGates.length} Available</strong> · Assembly Grounds: <strong className="text-emerald-400">{assemblyPoints.length} Safe</strong>
            </span>
            <button
              onClick={() => setActivePage('evacuation')}
              className="text-xs text-slate-300 hover:text-white underline font-semibold"
            >
              Open Full Evacuation Engine
            </button>
          </div>
        </div>

        {/* Right Column: Disaster Warnings & Live Monitoring Summary */}
        <div className="lg:col-span-4 space-y-4">
          {/* Latest Disaster Warnings */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Latest Disaster Warnings
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">IMD Bulletin</span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-300">Severe Cyclonic Storm "DANA"</span>
                  <span className="text-[10px] font-mono bg-red-600 text-white px-1.5 py-0.5 rounded">
                    RED
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Winds 115-125 km/h gusting to 140 km/h. Coastal landfall within 18 hours. Educational closures in 14 districts.
                </p>
              </div>

              <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">Brahmaputra Flood Surge</span>
                  <span className="text-[10px] font-mono bg-amber-600 text-white px-1.5 py-0.5 rounded">
                    ORANGE
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Water level 0.82m above danger line at Guwahati terminal. Riparian campuses operating from 2nd floor terraces.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActivePage('disaster-monitoring')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View Full Monitoring Telemetry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Student & Teacher Safety Quick Overview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">
              Campus Personnel Safety Ratio
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Student Evacuation Progress</span>
                  <span className="font-mono text-emerald-400 font-bold">97.2% Safe</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[97%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Teacher Floor Marshals Checked In</span>
                  <span className="font-mono text-blue-400 font-bold">81 / 84 Deployed</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[96%]" />
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setActivePage('student-tracking')}
                className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-[11px] font-semibold text-center"
              >
                Track Students
              </button>
              <button
                onClick={() => setActivePage('teacher-tracking')}
                className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-[11px] font-semibold text-center"
              >
                Track Teachers
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
