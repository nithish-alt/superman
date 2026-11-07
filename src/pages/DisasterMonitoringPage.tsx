import React, { useState } from 'react';
import {
  Activity,
  Droplets,
  Wind,
  Flame,
  AlertTriangle,
  Info,
  Compass,
  ArrowUpRight,
  TrendingUp,
  BarChart2,
  ShieldAlert,
  Gauge,
  Radio,
} from 'lucide-react';

export const DisasterMonitoringPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'FLOOD' | 'EARTHQUAKE' | 'CYCLONE'>('ALL');

  const warningLevelConfig = {
    Low: { label: 'Green: Low Risk', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    Moderate: { label: 'Yellow: Moderate Risk', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    High: { label: 'Orange: High Risk', badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
    Critical: { label: 'Red: Critical Risk', badge: 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse' },
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <Activity className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white">DISASTER PREDICTION & MONITORING</h1>
            <span className="text-xs bg-red-600/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded font-mono">
              India Telemetry (Demo)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time multi-hazard telemetry tracking flood discharge, seismological network bulletins, and coastal cyclonic storms across India.
          </p>
        </div>

        {/* Tab filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
          {(['ALL', 'FLOOD', 'EARTHQUAKE', 'CYCLONE'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'ALL' ? 'All Hazards' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Mandatory Scientific Disclaimer Banner */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200/90 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">Scientific & Telemetry Disclaimer:</span> Earthquakes cannot be predicted in advance with precision. This system displays official seismic monitoring records from the National Centre for Seismology (NCS) and meteorological storm projections from the India Meteorological Department (IMD). <strong>All figures shown are calibrated simulated demo readings.</strong>
        </div>
      </div>

      {/* SECTION A: FLOOD MONITORING */}
      {(activeTab === 'ALL' || activeTab === 'FLOOD') && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  A. FLOOD MONITORING & RIVER BASIN TELEMETRY
                </h2>
                <div className="text-[11px] text-slate-400">
                  Data Stream: Central Water Commission (CWC) & State Hydrology Cells
                </div>
              </div>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${warningLevelConfig.High.badge}`}
            >
              {warningLevelConfig.High.label}
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400">24h Cumulative Rainfall</div>
              <div className="text-xl font-bold font-mono text-white mt-1">142.6 mm</div>
              <div className="text-[10px] text-amber-400 mt-0.5">+38 mm vs yesterday</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400">River Water Level (Brahmaputra)</div>
              <div className="text-xl font-bold font-mono text-rose-400 mt-1">105.82 m</div>
              <div className="text-[10px] text-rose-300 mt-0.5">0.82 m above Danger Mark</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400">Dam Inflow / Outflow</div>
              <div className="text-xl font-bold font-mono text-white mt-1">2,45,000 cusecs</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Controlled discharge</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400">Active Flood Inundation Area</div>
              <div className="text-xl font-bold font-mono text-white mt-1">1,840 sq km</div>
              <div className="text-[10px] text-amber-400 mt-0.5">18 riparian taluks affected</div>
            </div>
          </div>

          {/* Regional Table & Visual Gauge */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px]">
                    <th className="py-2 px-2">Basin / Location</th>
                    <th className="py-2 px-2">Current Level</th>
                    <th className="py-2 px-2">Danger Mark</th>
                    <th className="py-2 px-2">Risk Status</th>
                    <th className="py-2 px-2">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-2 px-2 font-semibold text-white">Brahmaputra (Guwahati)</td>
                    <td className="py-2 px-2 font-mono text-rose-400">105.82 m</td>
                    <td className="py-2 px-2 font-mono text-slate-400">105.00 m</td>
                    <td className="py-2 px-2">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-300">
                        Critical Warning
                      </span>
                    </td>
                    <td className="py-2 px-2 font-mono text-rose-400">Rising (▲)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 font-semibold text-white">Kosi (Birpur Barrage)</td>
                    <td className="py-2 px-2 font-mono text-amber-400">72.40 m</td>
                    <td className="py-2 px-2 font-mono text-slate-400">73.10 m</td>
                    <td className="py-2 px-2">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300">
                        Moderate Warning
                      </span>
                    </td>
                    <td className="py-2 px-2 font-mono text-amber-400">Steady (►)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 font-semibold text-white">Yamuna (Delhi Railway Bridge)</td>
                    <td className="py-2 px-2 font-mono text-emerald-400">204.35 m</td>
                    <td className="py-2 px-2 font-mono text-slate-400">205.33 m</td>
                    <td className="py-2 px-2">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300">
                        Low Risk
                      </span>
                    </td>
                    <td className="py-2 px-2 font-mono text-emerald-400">Receding (▼)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="md:col-span-4 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-blue-400" />
                <span>Institutional Campus Threat</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[65%]" />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>Perimeter Elevation: +12m</span>
                <span className="text-amber-400 font-bold">Risk: Moderate</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Campus storm culverts are flowing at 65% capacity. Ground floor science laboratories on alert.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION B: EARTHQUAKE MONITORING */}
      {(activeTab === 'ALL' || activeTab === 'EARTHQUAKE') && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  B. EARTHQUAKE MONITORING & SEISMIC NETWORK
                </h2>
                <div className="text-[11px] text-slate-400">
                  Data Stream: National Seismological Network (NCS) · Ministry of Earth Sciences
                </div>
              </div>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${warningLevelConfig.Moderate.badge}`}
            >
              {warningLevelConfig.Moderate.label}
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400">Latest Event Magnitude</div>
              <div className="text-xl font-bold font-mono text-amber-400 mt-1">4.3 Mb</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Class: Moderate Crustal</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400">Focal Depth</div>
              <div className="text-xl font-bold font-mono text-white mt-1">12.0 km</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Shallow crustal focus</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400">Epicentre Location</div>
              <div className="text-sm font-bold text-white mt-1 truncate">Chamoli, Uttarakhand</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Himalayan Thrust Belt</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400">Perceived Shaking (MMI)</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">IV (Light)</div>
              <div className="text-[10px] text-emerald-300 mt-0.5">Zero structural damage</div>
            </div>
          </div>

          {/* Seismological Station Log */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>Recent Seismological Station Traces in India (Demo Stream)</span>
              <span className="font-mono text-blue-400">Station Count: 152</span>
            </div>
            <div className="divide-y divide-slate-800/60 text-xs">
              <div className="py-2 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white">Station DDI (Dehradun)</span>
                  <span className="text-slate-400 ml-2">P-wave arrival 06:14:22 IST · S-wave delay 4.2s</span>
                </div>
                <span className="font-mono text-amber-400 font-semibold">Mag 4.3</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white">Station BHU (Bhuj, Gujarat)</span>
                  <span className="text-slate-400 ml-2">Micro-tremor swarm · Fault rupture stabilized</span>
                </div>
                <span className="font-mono text-emerald-400 font-semibold">Mag 3.2</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white">Station SHL (Shillong, Meghalaya)</span>
                  <span className="text-slate-400 ml-2">Deep focus intra-plate seismic pulse</span>
                </div>
                <span className="font-mono text-amber-400 font-semibold">Mag 4.1</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION C: CYCLONE MONITORING */}
      {(activeTab === 'ALL' || activeTab === 'CYCLONE') && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
                <Wind className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  C. TROPICAL CYCLONE RADAR & TRACKING
                </h2>
                <div className="text-[11px] text-slate-400">
                  Data Stream: India Meteorological Department (IMD) Cyclone Warning Division
                </div>
              </div>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${warningLevelConfig.Critical.badge}`}
            >
              {warningLevelConfig.Critical.label}
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400">Designated Cyclone Name</div>
              <div className="text-xl font-bold font-mono text-white mt-1">CYCLONE DANA</div>
              <div className="text-[10px] text-rose-400 mt-0.5">Severe Cyclonic Storm</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400">Max Sustained Wind Speed</div>
              <div className="text-xl font-bold font-mono text-rose-400 mt-1">115 - 125 km/h</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Gusting to 140 km/h</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400">Movement Trajectory</div>
              <div className="text-xl font-bold font-mono text-white mt-1">North-Northwest</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Velocity: 14 km/h</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400">Projected Landfall Window</div>
              <div className="text-xl font-bold font-mono text-amber-400 mt-1">Within 18 Hours</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Puri to Sagar Island</div>
            </div>
          </div>

          {/* Coastal Impact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center justify-between">
                <span>Odisha Coastal Belt</span>
                <span className="text-red-400 font-mono">RED ALERT</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Kendrapara, Jagatsinghpur, Balasore: Coastal schools requisitioned as cyclone shelters. Evacuation drill complete.
              </p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center justify-between">
                <span>West Bengal (Sunderbans)</span>
                <span className="text-red-400 font-mono">RED ALERT</span>
              </div>
              <p className="text-[11px] text-slate-400">
                East Midnapore, South 24 Parganas: High tidal surges of 1.5-2.0m predicted. Fishermen completely grounded.
              </p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center justify-between">
                <span>Andhra Pradesh (North Coast)</span>
                <span className="text-amber-400 font-mono">ORANGE ALERT</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Srikakulam, Visakhapatnam: Heavy squalls and localized rain bands. Standby generator drills active.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
