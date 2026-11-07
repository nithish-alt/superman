import React from 'react';
import { CampusMarker, BlockedZone, DisasterCategory } from '../../types';
import {
  Printer,
  X,
  FileText,
  DoorOpen,
  MapPin,
  AlertOctagon,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Building2,
  Download,
} from 'lucide-react';

interface EvacuationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  markers: CampusMarker[];
  blockedZones: BlockedZone[];
  emergencyStatus: string;
  activeDisaster: DisasterCategory;
  originName: string;
  institutionName?: string;
}

export const EvacuationReportModal: React.FC<EvacuationReportModalProps> = ({
  isOpen,
  onClose,
  markers,
  blockedZones,
  emergencyStatus,
  activeDisaster,
  originName,
  institutionName = 'Delhi Public School & Junior Science College (South Campus)',
}) => {
  if (!isOpen) return null;

  const exitGates = markers.filter((m) => m.type === 'EXIT_GATE');
  const assemblyPoints = markers.filter((m) => m.type === 'ASSEMBLY_POINT');
  const totalCapacity = markers.reduce((acc, m) => acc + (m.capacity || 0), 0);

  const reportDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const reportTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Modal Controls Header (Hidden in Print) */}
        <div className="no-print p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Printable Evacuation Status Report</h3>
              <p className="text-[11px] text-slate-400">
                Official PDF summary of all assigned Exit Gates and Assembly Points
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-transform active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet View */}
        <div className="p-6 sm:p-8 overflow-y-auto bg-slate-900 text-slate-100 print:p-0 print:bg-white print:text-slate-900">
          <div
            id="printable-evacuation-report"
            className="space-y-6 max-w-3xl mx-auto bg-white text-slate-900 p-8 rounded-xl shadow-lg print:shadow-none print:p-0 print:m-0"
          >
            {/* Header / Institutional Masthead */}
            <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
                  <ShieldCheck className="w-4 h-4" />
                  <span>National Disaster Management Protocol (NDMA Guidelines)</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 mt-1 tracking-tight">
                  {institutionName}
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  Campus Incident Command Cell · Emergency Preparedness & Cadastre Division
                </p>
              </div>

              <div className="text-left sm:text-right text-xs font-mono shrink-0">
                <div className="bg-slate-100 text-slate-800 px-2 py-1 rounded font-bold inline-block border border-slate-300">
                  DOC ID: EVAC-2026-0941
                </div>
                <div className="text-slate-500 text-[11px] mt-1">
                  Generated: {reportDate} · {reportTime} IST
                </div>
              </div>
            </div>

            {/* Status & Telemetry Metadata Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">
                  Campus Status
                </span>
                <span className="font-bold text-slate-900">{emergencyStatus}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">
                  Disaster Scenario
                </span>
                <span className="font-bold text-red-600">{activeDisaster} Protocol</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">
                  Default Start Point
                </span>
                <span className="font-bold text-slate-900 truncate block">{originName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">
                  Total Safe Capacity
                </span>
                <span className="font-bold text-emerald-700 font-mono">
                  {totalCapacity.toLocaleString()} Persons
                </span>
              </div>
            </div>

            {/* SECTION 1: ASSIGNED EXIT GATES */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-300">
                <div className="flex items-center gap-2">
                  <DoorOpen className="w-4 h-4 text-red-600" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    1. Assigned Campus Exit Gates Status
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-600 font-bold">
                  {exitGates.length} Gates Configured
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="py-2 px-2.5 border-b border-slate-200">Code</th>
                      <th className="py-2 px-2.5 border-b border-slate-200">Gate Name & Location</th>
                      <th className="py-2 px-2.5 border-b border-slate-200">Capacity</th>
                      <th className="py-2 px-2.5 border-b border-slate-200">Operational Status</th>
                      <th className="py-2 px-2.5 border-b border-slate-200">Access Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {exitGates.map((gate) => (
                      <tr key={gate.id} className="hover:bg-slate-50">
                        <td className="py-2 px-2.5 font-mono font-bold text-slate-900">
                          {gate.gateCode || 'EG'}
                        </td>
                        <td className="py-2 px-2.5 font-semibold text-slate-900">
                          {gate.name}
                        </td>
                        <td className="py-2 px-2.5 font-mono text-slate-700">
                          {gate.capacity || 1000}
                        </td>
                        <td className="py-2 px-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                              gate.status === 'OPEN'
                                ? 'bg-emerald-100 text-emerald-800'
                                : gate.status === 'CONGESTED'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {gate.status}
                          </span>
                        </td>
                        <td className="py-2 px-2.5 text-slate-600 text-[11px]">
                          {gate.details || 'Standard egress gate'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 2: ASSIGNED ASSEMBLY POINTS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    2. Assigned Campus Assembly Points Status
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-600 font-bold">
                  {assemblyPoints.length} Points Configured
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="py-2 px-2.5 border-b border-slate-200">Code</th>
                      <th className="py-2 px-2.5 border-b border-slate-200">Assembly Zone</th>
                      <th className="py-2 px-2.5 border-b border-slate-200">Safe Capacity</th>
                      <th className="py-2 px-2.5 border-b border-slate-200">Status</th>
                      <th className="py-2 px-2.5 border-b border-slate-200">Facility & Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {assemblyPoints.map((ap) => (
                      <tr key={ap.id} className="hover:bg-slate-50">
                        <td className="py-2 px-2.5 font-mono font-bold text-slate-900">
                          {ap.gateCode || 'AP'}
                        </td>
                        <td className="py-2 px-2.5 font-semibold text-slate-900">
                          {ap.name}
                        </td>
                        <td className="py-2 px-2.5 font-mono text-slate-700">
                          {ap.capacity || 2000}
                        </td>
                        <td className="py-2 px-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                              ap.status === 'OPEN'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ap.status}
                          </span>
                        </td>
                        <td className="py-2 px-2.5 text-slate-600 text-[11px]">
                          {ap.details || 'Primary student muster arena with first aid kit.'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 3: DECLARED BLOCKED / UNSAFE AREAS */}
            {blockedZones.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-300">
                  <AlertOctagon className="w-4 h-4 text-red-600" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    3. Declared Hazardous / Blocked Avoidance Corridors
                  </h2>
                </div>
                <div className="space-y-1.5 text-xs">
                  {blockedZones.map((bz) => (
                    <div
                      key={bz.id}
                      className="p-2 bg-red-50 border border-red-200 rounded flex items-center justify-between"
                    >
                      <div>
                        <strong className="text-red-900">{bz.name}</strong>
                        <span className="text-slate-600 ml-2">({bz.reason})</span>
                      </div>
                      <span className="text-[10px] font-bold font-mono text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                        Avoid: {bz.disasterType} Risk
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Official Certification / Signature Block */}
            <div className="pt-6 border-t-2 border-slate-900 mt-6 grid grid-cols-2 gap-8 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase font-mono">
                  Prepared & Verified By
                </span>
                <div className="font-bold text-slate-950">Mrs. Priya Nair</div>
                <div className="text-[11px] text-slate-600">Lead Campus Floor Marshal & Safety Officer</div>
                <div className="text-[10px] font-mono text-slate-400 mt-2">Signature Verified: ✓</div>
              </div>

              <div className="space-y-1 text-right">
                <span className="text-slate-500 block text-[10px] uppercase font-mono">
                  Approved by Incident Commander
                </span>
                <div className="font-bold text-slate-950">Dr. Ramesh Sharma</div>
                <div className="text-[11px] text-slate-600">Chairman & Chief Incident Commander</div>
                <div className="text-[10px] font-mono text-slate-400 mt-2">Official Institutional Seal ✓</div>
              </div>
            </div>

            {/* Legal Footnote */}
            <div className="text-[10px] text-slate-500 border-t border-slate-200 pt-2 text-center font-mono">
              Report generated via SURAKSHA AI Disaster Preparedness & Evacuation Management System.
              Valid for drill evaluation and institutional disaster safety compliance audits.
            </div>
          </div>
        </div>

        {/* Modal Footer Controls (Hidden in Print) */}
        <div className="no-print p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            Print preview ready · Click Print / Save as PDF to generate hard copy
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
