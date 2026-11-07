import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CampusMarker, MarkerType } from '../types';
import { InteractiveCampusMap } from '../components/map/InteractiveCampusMap';
import { DEFAULT_CAMPUS_IMAGE } from '../data/mockData';
import {
  Upload,
  DoorOpen,
  MapPin,
  Trash2,
  Edit2,
  Check,
  X,
  RotateCcw,
  Info,
  Navigation,
  Volume2,
  LocateFixed,
  Route,
  ArrowRight,
  Sparkles,
  Layers,
} from 'lucide-react';

export const SchoolMapPage: React.FC = () => {
  const {
    satelliteMapImage,
    setSatelliteMapImage,
    resetSatelliteMapToDefault,
    markers,
    addMarker,
    updateMarker,
    deleteMarker,
    customOrigin,
    setCustomOrigin,
    selectedMarkerId,
    setSelectedMarkerId,
    speakInstruction,
    userRole,
    setActivePage,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [placementMode, setPlacementMode] = useState<'NONE' | 'EXIT_GATE' | 'ASSEMBLY_POINT' | 'ORIGIN'>('NONE');
  const [pendingCoords, setPendingCoords] = useState<{ x: number; y: number } | null>(null);

  // Form states for marker creation
  const [markerName, setMarkerName] = useState<string>('');
  const [markerDetails, setMarkerDetails] = useState<string>('');
  const [markerCapacity, setMarkerCapacity] = useState<number>(1000);
  const [markerStatus, setMarkerStatus] = useState<'OPEN' | 'CONGESTED' | 'BLOCKED'>('OPEN');

  // Edit marker modal/state
  const [editingMarkerId, setEditingMarkerId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editDetails, setEditDetails] = useState<string>('');
  const [editCapacity, setEditCapacity] = useState<number>(1000);
  const [editStatus, setEditStatus] = useState<'OPEN' | 'CONGESTED' | 'BLOCKED'>('OPEN');

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // File Upload logic
  const processImageFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setFeedbackMsg('Error: Please upload a JPG, PNG, or WEBP satellite image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setSatelliteMapImage(event.target.result);
        setFeedbackMsg(`Uploaded "${file.name}"! Your custom school satellite photo is now active and saved.`);
        setTimeout(() => setFeedbackMsg(null), 5000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  // Map Click handler based on active mode
  const handleMapClick = (coords: { x: number; y: number }) => {
    if (placementMode === 'ORIGIN') {
      setCustomOrigin({
        x: coords.x,
        y: coords.y,
        name: `Custom Location (${coords.x}%, ${coords.y}%)`,
      });
      setPlacementMode('NONE');
      setFeedbackMsg(`Starting location updated on your school photo.`);
      setTimeout(() => setFeedbackMsg(null), 3000);
      return;
    }

    if (placementMode === 'EXIT_GATE' || placementMode === 'ASSEMBLY_POINT') {
      setPendingCoords(coords);
      const isExit = placementMode === 'EXIT_GATE';
      const existingCount = markers.filter((m) => m.type === placementMode).length;
      setMarkerName(
        isExit
          ? `Exit Gate ${existingCount + 1}`
          : `Assembly Point ${String.fromCharCode(65 + existingCount)}`
      );
      setMarkerDetails(isExit ? 'Perimeter egress point' : 'Open ground safe muster area');
    }
  };

  const handleSaveMarker = () => {
    if (!pendingCoords || !markerName.trim()) return;

    const isExit = placementMode === 'EXIT_GATE';
    const existingCount = markers.filter((m) => m.type === placementMode).length;

    const created = addMarker({
      type: isExit ? 'EXIT_GATE' : 'ASSEMBLY_POINT',
      name: markerName.trim(),
      x: pendingCoords.x,
      y: pendingCoords.y,
      details: markerDetails.trim() || undefined,
      capacity: markerCapacity,
      status: markerStatus,
      gateCode: isExit ? `EG-0${existingCount + 1}` : `AP-${String.fromCharCode(65 + existingCount)}`,
    });

    setSelectedMarkerId(created.id);
    setPendingCoords(null);
    setPlacementMode('NONE');
    setFeedbackMsg(`Added point "${created.name}" and set as active destination!`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const startEdit = (marker: CampusMarker) => {
    setEditingMarkerId(marker.id);
    setEditName(marker.name);
    setEditDetails(marker.details || '');
    setEditCapacity(marker.capacity || 1000);
    setEditStatus(marker.status);
  };

  const saveEdit = (id: string) => {
    updateMarker(id, {
      name: editName.trim(),
      details: editDetails.trim() || undefined,
      capacity: editCapacity,
      status: editStatus,
    });
    setEditingMarkerId(null);
  };

  const exitGates = markers.filter((m) => m.type === 'EXIT_GATE');
  const assemblyPoints = markers.filter((m) => m.type === 'ASSEMBLY_POINT');
  const activeSelectedMarker = markers.find((m) => m.id === selectedMarkerId) || markers[0];

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
              School Satellite Cadastre & Geofence Setup
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            UPLOAD SCHOOL SATELLITE PHOTO & CHOOSE POINTS
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Upload your school or college aerial satellite image, then choose and place your <strong>Exit Points</strong> (gates) and <strong>Assemble Points</strong> (safe assembly grounds). Everything auto-saves in real-time.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".jpg,.jpeg,.png,.webp"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Upload School Satellite Photo</span>
          </button>

          <button
            onClick={resetSatelliteMapToDefault}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Restore default campus satellite image"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset Map</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3.5 rounded-xl text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{feedbackMsg}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* QUICK WORKBENCH CONTROLS STRIP (3 Direct Choices) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>Choose Action to Mark on School Photo:</span>
          {placementMode !== 'NONE' && (
            <button
              onClick={() => {
                setPlacementMode('NONE');
                setPendingCoords(null);
              }}
              className="text-xs text-red-400 hover:text-white font-semibold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel Placement</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Button 1: Choose / Place Exit Point */}
          <button
            onClick={() => {
              setPlacementMode(placementMode === 'EXIT_GATE' ? 'NONE' : 'EXIT_GATE');
              setPendingCoords(null);
            }}
            className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
              placementMode === 'EXIT_GATE'
                ? 'bg-red-950/80 border-red-500 text-white shadow-xl ring-2 ring-red-500/40 animate-pulse'
                : 'bg-slate-950/60 border-slate-800 hover:border-red-600/60 text-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-lg">
              <DoorOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white">1. CHOOSE EXIT POINT</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {placementMode === 'EXIT_GATE' ? 'Click on map to drop exit gate' : 'Mark school boundary exit gate'}
              </p>
            </div>
          </button>

          {/* Button 2: Choose / Place Assemble Point */}
          <button
            onClick={() => {
              setPlacementMode(placementMode === 'ASSEMBLY_POINT' ? 'NONE' : 'ASSEMBLY_POINT');
              setPendingCoords(null);
            }}
            className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
              placementMode === 'ASSEMBLY_POINT'
                ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-xl ring-2 ring-emerald-500/40 animate-pulse'
                : 'bg-slate-950/60 border-slate-800 hover:border-emerald-600/60 text-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-lg">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white">2. CHOOSE ASSEMBLE POINT</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {placementMode === 'ASSEMBLY_POINT' ? 'Click on map to drop assemble point' : 'Mark safe playground / open area'}
              </p>
            </div>
          </button>

          {/* Button 3: Set Starting Classroom Location */}
          <button
            onClick={() => {
              setPlacementMode(placementMode === 'ORIGIN' ? 'NONE' : 'ORIGIN');
              setPendingCoords(null);
            }}
            className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
              placementMode === 'ORIGIN'
                ? 'bg-blue-950/80 border-blue-500 text-white shadow-xl ring-2 ring-blue-500/40 animate-pulse'
                : 'bg-slate-950/60 border-slate-800 hover:border-blue-600/60 text-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-lg">
              <LocateFixed className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white">3. SET STARTING LOCATION</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {placementMode === 'ORIGIN' ? 'Click map to place student start point' : 'Where students are in classroom'}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* MAIN WORKBENCH GRID: Map Canvas + Point Roster & Live Route Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Map */}
        <div
          className={`lg:col-span-8 space-y-4 rounded-2xl p-1 transition-all ${
            isDragOver ? 'ring-4 ring-blue-500/50 bg-blue-500/10' : ''
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          <InteractiveCampusMap
            imageSrc={satelliteMapImage}
            markers={markers}
            selectedMarkerId={activeSelectedMarker?.id}
            highlightRouteToMarkerId={activeSelectedMarker?.id}
            customOrigin={customOrigin}
            onMarkerSelect={(m) => {
              setSelectedMarkerId(m.id);
              speakInstruction(`Target route selected: ${m.name}`);
            }}
            onMapClick={handleMapClick}
            onDoubleTapPlacePoint={(type, coords) => {
              setPendingCoords(coords);
              setPlacementMode(type);
              const isExit = type === 'EXIT_GATE';
              const existingCount = markers.filter((m) => m.type === type).length;
              setMarkerName(
                isExit
                  ? `Exit Gate ${existingCount + 1}`
                  : `Assembly Point ${String.fromCharCode(65 + existingCount)}`
              );
              setMarkerDetails(isExit ? 'Perimeter egress point' : 'Open ground safe muster area');
              setFeedbackMsg(`Selected ${isExit ? '1. Exist Point (Exit Gate)' : '2. Assemble Point'} at (${coords.x}%, ${coords.y}%). Configure details below & click Save.`);
              speakInstruction(`Selected ${isExit ? 'Exit Point' : 'Assemble Point'} at coordinates ${coords.x} by ${coords.y}`);
            }}
            isAddMarkerActive={placementMode === 'EXIT_GATE' || placementMode === 'ASSEMBLY_POINT'}
            isSetOriginActive={placementMode === 'ORIGIN'}
            onSetCustomOrigin={(orig) => {
              setCustomOrigin(orig);
              setPlacementMode('NONE');
              setFeedbackMsg(`Starting location updated to "${orig.name}".`);
              setTimeout(() => setFeedbackMsg(null), 3000);
            }}
            heightClass="h-[560px]"
          />

          {/* New Point Placement Modal / Drawer */}
          {pendingCoords && (
            <div className="bg-slate-900 border-2 border-amber-500 rounded-2xl p-5 shadow-2xl animate-in fade-in slide-in-from-top-2 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Configure New {placementMode === 'EXIT_GATE' ? 'Exit Point (Gate)' : 'Assemble Point (Safe Zone)'}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    ({pendingCoords.x}%, {pendingCoords.y}%)
                  </span>
                </div>
                <button
                  onClick={() => setPendingCoords(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Point Name *
                  </label>
                  <input
                    type="text"
                    value={markerName}
                    onChange={(e) => setMarkerName(e.target.value)}
                    placeholder="e.g. Main North Exit Gate or Assembly Oval"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Estimated Max Safe Capacity
                  </label>
                  <input
                    type="number"
                    value={markerCapacity}
                    onChange={(e) => setMarkerCapacity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Current Clearance Status
                  </label>
                  <select
                    value={markerStatus}
                    onChange={(e) => setMarkerStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="OPEN">OPEN / SAFE</option>
                    <option value="CONGESTED">CONGESTED</option>
                    <option value="BLOCKED">BLOCKED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Access Notes / Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={markerDetails}
                  onChange={(e) => setMarkerDetails(e.target.value)}
                  placeholder="e.g. Double gate opening onto street; emergency vehicles access point."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setPendingCoords(null)}
                  className="px-3.5 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMarker}
                  className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-black shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Point to Map</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Marked Points Roster & Live Evacuation Route Hub */}
        <div className="lg:col-span-4 space-y-5">
          {/* Active Target Point Card */}
          {activeSelectedMarker && (
            <div className="bg-slate-900 border-2 border-blue-500/60 rounded-2xl p-5 shadow-2xl space-y-3">
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        activeSelectedMarker.type === 'EXIT_GATE' ? 'bg-red-500' : 'bg-emerald-500'
                      }`}
                    />
                    <h3 className="text-base font-black text-white">{activeSelectedMarker.name}</h3>
                  </div>
                  <div className="text-xs text-blue-400 font-mono mt-0.5">
                    Code: {activeSelectedMarker.gateCode || 'POINT'} · Capacity: {activeSelectedMarker.capacity || 1000}
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    activeSelectedMarker.type === 'EXIT_GATE'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {activeSelectedMarker.type === 'EXIT_GATE' ? 'EXIT POINT' : 'ASSEMBLE POINT'}
                </span>
              </div>

              <div className="text-xs text-slate-300 space-y-1">
                <div className="text-slate-400">Notes:</div>
                <p className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] leading-relaxed">
                  {activeSelectedMarker.details || 'Standard egress waypoint for emergency drills.'}
                </p>
              </div>

              {/* Voice Guidance Button */}
              <button
                onClick={() => {
                  const label = activeSelectedMarker.type === 'EXIT_GATE' ? 'Exit Gate' : 'Assemble Point';
                  speakInstruction(
                    `Evacuation route from ${customOrigin.name} towards ${label} ${activeSelectedMarker.name}. Walk briskly, do not run.`
                  );
                }}
                className="w-full py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Play Voice Route Instructions</span>
              </button>
            </div>
          )}

          {/* Exit Points List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <DoorOpen className="w-4 h-4 text-red-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Exit Points (Gates) - {exitGates.length}
                </h4>
              </div>
              <button
                onClick={() => setPlacementMode('EXIT_GATE')}
                className="text-[11px] font-bold text-red-400 hover:text-red-300"
              >
                + Add Exit Point
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {exitGates.map((gate) => {
                const isSelected = activeSelectedMarker?.id === gate.id;

                return (
                  <div
                    key={gate.id}
                    onClick={() => setSelectedMarkerId(gate.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-red-950/70 border-red-500 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        <span>{gate.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Cap: {gate.capacity || 1000} · Status: {gate.status}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => deleteMarker(gate.id)}
                        className="p-1 text-slate-500 hover:text-red-400 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assemble Points List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Assemble Points (Safe Grounds) - {assemblyPoints.length}
                </h4>
              </div>
              <button
                onClick={() => setPlacementMode('ASSEMBLY_POINT')}
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300"
              >
                + Add Assemble Point
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {assemblyPoints.map((ap) => {
                const isSelected = activeSelectedMarker?.id === ap.id;

                return (
                  <div
                    key={ap.id}
                    onClick={() => setSelectedMarkerId(ap.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>{ap.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Cap: {ap.capacity || 2000} · Status: {ap.status}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => deleteMarker(ap.id)}
                        className="p-1 text-slate-500 hover:text-red-400 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
