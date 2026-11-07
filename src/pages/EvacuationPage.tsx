import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveCampusMap } from '../components/map/InteractiveCampusMap';
import { DisasterCategory } from '../types';
import {
  DoorOpen,
  MapPin,
  Flame,
  Droplets,
  Wind,
  Activity,
  AlertOctagon,
  ShieldAlert,
  CheckCircle2,
  Navigation,
  Info,
  Plus,
  Trash2,
  X,
  Volume2,
  FileDown,
} from 'lucide-react';
import { EvacuationReportModal } from '../components/evacuation/EvacuationReportModal';

export const EvacuationPage: React.FC = () => {
  const {
    satelliteMapImage,
    markers,
    blockedZones,
    addBlockedZone,
    removeBlockedZone,
    evacuationTargetType,
    setEvacuationTargetType,
    selectedMarkerId,
    setSelectedMarkerId,
    activeDisasterType,
    setActiveDisasterType,
    userRole,
    emergencyStatus,
    setEmergencyStatus,
    toggleSiren,
    isSirenPlaying,
    customOrigin,
    speakInstruction,
    setActivePage,
  } = useApp();

  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isMarkingHazard, setIsMarkingHazard] = useState<boolean>(false);
  const [newHazardName, setNewHazardName] = useState<string>('Corridor Blockage');
  const [newHazardReason, setNewHazardReason] = useState<string>('Waterlogging / Smoke build-up');

  // Filter markers by active target
  const exitGates = markers.filter((m) => m.type === 'EXIT_GATE');
  const assemblyPoints = markers.filter((m) => m.type === 'ASSEMBLY_POINT');
  const activeMarkerList = evacuationTargetType === 'EXIT' ? exitGates : assemblyPoints;

  // Selected destination marker
  const destinationMarker =
    markers.find((m) => m.id === selectedMarkerId) ||
    activeMarkerList[0] ||
    markers[0];

  const handleSelectTargetType = (type: 'EXIT' | 'ASSEMBLY') => {
    setEvacuationTargetType(type);
    const firstOfKind = markers.find(
      (m) => m.type === (type === 'EXIT' ? 'EXIT_GATE' : 'ASSEMBLY_POINT')
    );
    if (firstOfKind) {
      setSelectedMarkerId(firstOfKind.id);
    }
  };

  const handleMapClickForHazard = (coords: { x: number; y: number }) => {
    if (!isMarkingHazard || userRole !== 'CHAIRMAN') return;

    addBlockedZone({
      name: newHazardName,
      reason: newHazardReason,
      disasterType: activeDisasterType,
      x: coords.x,
      y: coords.y,
      radius: 6.5,
    });

    setIsMarkingHazard(false);
  };

  const disasterOptions: Array<{
    type: DisasterCategory;
    icon: typeof Flame;
    label: string;
    description: string;
    color: string;
  }> = [
    {
      type: 'Fire',
      icon: Flame,
      label: 'Fire Hazard',
      description: 'Avoid elevators; proceed via smoke-free stairwells.',
      color: 'hover:border-rose-500 hover:bg-rose-500/10',
    },
    {
      type: 'Earthquake',
      icon: Activity,
      label: 'Earthquake',
      description: 'Move to open turf; clear structural overhangs.',
      color: 'hover:border-amber-500 hover:bg-amber-500/10',
    },
    {
      type: 'Cyclone',
      icon: Wind,
      label: 'Cyclone / High Winds',
      description: 'Secure windows; evacuate coastal and top-floor corridors.',
      color: 'hover:border-cyan-500 hover:bg-cyan-500/10',
    },
    {
      type: 'Flood',
      icon: Droplets,
      label: 'Monsoon Flood',
      description: 'Avoid subways, basements, and open culverts.',
      color: 'hover:border-blue-500 hover:bg-blue-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Evacuation Management & Protocol Control */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">EVACUATION MANAGEMENT</h1>
            <span className="text-xs bg-red-600/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded font-mono">
              Live Tactical Routing
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Select evacuation mode, dynamically render guided route lines with directional vectors to safe egress gates or open assembly arenas, and declare simulated unsafe zones.
          </p>
        </div>

        {/* Drill / Siren / Export PDF Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 active:scale-95 cursor-pointer"
            title="Export printable PDF report of current exit gates and assembly points status"
          >
            <FileDown className="w-4 h-4" />
            <span>Export Status PDF</span>
          </button>

          <button
            onClick={toggleSiren}
            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              isSirenPlaying
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
            }`}
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>{isSirenPlaying ? 'Stop Evacuation Siren' : 'Sound Evacuation Alarm'}</span>
          </button>
        </div>
      </div>

      {/* TWO LARGE COMMAND BUTTONS: RED (EXIT) & GREEN (ASSEMBLY) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* RED BUTTON: EXIT */}
        <button
          onClick={() => handleSelectTargetType('EXIT')}
          className={`p-6 rounded-2xl border-2 transition-all flex items-center justify-between shadow-2xl relative overflow-hidden group ${
            evacuationTargetType === 'EXIT'
              ? 'bg-gradient-to-r from-red-950 via-red-900 to-rose-900 border-red-500 text-white shadow-red-900/40 ring-2 ring-red-500/50'
              : 'bg-slate-900 border-slate-800 hover:border-red-700/60 text-slate-300 hover:bg-slate-850'
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                evacuationTargetType === 'EXIT'
                  ? 'bg-red-600 text-white shadow-red-600/50'
                  : 'bg-red-950/60 text-red-400 border border-red-800'
              }`}
            >
              <DoorOpen className="w-8 h-8" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">RED BUTTON: EXIT</span>
                {evacuationTargetType === 'EXIT' && (
                  <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
                    Active Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Guide students and faculty to exterior gates for campus perimeter release.
              </p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-2xl font-black text-white font-mono">{exitGates.length}</span>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Gates Ready</div>
          </div>
        </button>

        {/* GREEN BUTTON: ASSEMBLY */}
        <button
          onClick={() => handleSelectTargetType('ASSEMBLY')}
          className={`p-6 rounded-2xl border-2 transition-all flex items-center justify-between shadow-2xl relative overflow-hidden group ${
            evacuationTargetType === 'ASSEMBLY'
              ? 'bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-900 border-emerald-500 text-white shadow-emerald-900/40 ring-2 ring-emerald-500/50'
              : 'bg-slate-900 border-slate-800 hover:border-emerald-700/60 text-slate-300 hover:bg-slate-850'
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                evacuationTargetType === 'ASSEMBLY'
                  ? 'bg-emerald-600 text-white shadow-emerald-600/50'
                  : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
              }`}
            >
              <MapPin className="w-8 h-8" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">GREEN BUTTON: ASSEMBLY</span>
                {evacuationTargetType === 'ASSEMBLY' && (
                  <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
                    Active Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Direct cohorts to designated central open fields, away from structural hazards.
              </p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-2xl font-black text-white font-mono">{assemblyPoints.length}</span>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Zones Safe</div>
          </div>
        </button>
      </div>

      {/* Disaster Mode Selection Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Disaster Protocol Scenario:
            </span>
            <span className="text-xs text-slate-400">
              (Adjusts safety routing priorities & instructions)
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Selected: <strong className="text-white">{activeDisasterType}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {disasterOptions.map((opt) => {
            const isSelected = activeDisasterType === opt.type;
            const Icon = opt.icon;

            return (
              <button
                key={opt.type}
                onClick={() => setActiveDisasterType(opt.type)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-slate-800 border-blue-500 text-white shadow-md'
                    : `bg-slate-950/60 border-slate-800 text-slate-400 ${opt.color}`
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold text-white">{opt.label}</span>
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-1">{opt.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Interactive Map + Destination & Route Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Map Viewport with Animated Route Line */}
        <div className="lg:col-span-8 space-y-4">
          <InteractiveCampusMap
            imageSrc={satelliteMapImage}
            markers={activeMarkerList}
            blockedZones={blockedZones}
            selectedMarkerId={destinationMarker?.id}
            onMarkerSelect={(m) => setSelectedMarkerId(m.id)}
            highlightRouteToMarkerId={destinationMarker?.id}
            evacuationMode={evacuationTargetType}
            activeDisaster={activeDisasterType}
            customOrigin={customOrigin}
            onSpeakRoute={speakInstruction}
            isAddBlockedActive={isMarkingHazard}
            onMapClick={handleMapClickForHazard}
            heightClass="h-[560px]"
          />

          {/* Hazard Marking Bar (Chairman only) */}
          {userRole === 'CHAIRMAN' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <AlertOctagon className="w-4 h-4 text-red-400" />
                <span className="font-bold text-white">Hazard Avoidance:</span>
                <span className="text-slate-400 hidden sm:inline">
                  Mark simulated structural or fire hazards to block unsafe corridors.
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isMarkingHazard ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-300 font-bold animate-pulse">
                      Click location on map...
                    </span>
                    <button
                      onClick={() => setIsMarkingHazard(false)}
                      className="px-2.5 py-1 bg-slate-800 text-slate-300 hover:text-white rounded text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsMarkingHazard(true)}
                    className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-700 text-red-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Mark Blocked / Unsafe Area</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Blocked Zones Active List */}
          {blockedZones.length > 0 && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                <AlertOctagon className="w-3 h-3" />
                Active Blockades ({blockedZones.length}):
              </span>
              {blockedZones.map((z) => (
                <div
                  key={z.id}
                  className="bg-red-950/80 border border-red-800 text-red-200 text-xs px-2.5 py-1 rounded-lg flex items-center gap-2"
                >
                  <span className="font-semibold">{z.name}</span>
                  <span className="text-[10px] text-red-400">({z.reason})</span>
                  {userRole === 'CHAIRMAN' && (
                    <button
                      onClick={() => removeBlockedZone(z.id)}
                      className="text-red-400 hover:text-white ml-1"
                      title="Clear Blockage"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Destination Selector & Route Details */}
        <div className="lg:col-span-4 space-y-5">
          {/* Destination Selector Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">
                  {evacuationTargetType === 'EXIT' ? 'SELECT EXIT GATE' : 'SELECT ASSEMBLY POINT'}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {activeMarkerList.length} Options
              </span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {activeMarkerList.map((marker) => {
                const isSelected = destinationMarker?.id === marker.id;

                return (
                  <button
                    key={marker.id}
                    onClick={() => setSelectedMarkerId(marker.id)}
                    className={`w-full p-3 rounded-lg border text-left transition-all flex items-start justify-between gap-2 ${
                      isSelected
                        ? evacuationTargetType === 'EXIT'
                          ? 'bg-red-950/80 border-red-500 shadow-md ring-1 ring-red-500/40 text-white'
                          : 'bg-emerald-950/80 border-emerald-500 shadow-md ring-1 ring-emerald-500/40 text-white'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            evacuationTargetType === 'EXIT' ? 'bg-red-500' : 'bg-emerald-500'
                          }`}
                        />
                        <span className="text-xs font-bold">{marker.name}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{marker.details}</p>
                      <div className="text-[10px] text-slate-500 mt-1 font-mono">
                        Safe Capacity: {marker.capacity || 1000} persons
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          marker.status === 'OPEN'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {marker.status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tactical Route Information Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Route Diagnostics (Demo)
              </span>
              <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                AI Pathfinding v2.4
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Starting Point:</span>
                <span className="font-semibold text-white truncate max-w-[200px]">{customOrigin.name}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Target Destination:</span>
                <span
                  className={`font-bold ${
                    evacuationTargetType === 'EXIT' ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {destinationMarker?.name || 'Selected Waypoint'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Estimated Distance:</span>
                <span className="font-mono text-white">~145 meters (3.2 min walk)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Path Status:</span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Clear & Obstacle-Free
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Directional Guidance:</span>
                <span className="text-blue-300 font-medium">Follow Green/Red Ground Markings</span>
              </div>
            </div>

            {/* Safety Information Box */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
              <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Standard Evacuation Protocol</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                1. Walk in single file along the right edge of pathways.
                <br />
                2. Do NOT run or push peers on staircases.
                <br />
                3. Leave heavy backpacks inside the classroom; take only personal emergency ID cards.
              </p>
            </div>
          </div>

          {/* Required Disclaimer */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-200/90 leading-tight">
            <strong>Important Safety Notice:</strong> This interactive routing interface is a frontend simulation tool for educational emergency preparedness drills. Actual route safety during a real disaster must always be physically inspected and verified by designated Floor Marshals.
          </div>
        </div>
      </div>

      {/* Printable Evacuation Status PDF Report Modal */}
      <EvacuationReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        markers={markers}
        blockedZones={blockedZones}
        emergencyStatus={emergencyStatus}
        activeDisaster={activeDisasterType}
        originName={customOrigin.name}
      />
    </div>
  );
};
