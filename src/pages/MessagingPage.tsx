import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChatMessage, ChatGroup } from '../types';
import {
  MessageSquare,
  Send,
  Paperclip,
  Search,
  Users,
  ShieldAlert,
  Flame,
  Radio,
  Clock,
  CheckCheck,
  AlertTriangle,
  Info,
} from 'lucide-react';

export const MessagingPage: React.FC = () => {
  const {
    chatGroups,
    chatMessages,
    selectedGroupId,
    setSelectedGroupId,
    sendChatMessage,
    userRole,
  } = useApp();

  const [inputText, setInputText] = useState<string>('');
  const [isEmergencyBroadcast, setIsEmergencyBroadcast] = useState<boolean>(false);
  const [simulatedAttachment, setSimulatedAttachment] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const activeGroup =
    chatGroups.find((g) => g.id === selectedGroupId) || chatGroups[0];

  const activeMessages = chatMessages.filter(
    (m) => m.groupId === activeGroup?.id
  );

  const filteredGroups = chatGroups.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !simulatedAttachment) return;

    sendChatMessage(
      inputText.trim(),
      isEmergencyBroadcast,
      simulatedAttachment || undefined
    );

    setInputText('');
    setIsEmergencyBroadcast(false);
    setSimulatedAttachment(null);
  };

  const handleAttachDemoFile = () => {
    const sampleFiles = [
      'Campus_Evacuation_FloorPlan_v3.pdf',
      'RollCall_Checklist_Assembly_Alpha.xlsx',
      'NDRF_Contact_Roster.pdf',
    ];
    const picked = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];
    setSimulatedAttachment(picked);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white">EMERGENCY MESSAGING SYSTEM</h1>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-mono">
              Role-Authorized Comms
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Encrypted institutional channels connecting Chairman, Faculty Floor Marshals, Emergency Response Teams, and Student Cohorts.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Local Tactical Comms Online</span>
        </div>
      </div>

      {/* Modern Two-Panel Chat Interface */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Left Panel: Contact & Group List */}
        <div className="md:col-span-4 border-r border-slate-800 flex flex-col justify-between bg-slate-950/70">
          <div>
            {/* Search Header */}
            <div className="p-4 border-b border-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search communication groups..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Channels & Group List */}
            <div className="divide-y divide-slate-800/60 overflow-y-auto max-h-[460px]">
              {filteredGroups.map((group) => {
                const isSelected = activeGroup?.id === group.id;

                return (
                  <button
                    key={group.id}
                    onClick={() => setSelectedGroupId(group.id)}
                    className={`w-full p-4 text-left transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-slate-850 border-l-2 border-indigo-500'
                        : 'hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>

                    <div className="flex-1 truncate">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-bold text-white truncate">
                          {group.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {group.lastTimestamp}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 truncate leading-snug">
                        {group.description}
                      </p>

                      <div className="mt-1 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 truncate max-w-[170px]">
                          {group.lastMessage || 'Active channel'}
                        </span>
                        {group.unreadCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
                            {group.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Profile Badge at bottom of contact list */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-semibold text-white">Transmitting as: {userRole}</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">AES-256 (Demo)</span>
          </div>
        </div>

        {/* Right Panel: Chat History & Input */}
        <div className="md:col-span-8 flex flex-col justify-between bg-slate-900/90">
          {/* Active Channel Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">{activeGroup.name}</h3>
                <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                  {activeGroup.participants.length} Active Parties
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{activeGroup.description}</p>
            </div>
          </div>

          {/* Message Stream */}
          <div className="p-5 overflow-y-auto space-y-4 flex-1 max-h-[460px]">
            {activeMessages.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-xs text-slate-500">
                No messages in this channel yet. Send the first operational update below.
              </div>
            ) : (
              activeMessages.map((msg) => {
                const isCurrentUser =
                  (userRole === 'CHAIRMAN' && msg.senderRole === 'CHAIRMAN') ||
                  (userRole === 'TEACHER' && msg.senderRole === 'TEACHER') ||
                  (userRole === 'STUDENT' && msg.senderRole === 'STUDENT');

                // Special Emergency Broadcast Announcement Style
                if (msg.isEmergencyAlert) {
                  return (
                    <div
                      key={msg.id}
                      className="my-3 p-4 bg-gradient-to-r from-red-950/80 via-red-900/70 to-rose-950/80 border-2 border-red-500 rounded-xl shadow-xl space-y-2 animate-in fade-in"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Radio className="w-4 h-4 text-red-400 animate-pulse" />
                          <span className="font-bold text-white uppercase tracking-wider">
                            EMERGENCY COMMAND ANNOUNCEMENT
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-red-300">{msg.timestamp}</span>
                      </div>
                      <p className="text-xs text-red-100 font-semibold leading-relaxed">
                        {msg.text}
                      </p>
                      <div className="text-[10px] text-red-300 font-mono flex items-center justify-between pt-1 border-t border-red-800/60">
                        <span>Authorized By: {msg.senderName}</span>
                        <span>Priority 1</span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-300">{msg.senderName}</span>
                      <span className="font-mono text-[10px]">{msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-3 rounded-2xl max-w-md text-xs leading-relaxed shadow-md ${
                        isCurrentUser
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                      }`}
                    >
                      {msg.text}

                      {msg.attachmentName && (
                        <div className="mt-2 p-2 bg-slate-900/50 rounded border border-white/10 text-[11px] flex items-center gap-2">
                          <Paperclip className="w-3.5 h-3.5" />
                          <span className="font-mono">{msg.attachmentName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Input Toolbar */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-2">
            {/* Attachment preview if selected */}
            {simulatedAttachment && (
              <div className="flex items-center justify-between text-xs bg-slate-800 p-2 rounded-lg text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-blue-400" />
                  <span>Attached: {simulatedAttachment}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setSimulatedAttachment(null)}
                  className="text-red-400 hover:text-white"
                >
                  Remove
                </button>
              </div>
            )}

            <form onSubmit={handleSend} className="flex items-center gap-2">
              {/* Emergency Broadcast Toggle for Chairman/Admins */}
              {userRole === 'CHAIRMAN' && (
                <button
                  type="button"
                  onClick={() => setIsEmergencyBroadcast(!isEmergencyBroadcast)}
                  className={`p-2.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all ${
                    isEmergencyBroadcast
                      ? 'bg-red-600 text-white border-red-400 shadow-lg animate-pulse'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                  title="Toggle Emergency Priority Broadcast Styling"
                >
                  <Flame className="w-4 h-4" />
                </button>
              )}

              {/* Attachment Button */}
              <button
                type="button"
                onClick={handleAttachDemoFile}
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors"
                title="Attach Document / Checklist"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isEmergencyBroadcast
                    ? 'Type CRITICAL EMERGENCY BROADCAST to all stations...'
                    : `Message ${activeGroup.name}...`
                }
                className={`flex-1 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none transition-all ${
                  isEmergencyBroadcast
                    ? 'bg-red-950/60 border-2 border-red-500 placeholder-red-300'
                    : 'bg-slate-950 border border-slate-700 focus:border-indigo-500 placeholder-slate-500'
                }`}
              />

              {/* Send Button */}
              <button
                type="submit"
                className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                  isEmergencyBroadcast
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                }`}
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
