import React, { useState } from 'react';
import { AppProvider, useApp } from './AppContext';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';
import { HomeView } from './views/HomeView';
import { FinancesView } from './views/FinancesView';
import { CricketView } from './views/CricketView';
import { CricketStatsView } from './views/CricketStatsView';
import { EventsView } from './views/EventsView';
import { ManagementView } from './views/ManagementView';
import { DocumentsView } from './views/DocumentsView';
import { ClubView } from './views/ClubView';
import { MyClubView } from './views/MyClubView';
import { AdminView } from './views/AdminView';
import { MasterDocumentView } from './views/MasterDocumentView';
import { GoogleSheetModal } from './GoogleSheetModal';
import { GoogleDriveHostingModal } from './GoogleDriveHostingModal';
import { EventDetailsModal } from './components/EventDetailsModal';
import { UploadDocModal } from './components/UploadDocModal';
import { CreateEventModal } from './components/CreateEventModal';
import { ClubEvent } from './types';
import { CheckCircle2 } from 'lucide-react';

const PortalShell: React.FC = () => {
  const { activeTab, toastMessage } = useApp();

  const [sheetModalOpen, setSheetModalOpen] = useState(false);
  const [driveModalOpen, setDriveModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null);
  const [uploadDocModalOpen, setUploadDocModalOpen] = useState(false);
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);

  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeView
            onOpenSheetModal={() => setSheetModalOpen(true)}
            onOpenDriveModal={() => setDriveModalOpen(true)}
          />
        );
      case 'finances':
        return (
          <FinancesView
            onOpenSheetModal={() => setSheetModalOpen(true)}
            onOpenDriveModal={() => setDriveModalOpen(true)}
          />
        );
      case 'cricket':
        return <CricketView />;
      case 'cricket-stats':
        return <CricketStatsView />;
      case 'events':
        return <EventsView />;
      case 'management':
        return <ManagementView />;
      case 'documents':
        return <DocumentsView onOpenUploadModal={() => setUploadDocModalOpen(true)} />;
      case 'club':
        return <ClubView />;
      case 'myclub':
        return <MyClubView />;
      case 'admin':
        return (
          <AdminView
            onOpenSheetModal={() => setSheetModalOpen(true)}
            onOpenUploadDocModal={() => setUploadDocModalOpen(true)}
            onOpenCreateEventModal={() => setCreateEventModalOpen(true)}
            onOpenDriveModal={() => setDriveModalOpen(true)}
          />
        );
      case 'master-doc':
        return <MasterDocumentView />;
      default:
        return (
          <HomeView
            onOpenSheetModal={() => setSheetModalOpen(true)}
            onOpenDriveModal={() => setDriveModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="club-app min-h-[100dvh] bg-[#f4f0e7] text-slate-800 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2.5 max-w-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="leading-snug">{toastMessage}</span>
          </div>
        </div>
      )}

      <Header
        onOpenSheetModal={() => setSheetModalOpen(true)}
        onOpenDriveModal={() => setDriveModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {renderView()}
      </main>

      <Footer />
      <BottomNav />

      {/* Global Modals */}
      <GoogleSheetModal
        isOpen={sheetModalOpen}
        onClose={() => setSheetModalOpen(false)}
        onOpenDriveModal={() => setDriveModalOpen(true)}
      />

      <GoogleDriveHostingModal
        isOpen={driveModalOpen}
        onClose={() => setDriveModalOpen(false)}
      />

      <EventDetailsModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      <UploadDocModal
        isOpen={uploadDocModalOpen}
        onClose={() => setUploadDocModalOpen(false)}
      />

      <CreateEventModal
        isOpen={createEventModalOpen}
        onClose={() => setCreateEventModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <PortalShell />
    </AppProvider>
  );
}

export default App;
