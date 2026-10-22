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

interface ErrorBoundaryProps {
  children: React.ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Portal ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('youngstar_member_records');
      localStorage.removeItem('youngstar_cricket_entries');
      localStorage.removeItem('youngstar_match_organizing');
      localStorage.removeItem('youngstar_finance_summary');
      localStorage.removeItem('youngstar_club_profile');
      localStorage.removeItem('youngstar_leaders');
      localStorage.removeItem('youngstar_expenses');
      localStorage.removeItem('youngstar_documents');
      localStorage.removeItem('youngstar_announcements');
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f4f0e7] flex items-center justify-center p-4 font-sans text-slate-800">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-xl border border-slate-200 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-800 text-2xl font-bold">
              🏏
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Young Star Sports Club Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              The application encountered a display glitch. You can reload the portal or reset the cached state to continue.
            </p>
            {this.state.error && (
              <pre className="text-[11px] bg-slate-100 p-3 rounded-xl text-slate-600 overflow-x-auto text-left font-mono">
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-md cursor-pointer transition-colors"
              >
                Reload Portal
              </button>
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
              >
                Reset Stored Data & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <PortalShell />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
