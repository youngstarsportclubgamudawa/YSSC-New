import React, { useState } from 'react';
import { useApp } from './AppContext';
import { ClubLogo } from './ClubLogo';
import {
  Home,
  Wallet,
  Calendar,
  Users,
  FileText,
  Info,
  User,
  Shield,
  Trophy,
  TrendingUp,
  FileSpreadsheet,
  ExternalLink,
  Globe,
  Menu,
  X,
  LogIn,
  LogOut,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

interface HeaderProps {
  onOpenSheetModal: () => void;
  onOpenDriveModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSheetModal, onOpenDriveModal }) => {
  const {
    language,
    setLanguage,
    t,
    role,
    toggleRole,
    activeTab,
    setActiveTab,
    openGoogleSheetDirectly,
    googleUser,
    isGoogleLoggingIn,
    signInWithGoogle,
    signOutFromGoogle,
    memberRecords
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as const, label: t.navHome, icon: Home },
    { id: 'finances' as const, label: t.navFinances, icon: Wallet },
    { id: 'cricket' as const, label: t.navCricket, icon: Trophy },
    { id: 'cricket-stats' as const, label: t.navCricketStats, icon: TrendingUp },
    { id: 'master-doc' as const, label: t.navMasterDoc, icon: FileText },
    { id: 'events' as const, label: t.navEvents, icon: Calendar },
    { id: 'management' as const, label: t.navManagement, icon: Users },
    { id: 'documents' as const, label: t.navDocuments, icon: FolderOpen },
    { id: 'club' as const, label: t.navClub, icon: Info },
    { id: 'myclub' as const, label: t.navMyClub, icon: User },
    ...(role === 'organiser' ? [{ id: 'admin' as const, label: t.navAdmin, icon: Shield }] : [])
  ];

  const handleNavClick = (tab: any) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      {/* Top Banner Ribbon */}
      <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
              Google Sheet
            </span>
            <span className="hidden sm:inline text-slate-300 truncate">
              {language === 'si'
                ? `සතිපතා සාමාජික ගාස්තු: සතියකට රු. 100 කි (සාමාජිකයින් ${memberRecords.length})`
                : `Weekly Dues: Rs 100/week (${memberRecords.length} Members)`}
            </span>
            <button
              onClick={openGoogleSheetDirectly}
              className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-medium underline underline-offset-2 ml-1 cursor-pointer transition-colors"
              title="Open exact Google Sheet in new tab"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{t.openGoogleSheet}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
            <button
              onClick={onOpenDriveModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-400/40 text-[11px] font-mono font-bold ml-1 cursor-pointer transition-colors"
              title="Google Drive & Web Hosting Hub"
            >
              <FolderOpen className="w-3 h-3 text-blue-400" />
              <span>Google Drive</span>
            </button>
            <button
              onClick={() => setActiveTab('master-doc')}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-[11px] font-bold ml-1 cursor-pointer transition-colors"
              title="Open Live Master Document Webpage"
            >
              <FileText className="w-3 h-3 text-amber-400" />
              <span>{language === 'si' ? 'ප්‍රධාන ලේඛනය' : 'Master Document'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Language Selector */}
            <div className="flex items-center bg-slate-800 rounded-md p-0.5 border border-slate-700">
              <Globe className="w-3 h-3 text-slate-400 ml-1.5 mr-1" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  language === 'en'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('si')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  language === 'si'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                සිංහල
              </button>
            </div>

            {/* Google Sign-in status */}
            {googleUser ? (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-emerald-300 font-medium hidden md:inline truncate max-w-[130px]">
                  {googleUser.displayName || googleUser.email}
                </span>
                <button
                  onClick={signOutFromGoogle}
                  className="px-2 py-0.5 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 transition-colors"
                  title="Sign out of Google"
                >
                  <LogOut className="w-3 h-3" />
                  <span className="hidden sm:inline">{t.signOut}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                disabled={isGoogleLoggingIn}
                className="px-2 py-0.5 rounded text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1 transition-colors disabled:opacity-50"
                title="Connect with Google Workspace for live Drive & Sheets integration"
              >
                {isGoogleLoggingIn ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <LogIn className="w-3 h-3" />
                )}
                <span>Sign in with Google</span>
              </button>
            )}

            {/* Switch Role Button */}
            <button
              onClick={toggleRole}
              className="text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-0.5 rounded-md border border-slate-700 transition-colors"
            >
              {t.switchRole}:{' '}
              <span className="text-amber-400 font-bold">
                {role === 'organiser' ? t.roleAdmin : t.roleMember}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-4">
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <ClubLogo size={52} />
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 tracking-tight leading-none text-xl sm:text-2xl group-hover:text-amber-700 transition-colors">
                YOUNG STAR SC
              </span>
              <span className="text-xs font-semibold text-amber-800 tracking-wider uppercase mt-1">
                GAMUDAWA · ESTD 1998
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-700 hover:bg-amber-50/70 hover:text-amber-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Header Actions */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={onOpenSheetModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-semibold transition-colors cursor-pointer"
              title="Configure Google Sheet Integration"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.syncSheet}</span>
            </button>

            <button
              onClick={onOpenDriveModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-semibold transition-colors cursor-pointer"
              title="Google Drive & Web Hosting Hub"
            >
              <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Drive Hub</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => {
                onOpenSheetModal();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 px-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Google Sheet</span>
            </button>
            <button
              onClick={() => {
                onOpenDriveModal();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 px-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <FolderOpen className="w-4 h-4 text-blue-600" />
              <span>Google Drive</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
