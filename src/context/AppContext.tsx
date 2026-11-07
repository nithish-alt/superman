import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  PageId,
  CampusMarker,
  BlockedZone,
  EmergencyAlert,
  StudentRecord,
  TeacherRecord,
  SOSRequest,
  ChatMessage,
  ChatGroup,
  DisasterCategory,
} from '../types';
import {
  DEFAULT_CAMPUS_IMAGE,
  INITIAL_MARKERS,
  INITIAL_BLOCKED_ZONES,
  INITIAL_ALERTS,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_CHAT_GROUPS,
  INITIAL_CHAT_MESSAGES,
} from '../data/mockData';

export interface CampusOrigin {
  x: number;
  y: number;
  name: string;
}

interface AppContextType {
  // Navigation & Role
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;

  // Emergency Mode & Real-time Live Drill
  emergencyStatus: 'Normal' | 'Warning' | 'Evacuation Active';
  setEmergencyStatus: (status: 'Normal' | 'Warning' | 'Evacuation Active') => void;
  activeDisasterType: DisasterCategory;
  setActiveDisasterType: (disaster: DisasterCategory) => void;
  isSirenPlaying: boolean;
  toggleSiren: () => void;
  isLiveDrillActive: boolean;
  drillElapsedSeconds: number;
  toggleLiveDrill: () => void;
  resetLiveDrill: () => void;
  speakInstruction: (text: string) => void;

  // Map Management & Custom School Photo
  satelliteMapImage: string;
  setSatelliteMapImage: (imgUrl: string) => void;
  resetSatelliteMapToDefault: () => void;
  markers: CampusMarker[];
  addMarker: (marker: Omit<CampusMarker, 'id'>) => CampusMarker;
  updateMarker: (id: string, updates: Partial<CampusMarker>) => void;
  deleteMarker: (id: string) => void;
  customOrigin: CampusOrigin;
  setCustomOrigin: (origin: CampusOrigin) => void;

  // Blocked / Unsafe Zones
  blockedZones: BlockedZone[];
  addBlockedZone: (zone: Omit<BlockedZone, 'id'>) => void;
  removeBlockedZone: (id: string) => void;

  // Evacuation Selection
  evacuationTargetType: 'EXIT' | 'ASSEMBLY';
  setEvacuationTargetType: (type: 'EXIT' | 'ASSEMBLY') => void;
  selectedMarkerId: string | null;
  setSelectedMarkerId: (id: string | null) => void;

  // SOS Emergency
  sosRequests: SOSRequest[];
  submitSOSRequest: (req: Omit<SOSRequest, 'id' | 'timestamp' | 'status'>) => string;
  updateSOSStatus: (id: string, status: SOSRequest['status']) => void;

  // Alerts
  alerts: EmergencyAlert[];
  sendEmergencyAlert: (newAlert: Omit<EmergencyAlert, 'id' | 'timestamp' | 'status' | 'acknowledgedCount'>) => void;
  acknowledgeAlert: (alertId: string) => void;

  // Student & Teacher Tracking
  students: StudentRecord[];
  updateStudentStatus: (studentId: string, status: StudentRecord['evacuationStatus']) => void;
  teachers: TeacherRecord[];
  updateTeacherStatus: (teacherId: string, status: TeacherRecord['evacuationStatus']) => void;

  // Messaging
  chatGroups: ChatGroup[];
  chatMessages: ChatMessage[];
  selectedGroupId: string;
  setSelectedGroupId: (id: string) => void;
  sendChatMessage: (text: string, isAlert?: boolean, attachmentName?: string) => void;

  // Notifications & Real-Time Feed
  notifications: Array<{ id: string; title: string; message: string; timestamp: string; isRead: boolean; type: string }>;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Quick Action Helpers
  triggerEvacuationQuickAction: (target: 'EXIT' | 'ASSEMBLY') => void;
  confirmStudentSafetyQuickAction: (studentName?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Web Audio API emergency siren synthesizer
class EmergencySirenSynthesizer {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private timer: number | null = null;
  private isHigh: boolean = false;

  start() {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.osc = this.ctx.createOscillator();
      this.gain = this.ctx.createGain();

      this.osc.type = 'sawtooth';
      this.osc.frequency.setValueAtTime(550, this.ctx.currentTime);
      this.gain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      this.osc.connect(this.gain);
      this.gain.connect(this.ctx.destination);
      this.osc.start();

      this.timer = window.setInterval(() => {
        if (!this.osc || !this.ctx) return;
        this.isHigh = !this.isHigh;
        const targetFreq = this.isHigh ? 880 : 480;
        this.osc.frequency.exponentialRampToValueAtTime(targetFreq, this.ctx.currentTime + 0.45);
      }, 500);
    } catch {
      // AudioContext unavailable
    }
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.osc) {
      try {
        this.osc.stop();
        this.osc.disconnect();
      } catch {
        // already stopped
      }
      this.osc = null;
    }
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch {
        // ignore
      }
      this.ctx = null;
    }
  }
}

