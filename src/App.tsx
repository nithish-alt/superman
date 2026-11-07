import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopNavigation } from './components/layout/TopNavigation';
import { Sidebar } from './components/layout/Sidebar';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { SchoolMapPage } from './pages/SchoolMapPage';
import { EvacuationPage } from './pages/EvacuationPage';
import { SosPage } from './pages/SosPage';
import { AlertManagementPage } from './pages/AlertManagementPage';
import { StudentTrackingPage } from './pages/StudentTrackingPage';
import { TeacherTrackingPage } from './pages/TeacherTrackingPage';
import { DisasterMonitoringPage } from './pages/DisasterMonitoringPage';
import { IndiaDisasterInfoPage } from './pages/IndiaDisasterInfoPage';
import { DisasterNewsPage } from './pages/DisasterNewsPage';
import { MessagingPage } from './pages/MessagingPage';
import { DisasterSafetyGuidesPage } from './pages/DisasterSafetyGuidesPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';

const AppContent: React.FC = () => {
  const { activePage } = useApp();

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'map-management':
        return <SchoolMapPage />;
      case 'evacuation':
        return <EvacuationPage />;
      case 'sos':
        return <SosPage />;
      case 'alerts':
        return <AlertManagementPage />;
      case 'student-tracking':
        return <StudentTrackingPage />;
      case 'teacher-tracking':
        return <TeacherTrackingPage />;
      case 'disaster-monitoring':
        return <DisasterMonitoringPage />;
      case 'india-disasters':
        return <IndiaDisasterInfoPage />;
      case 'disaster-news':
        return <DisasterNewsPage />;
      case 'messaging':
        return <MessagingPage />;
      case 'safety-guides':
        return <DisasterSafetyGuidesPage />;
      case 'settings':
        return <SettingsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <TopNavigation />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
