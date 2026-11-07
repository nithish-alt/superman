import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EmergencyServiceType } from '../types';
import {
  PhoneCall,
  Ambulance,
  Flame,
  Shield,
  LifeBuoy,
  MapPin,
  Send,
  CheckCircle2,
  AlertTriangle,
  LocateFixed,
  Clock,
  Compass,
  Check,
  Phone,
  FileText,
} from 'lucide-react';

export const SosPage: React.FC = () => {
  const { userRole, submitSOSRequest, sosRequests, updateSOSStatus } = useApp();

  const [selectedService, setSelectedService] = useState<EmergencyServiceType>('Ambulance');
  const [userName, setUserName] = useState<string>(
    userRole === 'CHAIRMAN'
      ? 'Dr. Ramesh Sharma (Chairman)'
      : userRole === 'TEACHER'
      ? 'Mrs. Priya Nair (Teacher)'
      : 'Aryan Patel (Student Class 11)'
  );
  const [emergencyType, setEmergencyType] = useState<string>('Medical Injury / Trauma');
  const [locationText, setLocationText] = useState<string>('Academic Block A, Ground Floor Staircase');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>({
    lat: 12.9716,
    lng: 77.5946,
  });
  const [geoStatus, setGeoStatus] = useState<string | null>(null);
  const [emergencyMessage, setEmergencyMessage] = useState<string>(
    'Student slipped during staircase exit drill, minor limb pain, needs stretcher or first-aid kit.'
  );
  const [additionalInfo, setAdditionalInfo] = useState<string>('Accompanied by Class Teacher and peer volunteer.');

  // Confirmed submission state
  const [latestSubmittedId, setLatestSubmittedId] = useState<string | null>(null);

  // Browser Geolocation API
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('Geolocation is not supported by your browser.');
      return;
    }

    setGeoStatus('Requesting GPS coordinates...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(5));
        const lng = Number(position.coords.longitude.toFixed(5));
        setCoords({ lat, lng });
        setLocationText(`GPS Verified: ${lat}° N, ${lng}° E (Campus Grid)`);
        setGeoStatus(`Coordinates locked: ${lat}° N, ${lng}° E`);
      },
      (error) => {
        setGeoStatus(`GPS access: ${error.message}. Using simulated campus geofence.`);
        setCoords({ lat: 12.9716, lng: 77.5946 });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSendSOS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !emergencyMessage.trim()) return;

    const reqId = submitSOSRequest({
      userName: userName.trim(),
      userRole,
      service: selectedService,
      emergencyType,
      location: locationText.trim(),
      latitude: coords?.lat,
      longitude: coords?.lng,
      message: emergencyMessage.trim(),
      additionalInfo: additionalInfo.trim() || undefined,
    });

    setLatestSubmittedId(reqId);
  };

  const services: Array<{
    type: EmergencyServiceType;
    title: string;
    icon: typeof Ambulance;
    description: string;
    helpline: string;
    bgColor: string;
    borderColor: string;
  }> = [
    {
      type: 'Ambulance',
      title: '1. Ambulance',
      icon: Ambulance,
      description: 'Paramedics, trauma kit, stretcher, emergency oxygen support.',
      helpline: '108 / 102',
      bgColor: 'bg-rose-500/10 text-rose-400',
      borderColor: 'border-rose-500',
    },
    {
      type: 'Fire and Rescue',
      title: '2. Fire & Rescue',
      icon: Flame,
      description: 'Fire brigades, hydraulic ladder tenders, chemical neutralizers.',
      helpline: '101',
      bgColor: 'bg-amber-500/10 text-amber-400',
      borderColor: 'border-amber-500',
    },
    {
      type: 'Police',
      title: '3. Police',
      icon: Shield,
      description: 'Campus perimeter security, traffic diversion, crowd regulation.',
      helpline: '112 / 100',
      bgColor: 'bg-blue-500/10 text-blue-400',
      borderColor: 'border-blue-500',
    },
    {
      type: 'Disaster Rescue Team',
      title: '4. Disaster Rescue Team',
      icon: LifeBuoy,
      description: 'NDRF / SDRF battalions, flood rescue boats, heavy cutting gear.',
      helpline: '1078 (NDMA)',
      bgColor: 'bg-emerald-500/10 text-emerald-400',
      borderColor: 'border-emerald-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
              <PhoneCall className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white">SOS EMERGENCY SYSTEM</h1>
            <span className="text-xs bg-red-600/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded font-mono">
              High Priority Dispatch
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Immediate emergency escalation interface for Indian educational institutions. Log critical medical, fire, or structural distress with browser geolocation and live coordination.
          </p>
        </div>

        {/* CALL 112 NATIONAL EMERGENCY BUTTON */}
        <div className="flex items-center gap-3">
          <a
            href="tel:112"
            onClick={(e) => {
              // Non-blocking prompt for demo
            }}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-xl shadow-red-600/40 border border-red-400 transition-transform active:scale-95"
          >
            <Phone className="w-4 h-4 animate-bounce" />
            <span>CALL 112 (INDIA EMERGENCY)</span>
          </a>
        </div>
      </div>

      {/* 4 EMERGENCY SERVICE OPTIONS */}
      <div>
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
          Step 1: Select Required Emergency Service Option
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((svc) => {
            const isSelected = selectedService === svc.type;
            const Icon = svc.icon;

            return (
              <button
                key={svc.type}
                onClick={() => setSelectedService(svc.type)}
                className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? `${svc.borderColor} bg-slate-800/90 shadow-xl ring-2 ring-white/10`
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${svc.bgColor}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        <Check className="w-3 h-3" /> Selected
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{svc.title}</h3>
                  <p className="text-xs text-slate-400 leading-snug">{svc.description}</p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Direct Helpline:</span>
                  <span className="font-mono font-bold text-white">{svc.helpline}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* EMERGENCY FORM & MAP PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Step 2: Emergency Request Details</h3>
              <p className="text-[11px] text-slate-400">Fill in critical particulars for first responders</p>
            </div>
            <span className="text-xs font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
              Service: {selectedService}
            </span>
          </div>

          <form onSubmit={handleSendSOS} className="space-y-4 text-xs">
            {/* User Name & Emergency Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  User Name / Caller ID *
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  placeholder="e.g. Aryan Patel (Student) or Mrs. Priya Nair"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Emergency Category *
                </label>
                <select
                  value={emergencyType}
                  onChange={(e) => setEmergencyType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Medical Injury / Trauma">Medical Injury / Trauma</option>
                  <option value="Fire / Smoke Outbreak">Fire / Smoke Outbreak</option>
                  <option value="Structural Damage / Trapped">Structural Damage / Trapped</option>
                  <option value="Flash Flood / Water Hazard">Flash Flood / Water Hazard</option>
                  <option value="Severe Asthma / Asphyxiation">Severe Asthma / Asphyxiation</option>
                  <option value="Security / Perimeter Breach">Security / Perimeter Breach</option>
                </select>
              </div>
            </div>

            {/* Current Location + GET MY LOCATION BUTTON */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-semibold">
                  Current Location on Campus *
                </label>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-md font-semibold text-[11px] flex items-center gap-1.5 transition-colors"
                >
                  <LocateFixed className="w-3.5 h-3.5" />
                  <span>GET MY LOCATION (GPS)</span>
                </button>
              </div>

              <input
                type="text"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                required
                placeholder="e.g. Academic Block A, 1st Floor Corridor / Near Science Lab"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />

              {geoStatus && (
                <div className="mt-1 text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                  <Compass className="w-3 h-3" />
                  <span>{geoStatus}</span>
                </div>
              )}
            </div>

            {/* Emergency Message */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Emergency Message / Immediate Symptoms *
              </label>
              <textarea
                rows={3}
                value={emergencyMessage}
                onChange={(e) => setEmergencyMessage(e.target.value)}
                required
                placeholder="Describe the urgent situation concisely..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Additional Information (People count, obstacles, landmarks)
              </label>
              <input
                type="text"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="e.g. 2 students trapped behind fire door; smoke rising from basement."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            {/* SEND SOS REQUEST BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-black text-sm tracking-wide shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 border border-red-400 transition-transform active:scale-[0.99]"
              >
                <Send className="w-4 h-4 animate-pulse" />
                <span>SEND SOS REQUEST</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Location Map Preview & Confirmation Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* Map Preview Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>Geolocation Campus Preview</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Lat: {coords?.lat || 12.9716}, Lng: {coords?.lng || 77.5946}
              </span>
            </div>

            {/* Visual Mini Map Radar */}
            <div className="relative w-full h-44 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
              {/* Radar Grid Circles */}
              <div className="absolute w-36 h-36 rounded-full border border-blue-500/20" />
              <div className="absolute w-24 h-24 rounded-full border border-blue-500/30" />
              <div className="absolute w-12 h-12 rounded-full border border-blue-500/40" />
              <div className="absolute w-full h-[1px] bg-blue-500/15" />
              <div className="absolute h-full w-[1px] bg-blue-500/15" />

              {/* Ping Marker */}
              <div className="relative z-10 flex flex-col items-center">
                <span className="w-5 h-5 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-white shadow-xl animate-pulse">
                  <MapPin className="w-3 h-3" />
                </span>
                <span className="mt-1 text-[10px] font-bold text-white bg-slate-900/90 border border-slate-700 px-2 py-0.5 rounded shadow">
                  {locationText.slice(0, 24)}...
                </span>
              </div>
            </div>

            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Geofence: South Campus Quad</span>
              <span className="text-emerald-400 font-medium">Accuracy: ±5m</span>
            </div>
          </div>

          {/* Emergency Request Confirmation Card (when submitted) */}
          {latestSubmittedId && (
            <div className="bg-emerald-950/40 border-2 border-emerald-500/60 rounded-xl p-4 space-y-3 shadow-xl animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">Emergency Request Logged</h4>
                  <div className="text-[11px] font-mono text-emerald-300">
                    ID: {latestSubmittedId}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Service:</span>
                  <span className="font-bold text-white">{selectedService}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Caller:</span>
                  <span className="text-white">{userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-white truncate max-w-[200px]">{locationText}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-bold text-amber-400">
                    Received & Relayed to Campus Marshals
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400">
                Incident logged in the Chairman and Floor Marshals monitoring queue.
              </p>
            </div>
          )}

          {/* Mandatory Demo Disclaimer */}
          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Simulated Frontend Demo Disclaimer</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              This is an institutional preparedness system demo. Submitting an SOS logs the event locally for training verification; it does <strong>not</strong> contact real municipal ambulances or emergency responders. For genuine life-threatening emergencies, dial <strong>112</strong> immediately.
            </p>
          </div>
        </div>
      </div>

      {/* SOS Requests History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Live SOS Log & Dispatch Status</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Total Logged: {sosRequests.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-mono">
                <th className="py-2.5 px-3">Req ID</th>
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3">Caller</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Emergency Note</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {sosRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-white">{req.id}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-white">{req.service}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">{req.userName}</td>
                  <td className="py-2.5 px-3 text-slate-400">{req.location}</td>
                  <td className="py-2.5 px-3 text-slate-300 max-w-xs truncate">{req.message}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        req.status === 'Resolved'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {userRole === 'CHAIRMAN' && req.status !== 'Resolved' && (
                      <button
                        onClick={() => updateSOSStatus(req.id, 'Resolved')}
                        className="px-2.5 py-1 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded text-[11px] font-semibold transition-colors"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
