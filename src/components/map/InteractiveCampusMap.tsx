import React, { useState, useRef, useEffect } from 'react';
import {
  CampusMarker,
  BlockedZone,
  StudentRecord,
  TeacherRecord,
} from '../../types';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Compass,
  AlertOctagon,
  DoorOpen,
  MapPin,
  Volume2,
  Navigation,
  Clock,
  LocateFixed,
  Route as RouteIcon,
  HelpCircle,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface InteractiveCampusMapProps {
  imageSrc: string;
  markers?: CampusMarker[];
  blockedZones?: BlockedZone[];
  students?: StudentRecord[];
  teachers?: TeacherRecord[];
  selectedMarkerId?: string | null;
  onMarkerSelect?: (marker: CampusMarker) => void;
  onMapClick?: (coords: { x: number; y: number }) => void;
  isAddMarkerActive?: boolean;
  isAddBlockedActive?: boolean;
  isSetOriginActive?: boolean;
  highlightRouteToMarkerId?: string | null;
  evacuationMode?: 'EXIT' | 'ASSEMBLY' | null;
  activeDisaster?: 'Flood' | 'Earthquake' | 'Cyclone' | 'Fire' | 'General';
  customOrigin?: { x: number; y: number; name: string };
  onSetCustomOrigin?: (origin: { x: number; y: number; name: string }) => void;
  showStudents?: boolean;
  showTeachers?: boolean;
  showBlockedZones?: boolean;
  heightClass?: string;
  onSpeakRoute?: (text: string) => void;
  onDoubleTapPlacePoint?: (type: 'EXIT_GATE' | 'ASSEMBLY_POINT', coords: { x: number; y: number }) => void;
}

