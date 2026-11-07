import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  DisasterCategory,
  AlertSeverity,
  RecipientGroup,
  EmergencyAlert,
} from '../types';
import {
  BellRing,
  Send,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Users,
  MapPin,
  Clock,
  Check,
  ShieldAlert,
  Radio,
  FileText,
  Volume2,
} from 'lucide-react';

export const AlertManagementPage: React.FC = () => {
  const {
    alerts,
    sendEmergencyAlert,
    acknowledgeAlert,
    userRole,
    toggleSiren,
    isSirenPlaying,
  } = useApp();

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [disasterType, setDisasterType] = useState<DisasterCategory>('Cyclone');
  const [severity, setSeverity] = useState<AlertSeverity>('Critical');
  const [title, setTitle] = useState<string>('Immediate Campus Evacuation: Cyclone Squall Warning');
  const [message, setMessage] = useState<string>(
    'All classes must halt immediately. Teachers guide students via designated red route to Assembly Ground Alpha. Maintain silence and accountability.'
  );
  const [location, setLocation] = useState<string>('Entire Campus (All Academic Blocks & Laboratories)');
  const [recipients, setRecipients] = useState<RecipientGroup>('Teachers and students');

  const [confirmationNotice, setConfirmationNotice] = useState<string | null>(null);

  const handleSendAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const totalRecipients =
      recipients === 'All teachers' ? 84 : recipients === 'All students' ? 1420 : 1504;

    sendEmergencyAlert({
      disasterType,
      severity,
      title: title.trim(),
      message: message.trim(),
      location: location.trim(),
      recipients,
      totalRecipients,
      senderName:
        userRole === 'CHAIRMAN'
          ? 'Dr. Ramesh Sharma (Chairman & Incident Commander)'
          : 'Campus Safety Control Room',
    });

    setIsFormOpen(false);
    setConfirmationNotice(`Emergency alert "${title}" broadcast successfully to ${recipients}.`);
    setTimeout(() => setConfirmationNotice(null), 6000);
  };

  const severityStyles: Record<
    AlertSeverity,
    { badge: string; border: string; bg: string; iconColor: string }
  > = {
    Critical: {
      badge: 'bg-red-500/20 text-red-300 border-red-500/40',
      border: 'border-red-500/60',
      bg: 'bg-red-950/30',
      iconColor: 'text-red-400',
    },
    High: {
      badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
      border: 'border-orange-500/60',
      bg: 'bg-orange-950/30',
      iconColor: 'text-orange-400',
    },
    Moderate: {
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      border: 'border-amber-500/50',
      bg: 'bg-amber-950/20',
      iconColor: 'text-amber-400',
    },
    Advisory: {
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      border: 'border-blue-500/40',
      bg: 'bg-blue-950/20',
      iconColor: 'text-blue-400',
    },
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
              <BellRing className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white">ALERT MANAGEMENT</h1>
            <span className="text-xs bg-red-600/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded font-mono">
              Mass Notification Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Broadcast authoritative disaster alerts across school faculty, student channels, and floor marshals. Track live delivery and acknowledgment status.
          </p>
        </div>

        {/* LARGE SEND ALERT BUTTON (Chairman & Admins) */}
        <div className="flex items-center gap-2">
          {userRole === 'CHAIRMAN' ? (
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-xl shadow-red-600/30 border border-red-400 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>{isFormOpen ? 'CLOSE ALERT FORM' : 'SEND ALERT (BROADCAST)'}</span>
            </button>
          ) : (
            <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700">
              Alert broadcasting is reserved for Chairman / Safety Cell.
            </div>
          )}
        </div>
      </div>

      {confirmationNotice && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 p-3.5 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{confirmationNotice}</span>
          </div>
        </div>
      )}

      {/* ALERT CREATION FORM (Expandable Modal or Box) */}
      {isFormOpen && (
        <div className="bg-slate-900 border-2 border-red-500/60 rounded-xl p-5 shadow-2xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Create & Broadcast Disaster Alert
              </h3>
            </div>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSendAlert} className="space-y-4 text-xs">
            {/* Grid 1: Disaster Type, Severity, Recipients */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Disaster Type *</label>
                <select
                  value={disasterType}
                  onChange={(e) => setDisasterType(e.target.value as DisasterCategory)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Cyclone">Cyclone / High Wind</option>
                  <option value="Earthquake">Earthquake</option>
                  <option value="Flood">Monsoon Flood / Inundation</option>
                  <option value="Fire">Fire / Smoke Incident</option>
                  <option value="General">General Disaster Preparedness</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Emergency Severity Level *
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as AlertSeverity)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Critical">Critical (Immediate Danger / Evacuate)</option>
                  <option value="High">High (Level-2 Action Required)</option>
                  <option value="Moderate">Moderate (Preparation & Roll-Call)</option>
                  <option value="Advisory">Advisory (Notice / Weather Update)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Recipient Audience *
                </label>
                <select
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value as RecipientGroup)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Teachers and students">Teachers and students (All 1,504)</option>
                  <option value="All teachers">All teachers (84 Faculty Marshals)</option>
                  <option value="All students">All students (1,420 Enrolled)</option>
                  <option value="Selected groups">Selected groups (Floor Marshals & IRT)</option>
                </select>
              </div>
            </div>

            {/* Grid 2: Title & Affected Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Alert Headline *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Cyclone Squall Warning - Orderly Evacuation"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Specific Location on Campus *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  placeholder="e.g. All Academic Blocks, Science Labs & Sports Quad"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Emergency Message */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Emergency Message & Safety Protocol Directive *
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-slate-400">
                Alert will appear instantly in Teacher and Student notification centers.
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-red-600/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>TRANSMIT ALERT NOW</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ALERT HISTORY LIST */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <h3 className="text-sm font-bold text-white">Broadcast Alerts History</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">{alerts.length} Total Logs</span>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => {
            const style = severityStyles[alert.severity] || severityStyles.Moderate;
            const isAcknowledged = alert.status === 'Acknowledged';

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border ${style.border} ${style.bg} transition-all space-y-3`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${style.badge}`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-xs font-mono bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded">
                      {alert.disasterType}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{alert.timestamp}</span>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Status:</span>
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-semibold ${
                        alert.status === 'Acknowledged'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : alert.status === 'Delivered (demo)'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {alert.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{alert.title}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{alert.message}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      <span>{alert.location}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{alert.recipients}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-400">
                      Acknowledged: <strong className="text-emerald-400">{alert.acknowledgedCount}</strong> /{' '}
                      {alert.totalRecipients}
                    </span>

                    {/* Acknowledge Button for Teachers/Students */}
                    {alert.status !== 'Acknowledged' && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-2.5 py-1 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded text-[11px] font-semibold transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Acknowledge</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
