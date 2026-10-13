import React from 'react';
import { useApp } from './AppContext';
import { Home, DollarSign, Trophy, Calendar, Users, ShieldAlert, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, role, language } = useApp();

  const items = [
    { id: 'home' as const, labelEn: 'Home', labelSi: 'මුල් පිටුව', icon: Home },
    { id: 'cricket' as const, labelEn: 'Cricket', labelSi: 'ක්‍රිකට්', icon: Trophy },
    { id: 'finances' as const, labelEn: 'Finances', labelSi: 'මූල්‍ය', icon: DollarSign },
    { id: 'events' as const, labelEn: 'Events', labelSi: 'තරඟ', icon: Calendar },
    {
      id: (role === 'organiser' ? 'admin' : 'myclub') as any,
      labelEn: role === 'organiser' ? 'Admin' : 'My Club',
      labelSi: role === 'organiser' ? 'පරිපාලක' : 'මගේ ගිණුම',
      icon: role === 'organiser' ? ShieldAlert : User
    }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg pb-safe">
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto items-center px-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const label = language === 'si' ? item.labelSi : item.labelEn;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center h-full w-full py-1 px-0.5 rounded-lg transition-all cursor-pointer ${
                isActive ? 'text-amber-800 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1 rounded-full transition-transform ${
                  isActive ? 'bg-amber-100 scale-105' : ''
                }`}
              >
                <Icon
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    isActive ? 'text-amber-700 stroke-[2.5]' : 'stroke-2'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] sm:text-[11px] leading-normal tracking-normal truncate max-w-full text-center mt-0.5 ${
                  language === 'si' ? 'font-sinhala' : ''
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
