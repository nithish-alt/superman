import React, { useState } from 'react';
import { INDIA_DISASTER_EVENTS } from '../data/mockData';
import { IndiaDisasterEvent } from '../types';
import {
  Globe2,
  Activity,
  Droplets,
  Wind,
  MapPin,
  Clock,
  ShieldAlert,
  Info,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const IndiaDisasterInfoPage: React.FC = () => {
  const [selectedDisaster, setSelectedDisaster] = useState<'Earthquake' | 'Flood' | 'Cyclone'>('Earthquake');
  const [selectedEventId, setSelectedEventId] = useState<string>('eq-1');

  const filteredEvents = INDIA_DISASTER_EVENTS.filter(
    (ev) => ev.disasterType === selectedDisaster
  );

  const activeEvent =
    filteredEvents.find((e) => e.id === selectedEventId) || filteredEvents[0];

  const riskBadge = (level: IndiaDisasterEvent['riskLevel']) => {
    switch (level) {
      case 'Critical':
        return 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse';
      case 'High':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'Moderate':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Low':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-600/30">
              <Globe2 className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white">INDIA DISASTER INFORMATION</h1>
            <span className="text-xs bg-orange-500/20 text-orange-300 border border-orange-500/30 px-2 py-0.5 rounded font-mono">
              National Cadastre
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            State-by-state active natural disaster tracking portal across the Republic of India. Filter by Earthquake, Flood, and Cyclone bulletins.
          </p>
        </div>

        {/* 3 DISASTER TABS */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => {
              setSelectedDisaster('Earthquake');
              const first = INDIA_DISASTER_EVENTS.find((e) => e.disasterType === 'Earthquake');
              if (first) setSelectedEventId(first.id);
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
              selectedDisaster === 'Earthquake'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Earthquake</span>
          </button>

          <button
            onClick={() => {
              setSelectedDisaster('Flood');
              const first = INDIA_DISASTER_EVENTS.find((e) => e.disasterType === 'Flood');
              if (first) setSelectedEventId(first.id);
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
              selectedDisaster === 'Flood'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Flood</span>
          </button>

          <button
            onClick={() => {
              setSelectedDisaster('Cyclone');
              const first = INDIA_DISASTER_EVENTS.find((e) => e.disasterType === 'Cyclone');
              if (first) setSelectedEventId(first.id);
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
              selectedDisaster === 'Cyclone'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Cyclone</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive India Cartography Map + Event Cards List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Stylized SVG Map of India with Interactive Geo-Pins */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                India Disaster Map: {selectedDisaster} Zones
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {filteredEvents.length} Active Records
            </span>
          </div>

          {/* Stylized SVG Map of India */}
          <div className="relative w-full h-[440px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
            {/* Grid Coordinates Lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />

            <svg
              className="w-full h-full max-h-[380px] text-slate-800 drop-shadow-2xl"
              viewBox="0 0 400 480"
              fill="currentColor"
            >
              {/* Simplified India Mainland Outline Silhouette */}
              <path
                d="M 140 30 
                   Q 160 20 185 25 
                   L 200 45 L 230 65 L 245 90 L 220 105 L 205 130 
                   L 260 145 L 320 135 L 360 145 L 380 170 L 350 195 L 310 195 
                   L 280 215 L 260 250 L 250 280 L 230 330 L 200 390 L 180 435 
                   L 170 410 L 150 360 L 135 320 L 115 270 L 105 240 L 75 225 
                   L 55 240 L 40 215 L 70 190 L 110 160 L 130 110 L 120 70 Z"
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="2"
              />

              {/* State divider accent hints */}
              <path
                d="M 180 130 L 205 200 L 230 270 M 110 160 L 180 170 L 260 180 M 150 240 L 200 240"
                fill="none"
                stroke="#0f172a"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            </svg>

            {/* Render Interactive Geo-Pins for Filtered Disaster Events */}
            {filteredEvents.map((event) => {
              const isSelected = activeEvent?.id === event.id;

              // Compute normalized visual pin coordinates on the India SVG projection
              // India bounding box approx: Lat 8 to 36, Lng 68 to 97
              const latMin = 8;
              const latMax = 36;
              const lngMin = 68;
              const lngMax = 97;

              const xNorm = ((event.coordinates[1] - lngMin) / (lngMax - lngMin)) * 75 + 12;
              const yNorm = (1 - (event.coordinates[0] - latMin) / (latMax - latMin)) * 75 + 12;

              return (
                <div
                  key={event.id}
                  onClick={() => setSelectedEventId(event.id)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group transition-all ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                  style={{ left: `${xNorm}%`, top: `${yNorm}%` }}
                >
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-2xl font-bold text-[10px] border backdrop-blur transition-all ${
                      isSelected
                        ? 'bg-rose-600 text-white border-white ring-4 ring-rose-600/30'
                        : 'bg-slate-900/90 text-white border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        event.riskLevel === 'Critical'
                          ? 'bg-red-400 animate-ping'
                          : event.riskLevel === 'High'
                          ? 'bg-orange-400'
                          : event.riskLevel === 'Moderate'
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                    />
                    <span>{event.state}</span>
                  </div>

                  {/* Tooltip on hover */}
                  <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap bg-slate-900 border border-slate-700 text-white text-[10px] px-2 py-1 rounded shadow-xl pointer-events-none">
                    {event.eventLocation} · {event.latestReading}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>Click any state location pin on the map to view detailed emergency telemetry.</span>
            </span>
            <span className="font-mono text-slate-500">Source: NDMA / IMD / CWC</span>
          </div>
        </div>

        {/* Right Column: Information Cards & Event Inspector */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Inspected Event Detail Card */}
          {activeEvent && (
            <div className="bg-slate-900 border-2 border-blue-500/50 rounded-xl p-5 shadow-2xl space-y-3">
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{activeEvent.state}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${riskBadge(
                        activeEvent.riskLevel
                      )}`}
                    >
                      {activeEvent.riskLevel} Risk
                    </span>
                  </div>
                  <div className="text-xs text-blue-400 font-medium mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{activeEvent.eventLocation}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-1 rounded">
                  {activeEvent.disasterType}
                </span>
              </div>

              {/* Latest Available Reading */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Latest Available Reading</div>
                <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">
                  {activeEvent.latestReading}
                </div>
              </div>

              {/* Summary */}
              <div>
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Event Analysis
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{activeEvent.summary}</p>
              </div>

              {/* Institutional Protocol Advised */}
              <div className="p-3 bg-blue-950/30 border border-blue-800/50 rounded-lg text-xs space-y-1">
                <div className="font-bold text-blue-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Educational Institution Protocol</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {activeEvent.actionsAdvised}
                </p>
              </div>

              {/* Source & Updated Time */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{activeEvent.updatedAt}</span>
                </span>
                <span className="text-slate-300">{activeEvent.source}</span>
              </div>
            </div>
          )}

          {/* Regional Event Cards List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              All {selectedDisaster} Events in India
            </h4>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {filteredEvents.map((event) => {
                const isSelected = activeEvent?.id === event.id;

                return (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEventId(event.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-850 border-blue-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{event.state} - {event.eventLocation}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-[220px]">
                        {event.latestReading}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
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