export const InteractiveCampusMap: React.FC<InteractiveCampusMapProps> = ({
  imageSrc,
  markers = [],
  blockedZones = [],
  students = [],
  teachers = [],
  selectedMarkerId = null,
  onMarkerSelect,
  onMapClick,
  isAddMarkerActive = false,
  isAddBlockedActive = false,
  isSetOriginActive = false,
  highlightRouteToMarkerId = null,
  evacuationMode = null,
  activeDisaster = 'General',
  customOrigin = { x: 48, y: 28, name: 'Main Academic Block (Room 102)' },
  onSetCustomOrigin,
  showStudents = false,
  showTeachers = false,
  showBlockedZones = true,
  heightClass = 'h-[520px]',
  onSpeakRoute,
  onDoubleTapPlacePoint,
}) => {
  const { addMarker, setSelectedMarkerId, speakInstruction } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Double-tap/click popup state
  const [doubleTapMenu, setDoubleTapMenu] = useState<{ x: number; y: number } | null>(null);
  const lastTapRef = useRef<{ time: number; x: number; y: number }>({ time: 0, x: 0, y: 0 });

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const xPct = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, (clickY / rect.height) * 100));

    setDoubleTapMenu({
      x: Number(xPct.toFixed(1)),
      y: Number(yPct.toFixed(1)),
    });
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const now = Date.now();
    const touch = e.changedTouches[0];
    if (!touch) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const delta = now - lastTapRef.current.time;
    const dist = Math.hypot(x - lastTapRef.current.x, y - lastTapRef.current.y);

    if (delta > 40 && delta < 350 && dist < 35) {
      const xPct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const yPct = Math.max(0, Math.min(100, (y / rect.height) * 100));
      setDoubleTapMenu({
        x: Number(xPct.toFixed(1)),
        y: Number(yPct.toFixed(1)),
      });
      lastTapRef.current = { time: 0, x: 0, y: 0 };
    } else {
      lastTapRef.current = { time: now, x, y };
    }
  };

  const handleChoosePointFromDoubleTap = (
    type: 'EXIT_GATE' | 'ASSEMBLY_POINT',
    coords: { x: number; y: number }
  ) => {
    if (onDoubleTapPlacePoint) {
      onDoubleTapPlacePoint(type, coords);
    } else {
      const isExit = type === 'EXIT_GATE';
      const existingCount = markers.filter((m) => m.type === type).length;
      const name = isExit
        ? `Exit Gate ${existingCount + 1}`
        : `Assembly Point ${String.fromCharCode(65 + existingCount)}`;
      const created = addMarker({
        type,
        name,
        x: coords.x,
        y: coords.y,
        capacity: isExit ? 1200 : 2500,
        status: 'OPEN',
        gateCode: isExit ? `EG-0${existingCount + 1}` : `AP-${String.fromCharCode(65 + existingCount)}`,
        details: isExit ? 'Designated perimeter exit point' : 'Safe open ground muster area',
      });
      setSelectedMarkerId(created.id);
      speakInstruction(`New ${isExit ? 'Exit Point' : 'Assemble Point'} added at ${name}`);
    }
    setDoubleTapMenu(null);
  };

  // Zoom limits
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !isAddMarkerActive && !isAddBlockedActive && !isSetOriginActive) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMapSurfaceClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const xPct = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, (clickY / rect.height) * 100));

    const coords = {
      x: Number(xPct.toFixed(1)),
      y: Number(yPct.toFixed(1)),
    };

    if (isSetOriginActive && onSetCustomOrigin) {
      onSetCustomOrigin({
        x: coords.x,
        y: coords.y,
        name: `Current Location (${coords.x}%, ${coords.y}%)`,
      });
      return;
    }

    if (onMapClick) {
      onMapClick(coords);
    }
  };

  // Find target marker for route calculation
  const targetMarker =
    markers.find((m) => m.id === (highlightRouteToMarkerId || selectedMarkerId)) ||
    (markers.length > 0 ? markers[0] : null);

  const origin = customOrigin;

  // Real-time calculation of distance & walk duration
  const dx = (targetMarker ? targetMarker.x - origin.x : 0) * 1.35;
  const dy = targetMarker ? targetMarker.y - origin.y : 0;
  const distancePct = Math.sqrt(dx * dx + dy * dy);
  const distanceMeters = Math.max(25, Math.round(distancePct * 3.4));
  const estimatedSeconds = Math.round(distanceMeters / 1.3); // walking speed 1.3 m/s

  // Compute curved SVG path
  const midX = targetMarker ? (origin.x + targetMarker.x) / 2 + 4 : 50;
  const midY = targetMarker ? (origin.y + targetMarker.y) / 2 - 3 : 50;

  const handleTriggerVoice = () => {
    if (!targetMarker) return;
    const typeLabel = targetMarker.type === 'EXIT_GATE' ? 'Exit Gate' : 'Assembly Point';
    const msg = `Evacuation routing active. From ${origin.name}, proceed ${distanceMeters} meters along highlighted pathway to ${typeLabel} ${targetMarker.name}. Walk briskly, do not run.`;
    if (onSpeakRoute) {
      onSpeakRoute(msg);
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(msg));
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${heightClass} bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl select-none flex flex-col justify-between`}
    >
      {/* Top Map Controls Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none gap-2">
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/95 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-lg text-xs">
          <Compass className="w-4 h-4 text-rose-500 animate-pulse" />
          <span className="font-bold text-white tracking-wide hidden sm:inline">
            SCHOOL SATELLITE CADASTRE
          </span>
          <span className="hidden xl:inline text-[10px] text-amber-300/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 font-medium">
            💡 Double-tap anywhere to place Exit / Assemble Point
          </span>
          {isAddMarkerActive && (
            <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40 animate-pulse">
              Click anywhere on satellite photo to place point
            </span>
          )}
          {isSetOriginActive && (
            <span className="text-[11px] font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/40 animate-pulse">
              Click school photo to set your starting location
            </span>
          )}
          {isAddBlockedActive && (
            <span className="text-[11px] font-bold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/40 animate-pulse">
              Click to place blocked / unsafe zone
            </span>
          )}
        </div>

        {/* Real-time Route Distance HUD & Voice Guidance (when destination selected) */}
        {targetMarker && (
          <div className="hidden md:flex items-center gap-2 pointer-events-auto bg-slate-900/95 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-700 shadow-lg text-xs">
            <RouteIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300">
              To <strong className="text-white">{targetMarker.name.slice(0, 18)}</strong>:
            </span>
            <span className="font-mono font-bold text-emerald-400">{distanceMeters}m</span>
            <span className="text-slate-500">·</span>
            <span className="font-mono text-slate-300">{estimatedSeconds}s walk</span>
            <button
              onClick={handleTriggerVoice}
              className="ml-1 p-1 bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white rounded transition-colors"
              title="Speak Voice Evacuation Directions"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Zoom & Screen Controls */}
        <div className="flex items-center gap-1 bg-slate-900/95 backdrop-blur p-1 rounded-xl border border-slate-700/80 shadow-lg pointer-events-auto">
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Interactive Map Viewport Surface */}
      <div
        className={`relative w-full h-full overflow-hidden ${
          isAddMarkerActive || isAddBlockedActive || isSetOriginActive
            ? 'cursor-crosshair'
            : isDragging
            ? 'cursor-grabbing'
            : 'cursor-grab'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="relative w-full h-full transition-transform duration-75 origin-center"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
          onClick={handleMapSurfaceClick}
          onDoubleClick={handleDoubleClick}
          onTouchEnd={handleTouchEnd}
        >
          {/* Base School Satellite Photo */}
          <img
            src={imageSrc}
            alt="School Campus Satellite Overview"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover pointer-events-none select-none brightness-95 contrast-105"
            onError={(e) => {
              const target = e.target as HTMLElement;
              target.style.display = 'none';
            }}
          />

          {/* SVG Overlay for Vector Routes & Arrows */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="hazardHatch"
                width="4"
                height="4"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <line x1="0" y1="0" x2="0" y2="4" stroke="#EF4444" strokeWidth="1.5" strokeOpacity="0.4" />
              </pattern>

              <marker
                id="arrowheadGreen"
                markerWidth="6"
                markerHeight="6"
                refX="4"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 6 3, 0 6" fill="#10B981" />
              </marker>
              <marker
                id="arrowheadRed"
                markerWidth="6"
                markerHeight="6"
                refX="4"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 6 3, 0 6" fill="#EF4444" />
              </marker>
            </defs>

            {/* Blocked / Hazard Zones */}
            {showBlockedZones &&
              blockedZones.map((zone) => (
                <g key={zone.id}>
                  <circle
                    cx={zone.x}
                    cy={zone.y}
                    r={zone.radius}
                    fill="url(#hazardHatch)"
                    stroke="#EF4444"
                    strokeWidth="0.6"
                    strokeDasharray="1.5 1"
                    className="animate-pulse"
                  />
                  <circle
                    cx={zone.x}
                    cy={zone.y}
                    r={zone.radius * 0.3}
                    fill="#EF4444"
                    fillOpacity="0.3"
                  />
                </g>
              ))}

            {/* Dynamic Real-Time Evacuation Path */}
            {targetMarker && (
              <g>
                {/* Secondary halo stroke */}
                <path
                  d={`M ${origin.x} ${origin.y} Q ${midX} ${midY} ${targetMarker.x} ${targetMarker.y}`}
                  fill="none"
                  stroke={targetMarker.type === 'EXIT_GATE' ? '#EF4444' : '#10B981'}
                  strokeWidth="2.8"
                  strokeOpacity="0.4"
                />

                {/* Animated dash flow path with directional arrowhead */}
                <path
                  d={`M ${origin.x} ${origin.y} Q ${midX} ${midY} ${targetMarker.x} ${targetMarker.y}`}
                  fill="none"
                  stroke={targetMarker.type === 'EXIT_GATE' ? '#F87171' : '#34D399'}
                  strokeWidth="1.4"
                  strokeDasharray="2 2"
                  strokeDashoffset="12"
                  markerEnd={targetMarker.type === 'EXIT_GATE' ? 'url(#arrowheadRed)' : 'url(#arrowheadGreen)'}
                />
              </g>
            )}
          </svg>

          {/* Blocked Zone Labels */}
          {showBlockedZones &&
            blockedZones.map((zone) => (
              <div
                key={`label-${zone.id}`}
                className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 bg-red-950/90 text-red-200 border border-red-500/60 text-[10px] font-bold px-2 py-0.5 rounded shadow-lg backdrop-blur"
                style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
              >
                <AlertOctagon className="w-3 h-3 text-red-400" />
                <span>UNSAFE: {zone.name}</span>
              </div>
            ))}

          {/* User Starting Origin Pin ("You Are Here / Classroom") */}
          <div
            className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-20 group"
            style={{ left: `${origin.x}%`, top: `${origin.y}%` }}
          >
            <div className="flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-2xl border-2 border-white">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>START: {origin.name}</span>
            </div>
          </div>

          {/* Exit Points & Assemble Points on Map */}
          {markers.map((marker) => {
            const isSelected = (selectedMarkerId || highlightRouteToMarkerId) === marker.id;
            const isExit = marker.type === 'EXIT_GATE';

            return (
              <div
                key={marker.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkerSelect?.(marker);
                }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-25 transition-transform ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                }`}
                style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
              >
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl shadow-2xl font-bold text-xs border backdrop-blur transition-all ${
                    isExit
                      ? isSelected
                        ? 'bg-red-600 text-white border-white ring-4 ring-red-500/50'
                        : 'bg-red-950/90 text-red-100 border-red-500 hover:bg-red-800'
                      : isSelected
                      ? 'bg-emerald-600 text-white border-white ring-4 ring-emerald-500/50'
                      : 'bg-emerald-950/90 text-emerald-100 border-emerald-500 hover:bg-emerald-800'
                  }`}
                >
                  {isExit ? <DoorOpen className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                  <span>{marker.gateCode || marker.name}</span>
                  {marker.status === 'CONGESTED' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  )}
                </div>

                {/* Subtitle tooltip on hover/select */}
                {isSelected && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap bg-slate-900 text-white text-[10px] font-medium px-2 py-1 rounded shadow-xl border border-slate-700 pointer-events-none">
                    {marker.name} · Cap: {marker.capacity || 1000} · Status: {marker.status}
                  </div>
                )}
              </div>
            );
          })}

          {/* Student Location Markers (Demo Tracking) */}
          {showStudents &&
            students.map((student) => {
              const statusColors: Record<string, string> = {
                'Moving to Exit': 'bg-amber-500 border-amber-300',
                'Reached Exit': 'bg-emerald-500 border-emerald-300',
                'Moving to Assembly Point': 'bg-blue-500 border-blue-300',
                'Reached Assembly Point': 'bg-emerald-600 border-emerald-300',
                'Needs Assistance': 'bg-red-500 border-red-300 animate-bounce',
                'Not Confirmed': 'bg-slate-500 border-slate-300',
              };

              return (
                <div
                  key={student.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-15 group cursor-pointer"
                  style={{ left: `${student.x}%`, top: `${student.y}%` }}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 shadow-lg flex items-center justify-center text-[8px] font-bold text-white ${
                      statusColors[student.evacuationStatus] || 'bg-slate-600'
                    }`}
                  >
                    S
                  </div>
                  <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-44 bg-slate-900 border border-slate-700 p-2 rounded-lg text-white text-xs shadow-2xl z-30 pointer-events-none">
                    <div className="font-bold">{student.name}</div>
                    <div className="text-[10px] text-slate-300">{student.grade} · {student.assignedTeacher}</div>
                    <div className="text-[10px] font-semibold text-blue-400 mt-1">{student.evacuationStatus}</div>
                  </div>
                </div>
              );
            })}

          {/* Teacher Location Markers (Demo Tracking) */}
          {showTeachers &&
            teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-16 group cursor-pointer"
                style={{ left: `${teacher.x}%`, top: `${teacher.y}%` }}
              >
                <div className="w-5 h-5 rounded-md bg-indigo-600 border-2 border-indigo-300 shadow-xl flex items-center justify-center text-[9px] font-black text-white">
                  T
                </div>
                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-52 bg-slate-900 border border-slate-700 p-2.5 rounded-lg text-white text-xs shadow-2xl z-30 pointer-events-none">
                  <div className="font-bold text-indigo-300">{teacher.name}</div>
                  <div className="text-[10px] text-slate-300">{teacher.emergencyRole}</div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                    {teacher.evacuationStatus}
                  </div>
                </div>
              </div>
            ))}

          {/* Double Tap / Double Click Quick Action Popover: 1. Exist Point, 2. Assemble Point */}
          {doubleTapMenu && (
            <div
              className="absolute z-50 transform -translate-x-1/2 -translate-y-1/2 animate-in fade-in zoom-in-95 duration-150"
              style={{
                left: `${doubleTapMenu.x}%`,
                top: `${doubleTapMenu.y}%`,
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onDoubleClick={(e) => e.stopPropagation()}
            >
              {/* Pulse locator pin */}
              <div className="flex flex-col items-center">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white shadow-xl animate-bounce mb-1" />

                <div className="w-64 bg-slate-900/98 backdrop-blur-md rounded-2xl border-2 border-amber-500/80 p-3.5 shadow-2xl text-white">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                        Choose Location Type
                      </span>
                    </div>
                    <button
                      onClick={() => setDoubleTapMenu(null)}
                      className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
                      title="Close"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-300 mb-2.5">
                    Tapped at <span className="font-mono text-amber-300 font-bold">({doubleTapMenu.x}%, {doubleTapMenu.y}%)</span>. Select option to mark on school photo:
                  </p>

                  <div className="space-y-2">
                    {/* Option 1: EXIST POINT */}
                    <button
                      onClick={() => handleChoosePointFromDoubleTap('EXIT_GATE', doubleTapMenu)}
                      className="w-full p-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-between group shadow-lg shadow-red-600/30 transition-all active:scale-95 border border-red-400/40"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-red-700/80 flex items-center justify-center shrink-0">
                          <DoorOpen className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="font-black text-xs text-white">1. EXIST POINT</div>
                          <div className="text-[9px] text-red-100 font-normal">Exit Gate / Perimeter Door</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded uppercase">Add</span>
                    </button>

                    {/* Option 2: ASSEMBLE POINT */}
                    <button
                      onClick={() => handleChoosePointFromDoubleTap('ASSEMBLY_POINT', doubleTapMenu)}
                      className="w-full p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-between group shadow-lg shadow-emerald-600/30 transition-all active:scale-95 border border-emerald-400/40"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-700/80 flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="font-black text-xs text-white">2. ASSEMBLE POINT</div>
                          <div className="text-[9px] text-emerald-100 font-normal">Safe Muster Area / Ground</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded uppercase">Add</span>
                    </button>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[9px] text-slate-400 text-center font-mono">
                    Double-tap / double-click anywhere to summon
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Interactive Point Selector Strip */}
      <div className="p-3 bg-slate-900/95 backdrop-blur border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2 z-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Quick Choose Point:
          </span>
          {markers.map((m) => {
            const isSelected = (selectedMarkerId || highlightRouteToMarkerId) === m.id;
            const isExit = m.type === 'EXIT_GATE';

            return (
              <button
                key={m.id}
                onClick={() => onMarkerSelect?.(m)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${
                  isSelected
                    ? isExit
                      ? 'bg-red-600 text-white border-white shadow-md'
                      : 'bg-emerald-600 text-white border-white shadow-md'
                    : isExit
                    ? 'bg-red-950/60 text-red-200 border-red-800 hover:bg-red-900'
                    : 'bg-emerald-950/60 text-emerald-200 border-emerald-800 hover:bg-emerald-900'
                }`}
              >
                {isExit ? <DoorOpen className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                <span>{m.gateCode || m.name.slice(0, 14)}</span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-3">
          <span>Click any point or map location to test route</span>
          <span>·</span>
          <span>Zoom: {Math.round(zoom * 100)}%</span>
        </div>
      </div>
    </div>
  );
};
