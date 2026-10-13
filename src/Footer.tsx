import React from 'react';
import { useApp } from './AppContext';
import { ClubLogo } from './ClubLogo';
import { Mail, Phone, MapPin, ExternalLink, Heart } from 'lucide-react';
import { DEFAULT_SHEET_URL, GOOGLE_DRIVE_FOLDER_URL } from './initialData';

export const Footer: React.FC = () => {
  const { t, language, setActiveTab } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Club Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ClubLogo size={44} />
              <div>
                <span className="font-extrabold text-white tracking-tight leading-none text-lg block">
                  YOUNG STAR SC
                </span>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mt-0.5">
                  GAMUDAWA · ESTD 1998
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'si'
                ? 'ක්‍රීඩාවේ විශිෂ්ටත්වය සහ ප්‍රජාවේ සාමූහිකත්වය උදෙසා ගම්උදාව ප්‍රදේශයේ තරුණ පරපුර බලගන්වන නිල ක්‍රීඩා සංවිධානය.'
                : 'Dedicated to athletic excellence, community leadership, and youth sports development in Gamudawa, Sri Lanka.'}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {language === 'si' ? 'කෙටිමං' : 'Portal Navigation'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  className="hover:text-white transition-colors"
                >
                  {t.navHome}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('finances')}
                  className="hover:text-white transition-colors"
                >
                  {t.navFinances}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('events')}
                  className="hover:text-white transition-colors"
                >
                  {t.navEvents}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('management')}
                  className="hover:text-white transition-colors"
                >
                  {t.navManagement}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('documents')}
                  className="hover:text-white transition-colors"
                >
                  {t.navDocuments}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('club')}
                  className="hover:text-white transition-colors"
                >
                  {t.navClub}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Live Integrations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {language === 'si' ? 'ගූගල් සම්බන්ධතා' : 'Google Integrations'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a
                  href={DEFAULT_SHEET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <span>Google Sheet (26 Members)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href={GOOGLE_DRIVE_FOLDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <span>Google Drive Club Hub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <span className="text-slate-400">Weekly Dues: Rs 100/member</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Official Contacts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {language === 'si' ? 'සම්බන්ධීකරණය' : 'Club Contacts'}
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Gamudawa Grounds & Pavilion, Gamudawa, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">youngstarsportclubgamudawa@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+94 77 459 4659 / +94 77 393 1753</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Young Star Sports Club Gamudawa. All Rights Reserved.</p>
          <p className="flex items-center justify-center gap-1">
            <span>Official Community Portal</span>
            <span>·</span>
            <span>Live on Google Cloud</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
