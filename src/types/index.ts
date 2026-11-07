export type UserRole = 'CHAIRMAN' | 'TEACHER' | 'STUDENT';

export type PageId =
  | 'dashboard'
  | 'map-management'
  | 'evacuation'
  | 'sos'
  | 'alerts'
  | 'student-tracking'
  | 'teacher-tracking'
  | 'disaster-monitoring'
  | 'india-disasters'
  | 'disaster-news'
  | 'messaging'
  | 'safety-guides'
  | 'settings'
  | 'profile';

export type MarkerType = 'EXIT_GATE' | 'ASSEMBLY_POINT';

export interface CampusMarker {
  id: string;
  type: MarkerType;
  name: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  details?: string;
  capacity?: number;
  status: 'OPEN' | 'CONGESTED' | 'BLOCKED';
  gateCode?: string;
}

export interface BlockedZone {
  id: string;
  name: string;
  reason: string;
  disasterType: DisasterCategory | 'Structural Risk';
  x: number;
  y: number;
  radius: number; // percentage of map
}

export type EmergencyServiceType =
  | 'Ambulance'
  | 'Fire and Rescue'
  | 'Police'
  | 'Disaster Rescue Team';

export interface SOSRequest {
  id: string;
  userName: string;
  userRole: UserRole;
  service: EmergencyServiceType;
  emergencyType: string;
  location: string;
  latitude?: number;
  longitude?: number;
  message: string;
  additionalInfo?: string;
  timestamp: string;
  status: 'Received' | 'Verifying' | 'Escalated to Control Room (Demo)' | 'Resolved';
  assignedUnit?: string;
}

export type DisasterCategory = 'Flood' | 'Earthquake' | 'Cyclone' | 'Fire' | 'General';
export type AlertSeverity = 'Critical' | 'High' | 'Moderate' | 'Advisory';
export type RecipientGroup =
  | 'All teachers'
  | 'All students'
  | 'Teachers and students'
  | 'Selected groups';
export type AlertStatus = 'Sent' | 'Delivered (demo)' | 'Acknowledged' | 'Not acknowledged';

export interface EmergencyAlert {
  id: string;
  disasterType: DisasterCategory;
  severity: AlertSeverity;
  title: string;
  message: string;
  location: string;
  recipients: RecipientGroup;
  timestamp: string;
  status: AlertStatus;
  acknowledgedCount: number;
  totalRecipients: number;
  senderName: string;
}

export type StudentEvacuationStatus =
  | 'Moving to Exit'
  | 'Reached Exit'
  | 'Moving to Assembly Point'
  | 'Reached Assembly Point'
  | 'Needs Assistance'
  | 'Not Confirmed';

export interface StudentRecord {
  id: string;
  name: string;
  studentId: string;
  grade: string;
  section: string;
  assignedTeacher: string;
  teacherId: string;
  currentLocation: string;
  x: number; // map coordinates %
  y: number;
  evacuationStatus: StudentEvacuationStatus;
  phone: string;
  parentPhone: string;
  bloodGroup: string;
  medicalNotes?: string;
  lastUpdated: string;
}

export type TeacherEvacuationStatus =
  | 'Leading Students'
  | 'Moving to Exit'
  | 'Moving to Assembly Point'
  | 'Reached Assembly Point'
  | 'Needs Assistance';

export interface TeacherRecord {
  id: string;
  name: string;
  employeeId: string;
  subject: string;
  assignedGroup: string;
  studentCount: number;
  currentLocation: string;
  x: number;
  y: number;
  evacuationStatus: TeacherEvacuationStatus;
  assemblyPointStatus: string;
  phone: string;
  emergencyRole: string;
  lastReport: string;
}

export interface ChatMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  isEmergencyAlert?: boolean;
  attachmentName?: string;
}

export interface ChatGroup {
  id: string;
  name: string;
  type: 'group' | 'direct';
  description: string;
  participants: string[];
  unreadCount: number;
  lastMessage?: string;
  lastTimestamp?: string;
}

export interface DisasterNewsItem {
  id: string;
  title: string;
  category: 'Flood' | 'Cyclone' | 'Earthquake' | 'Fire' | 'Government Notice' | 'Safety Update';
  description: string;
  content: string;
  location: string;
  publishedDate: string;
  source: string;
  imageUrl: string;
  verifiedOfficial: boolean;
  readTime: string;
}

export interface IndiaDisasterEvent {
  id: string;
  state: string;
  eventLocation: string;
  disasterType: 'Earthquake' | 'Flood' | 'Cyclone';
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  latestReading: string;
  updatedAt: string;
  source: string;
  summary: string;
  actionsAdvised: string;
  coordinates: [number, number]; // [lat, lng]
}