const sirenSynth = new EmergencySirenSynthesizer();

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>('CHAIRMAN');
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const [emergencyStatus, setEmergencyStatus] = useState<'Normal' | 'Warning' | 'Evacuation Active'>('Warning');
  const [activeDisasterType, setActiveDisasterType] = useState<DisasterCategory>('Cyclone');
  const [isSirenPlaying, setIsSirenPlaying] = useState<boolean>(false);

  // Real-time live drill mode & elapsed timer
  const [isLiveDrillActive, setIsLiveDrillActive] = useState<boolean>(false);
  const [drillElapsedSeconds, setDrillElapsedSeconds] = useState<number>(0);

  // Initialize satellite map from localStorage if available
  const [satelliteMapImage, setSatelliteMapImageState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('suraksha_custom_satellite_map');
      return saved || DEFAULT_CAMPUS_IMAGE;
    } catch {
      return DEFAULT_CAMPUS_IMAGE;
    }
  });

  const [markers, setMarkersState] = useState<CampusMarker[]>(() => {
    try {
      const saved = localStorage.getItem('suraksha_custom_markers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_MARKERS;
    } catch {
      return INITIAL_MARKERS;
    }
  });

  const [customOrigin, setCustomOriginState] = useState<CampusOrigin>(() => {
    try {
      const saved = localStorage.getItem('suraksha_custom_origin');
      if (saved) return JSON.parse(saved);
      return { x: 48, y: 28, name: 'Main Academic Block (Room 102)' };
    } catch {
      return { x: 48, y: 28, name: 'Main Academic Block (Room 102)' };
    }
  });

  const setSatelliteMapImage = (imgUrl: string) => {
    setSatelliteMapImageState(imgUrl);
    try {
      localStorage.setItem('suraksha_custom_satellite_map', imgUrl);
    } catch {
      // LocalStorage quota safety
    }
  };

  const setCustomOrigin = (origin: CampusOrigin) => {
    setCustomOriginState(origin);
    try {
      localStorage.setItem('suraksha_custom_origin', JSON.stringify(origin));
    } catch {
      // ignore
    }
  };

  const [blockedZones, setBlockedZones] = useState<BlockedZone[]>(INITIAL_BLOCKED_ZONES);
  const [evacuationTargetType, setEvacuationTargetType] = useState<'EXIT' | 'ASSEMBLY'>('ASSEMBLY');
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>('marker-ap-1');

  const [sosRequests, setSosRequests] = useState<SOSRequest[]>([
    {
      id: 'SOS-2026-8812',
      userName: 'Aryan Patel (Class 11)',
      userRole: 'STUDENT',
      service: 'Ambulance',
      emergencyType: 'First Aid / Mild Inhalation',
      location: 'Block B Ground Floor near water cooler',
      latitude: 12.9716,
      longitude: 77.5946,
      message: 'Student feeling dizzy during drill stair descent. Need first aid kit.',
      timestamp: '15 mins ago',
      status: 'Escalated to Control Room (Demo)',
      assignedUnit: 'Campus Medical Van Unit 1',
    },
  ]);

  const [alerts, setAlerts] = useState<EmergencyAlert[]>(INITIAL_ALERTS);
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [teachers, setTeachers] = useState<TeacherRecord[]>(INITIAL_TEACHERS);

  const [chatGroups] = useState<ChatGroup[]>(INITIAL_CHAT_GROUPS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('grp-all-safety');

  const [notifications, setNotifications] = useState<
    Array<{ id: string; title: string; message: string; timestamp: string; isRead: boolean; type: string }>
  >([
    {
      id: 'notif-1',
      title: 'Cyclone Preparedness Activated',
      message: 'IMD Coastal Warning: High winds anticipated within 18 hours. Review drill routes.',
      timestamp: '10 mins ago',
      isRead: false,
      type: 'warning',
    },
    {
      id: 'notif-2',
      title: 'New SOS Request Logged',
      message: 'Medical first-aid assistance requested near Block B.',
      timestamp: '15 mins ago',
      isRead: false,
      type: 'sos',
    },
    {
      id: 'notif-3',
      title: 'Gate 4 Marked Congested',
      message: 'Municipal drainage work outside Gate 4. Route traffic via Gate 1 & 2.',
      timestamp: '45 mins ago',
      isRead: true,
      type: 'info',
    },
  ]);

  // Clean up siren if unmounted
  useEffect(() => {
    return () => {
      sirenSynth.stop();
    };
  }, []);

  // Save markers whenever updated
  const setMarkers = (action: React.SetStateAction<CampusMarker[]>) => {
    setMarkersState((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      try {
        localStorage.setItem('suraksha_custom_markers', JSON.stringify(next));
      } catch {
        // quota
      }
      return next;
    });
  };

  // Real-time live drill ticker
  useEffect(() => {
    if (!isLiveDrillActive) return;

    const timer = window.setInterval(() => {
      setDrillElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isLiveDrillActive]);

  // Real-time drill simulated events (headcount updates periodically)
  useEffect(() => {
    if (!isLiveDrillActive || drillElapsedSeconds === 0) return;

    // Every 7 seconds during drill, transition a student or update headcount
    if (drillElapsedSeconds % 7 === 0) {
      setStudents((prev) => {
        const inTransit = prev.find(
          (s) => s.evacuationStatus === 'Moving to Assembly Point' || s.evacuationStatus === 'Moving to Exit'
        );
        if (inTransit) {
          const nextStatus =
            inTransit.evacuationStatus === 'Moving to Exit'
              ? 'Reached Exit'
              : 'Reached Assembly Point';
          return prev.map((s) =>
            s.id === inTransit.id ? { ...s, evacuationStatus: nextStatus, lastUpdated: 'Just now' } : s
          );
        }
        return prev;
      });

      // Inject simulated real-time alert toast
      const msgs = [
        'Floor Marshal Nair verified Block A corridor clear.',
        'Junior Wing Sections 9A and 9B checked in at Assembly Ground Alpha.',
        'Gate 1 pedestrian corridor clear for emergency vehicle egress.',
        'Science Laboratory gas shutoff valves verified isolated.',
      ];
      const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
      setNotifications((prev) => [
        {
          id: `drill-feed-${Date.now()}`,
          title: `LIVE DRILL TICKER (${Math.floor(drillElapsedSeconds / 60)}m ${drillElapsedSeconds % 60}s)`,
          message: randomMsg,
          timestamp: 'Just now',
          isRead: false,
          type: 'info',
        },
        ...prev.slice(0, 15),
      ]);
    }
  }, [isLiveDrillActive, drillElapsedSeconds]);

  const toggleLiveDrill = () => {
    if (isLiveDrillActive) {
      setIsLiveDrillActive(false);
      sirenSynth.stop();
      setIsSirenPlaying(false);
    } else {
      setIsLiveDrillActive(true);
      setEmergencyStatus('Evacuation Active');
      // speak voice prompt
      speakInstruction('Evacuation drill activated. Follow designated exit or assembly routes calmly.');
    }
  };

  const resetLiveDrill = () => {
    setIsLiveDrillActive(false);
    setDrillElapsedSeconds(0);
    sirenSynth.stop();
    setIsSirenPlaying(false);
  };

  // Text to speech real-time voice instruction
  const speakInstruction = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch {
        // speech synthesis blocked
      }
    }
  };

  const toggleSiren = () => {
    if (isSirenPlaying) {
      sirenSynth.stop();
      setIsSirenPlaying(false);
    } else {
      sirenSynth.start();
      setIsSirenPlaying(true);
    }
  };

  const resetSatelliteMapToDefault = () => {
    setSatelliteMapImageState(DEFAULT_CAMPUS_IMAGE);
    setMarkersState(INITIAL_MARKERS);
    setCustomOriginState({ x: 48, y: 28, name: 'Main Academic Block (Room 102)' });
    try {
      localStorage.removeItem('suraksha_custom_satellite_map');
      localStorage.removeItem('suraksha_custom_markers');
      localStorage.removeItem('suraksha_custom_origin');
    } catch {
      // ignore
    }
  };

  const addMarker = (marker: Omit<CampusMarker, 'id'>): CampusMarker => {
    const id = `marker-${Date.now()}`;
    const newMarker: CampusMarker = { ...marker, id };
    setMarkers((prev) => [...prev, newMarker]);
    return newMarker;
  };

  const updateMarker = (id: string, updates: Partial<CampusMarker>) => {
    setMarkers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deleteMarker = (id: string) => {
    setMarkers((prev) => prev.filter((m) => m.id !== id));
    if (selectedMarkerId === id) {
      setSelectedMarkerId(null);
    }
  };

  const addBlockedZone = (zone: Omit<BlockedZone, 'id'>) => {
    const id = `bz-${Date.now()}`;
    setBlockedZones((prev) => [...prev, { ...zone, id }]);
  };

  const removeBlockedZone = (id: string) => {
    setBlockedZones((prev) => prev.filter((z) => z.id !== id));
  };

  const submitSOSRequest = (req: Omit<SOSRequest, 'id' | 'timestamp' | 'status'>): string => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const id = `SOS-2026-${randomSuffix}`;
    const newSOS: SOSRequest = {
      ...req,
      id,
      timestamp: 'Just now',
      status: 'Received',
    };
    setSosRequests((prev) => [newSOS, ...prev]);

    const newNotif = {
      id: `notif-${Date.now()}`,
      title: `EMERGENCY SOS: ${req.service.toUpperCase()}`,
      message: `${req.userName} requested ${req.service} at ${req.location}.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'sos',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    speakInstruction(`SOS emergency alert logged for ${req.service} at ${req.location}.`);

    return id;
  };

  const updateSOSStatus = (id: string, status: SOSRequest['status']) => {
    setSosRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const sendEmergencyAlert = (
    newAlert: Omit<EmergencyAlert, 'id' | 'timestamp' | 'status' | 'acknowledgedCount'>
  ) => {
    const id = `ALT-2026-0${alerts.length + 1}`;
    const created: EmergencyAlert = {
      ...newAlert,
      id,
      timestamp: 'Just now',
      status: 'Delivered (demo)',
      acknowledgedCount: 1,
    };
    setAlerts((prev) => [created, ...prev]);
    setEmergencyStatus('Evacuation Active');
    setActiveDisasterType(newAlert.disasterType);

    const newNotif = {
      id: `notif-alert-${Date.now()}`,
      title: `${newAlert.severity.toUpperCase()} ALERT: ${newAlert.title}`,
      message: newAlert.message,
      timestamp: 'Just now',
      isRead: false,
      type: 'alert',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    speakInstruction(`Attention all personnel. ${newAlert.title}. ${newAlert.message}`);
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: 'Acknowledged',
              acknowledgedCount: Math.min(a.acknowledgedCount + 1, a.totalRecipients),
            }
          : a
      )
    );
  };

  const updateStudentStatus = (studentId: string, status: StudentRecord['evacuationStatus']) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, evacuationStatus: status, lastUpdated: 'Just now' } : s))
    );
  };

  const updateTeacherStatus = (teacherId: string, status: TeacherRecord['evacuationStatus']) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === teacherId ? { ...t, evacuationStatus: status, lastReport: 'Just now' } : t))
    );
  };

  const sendChatMessage = (text: string, isAlert = false, attachmentName?: string) => {
    if (!text.trim()) return;

    let senderName = 'Dr. Ramesh Sharma (Chairman)';
    let senderId = 'usr-chairman';
    if (userRole === 'TEACHER') {
      senderName = 'Mrs. Priya Nair (Teacher)';
      senderId = 'usr-teacher-priya';
    } else if (userRole === 'STUDENT') {
      senderName = 'Aryan Patel (Student Class 11)';
      senderId = 'usr-student-aryan';
    }

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      groupId: selectedGroupId,
      senderId,
      senderName,
      senderRole: userRole,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isEmergencyAlert: isAlert,
      attachmentName,
    };

    setChatMessages((prev) => [...prev, newMsg]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const triggerEvacuationQuickAction = (target: 'EXIT' | 'ASSEMBLY') => {
    setEvacuationTargetType(target);
    const matched = markers.find((m) => m.type === (target === 'EXIT' ? 'EXIT_GATE' : 'ASSEMBLY_POINT'));
    if (matched) {
      setSelectedMarkerId(matched.id);
    }
    setActivePage('evacuation');
  };

  const confirmStudentSafetyQuickAction = (studentName = 'Aryan Patel') => {
    const student = students.find((s) => s.name.includes(studentName));
    if (student) {
      updateStudentStatus(student.id, 'Reached Assembly Point');
    }
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: 'Safety Check-In Confirmed',
      message: `${studentName} has checked in as Safe at Assembly Ground Alpha.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'safe',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        activePage,
        setActivePage,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        emergencyStatus,
        setEmergencyStatus,
        activeDisasterType,
        setActiveDisasterType,
        isSirenPlaying,
        toggleSiren,
        isLiveDrillActive,
        drillElapsedSeconds,
        toggleLiveDrill,
        resetLiveDrill,
        speakInstruction,
        satelliteMapImage,
        setSatelliteMapImage,
        resetSatelliteMapToDefault,
        markers,
        addMarker,
        updateMarker,
        deleteMarker,
        customOrigin,
        setCustomOrigin,
        blockedZones,
        addBlockedZone,
        removeBlockedZone,
        evacuationTargetType,
        setEvacuationTargetType,
        selectedMarkerId,
        setSelectedMarkerId,
        sosRequests,
        submitSOSRequest,
        updateSOSStatus,
        alerts,
        sendEmergencyAlert,
        acknowledgeAlert,
        students,
        updateStudentStatus,
        teachers,
        updateTeacherStatus,
        chatGroups,
        chatMessages,
        selectedGroupId,
        setSelectedGroupId,
        sendChatMessage,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        triggerEvacuationQuickAction,
        confirmStudentSafetyQuickAction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
