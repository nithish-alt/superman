import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Building2,
  Phone,
  Volume2,
  Bell,
  RotateCcw,
  ShieldCheck,
  Check,
  Info,
  Sliders,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    isSirenPlaying,
    toggleSiren,
    resetSatelliteMapToDefault,
  } = useApp();

  const [institutionName, setInstitutionName] = useState<string>(
    'Delhi Public School & Junior Science College (South Campus)'
  );
  const [affiliationCode, setAffiliationCode] = useState<string>('CBSE / CISCE #DL-88219');
  const [districtState, setDistrictState] = useState<string>('Bengaluru Urban, Karnataka');
  const [incidentCommander, setIncidentCommander] = useState<string>(
    'Dr. Ramesh Sharma (Chairman & Principal)'
  );
  const [campusArea, setCampusArea] = useState<string>('32 Acres (3 Academic Blocks + 1 Stadium)');

  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-white shadow">
              <Settings className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white">CAMPUS EMERGENCY SETTINGS</h1>
            <span className="text-xs bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded font-mono">
              System Configuration
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Configure school profile parameters, emergency contact directories, audio siren alarm settings, and reset mock drill states.
          </p>
        </div>

        {savedFeedback && (
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>Settings Saved Locally</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Institutional Profile Form */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Building2 className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Educational Institution Information
            </h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                School / College Registered Name *
              </label>
              <input
                type="text"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Affiliation / U-DISE Code
                </label>
                <input
                  type="text"
                  value={affiliationCode}
                  onChange={(e) => setAffiliationCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  District & State
                </label>
                <input
                  type="text"
                  value={districtState}
                  onChange={(e) => setDistrictState(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Incident Commander / Chairman
                </label>
                <input
                  type="text"
                  value={incidentCommander}
                  onChange={(e) => setIncidentCommander(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Campus Area & Layout
                </label>
                <input
                  type="text"
                  value={campusArea}
                  onChange={(e) => setCampusArea(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>

          {/* Siren Hardware & Audio Drill Simulation */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Audible Emergency Siren Alarm (Web Audio Synthesis)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">550Hz ~ 880Hz Warble</span>
            </div>

            <p className="text-xs text-slate-400">
              Test the synthesized frequency modulator simulating high-decibel campus loudspeakers during emergency fire, earthquake, and cyclone evacuation drills.
            </p>

            <button
              onClick={toggleSiren}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                isSirenPlaying
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
              }`}
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>{isSirenPlaying ? 'Stop Siren Audio Test' : 'Run 10-Second Siren Test'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Emergency Helplines & System Reset */}
        <div className="lg:col-span-5 space-y-5">
          {/* Official Indian Emergency Contacts Directory */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Phone className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Emergency Speed-Dial Directory (India)
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-950 rounded-lg flex items-center justify-between border border-slate-800">
                <div>
                  <div className="font-bold text-white">Unified Emergency Helpline</div>
                  <div className="text-[11px] text-slate-400">Police, Fire & Ambulance</div>
                </div>
                <span className="text-sm font-mono font-bold text-rose-400">112</span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-lg flex items-center justify-between border border-slate-800">
                <div>
                  <div className="font-bold text-white">NDMA Disaster Relief Helpline</div>
                  <div className="text-[11px] text-slate-400">National Disaster Management Authority</div>
                </div>
                <span className="text-sm font-mono font-bold text-amber-400">1078</span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-lg flex items-center justify-between border border-slate-800">
                <div>
                  <div className="font-bold text-white">State Disaster Operations Centre</div>
                  <div className="text-[11px] text-slate-400">Karnataka State Disaster Management</div>
                </div>
                <span className="text-sm font-mono font-bold text-blue-400">1070</span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-lg flex items-center justify-between border border-slate-800">
                <div>
                  <div className="font-bold text-white">Child Helpline India</div>
                  <div className="text-[11px] text-slate-400">Ministry of Women & Child Development</div>
                </div>
                <span className="text-sm font-mono font-bold text-emerald-400">1098</span>
              </div>
            </div>
          </div>

          {/* Demo Reset Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <RotateCcw className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Reset Demo Drill State
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Restore the campus satellite imagery and map markers back to default demonstration presets.
            </p>

            <button
              onClick={resetSatelliteMapToDefault}
              className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Default Satellite Campus Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
