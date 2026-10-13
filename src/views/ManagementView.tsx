import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Users, Phone, ExternalLink, Award, FileSpreadsheet } from 'lucide-react';
import { LEADERSHIP_SHEET_URL } from '../initialData';

export const ManagementView: React.FC = () => {
  const { language, t, managementLeaders } = useApp();
  const [filterCategory, setFilterCategory] = useState<'all' | 'executive' | 'coaching' | 'captains'>('all');

  const filteredLeaders = managementLeaders.filter((leader) => {
    if (filterCategory === 'all') return true;
    return leader.category === filterCategory;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'si' ? 'විධායක කමිටුව & පුහුණුකරුවන්' : 'Executive Board & Team Leaders'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {t.navManagement}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {language === 'si'
                ? 'තරුණ තරු ක්‍රීඩා සමාජයේ පරිපාලනය, සංවිධානය සහ ක්‍රීඩා පුහුණු කිරීම් මෙහෙයවන ගෞරවනීය නිලධාරීන්.'
                : 'Dedicated community leaders, coaches, and captains driving sporting excellence in Gamudawa.'}
            </p>
          </div>

          <a
            href={LEADERSHIP_SHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{language === 'si' ? 'කමිටු ලේඛනය (Sheet)' : 'Leadership Sheet'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all' as const, labelEn: 'All Leaders', labelSi: 'සියලුම නායකයින්' },
          { id: 'executive' as const, labelEn: 'Executive Board', labelSi: 'විධායක මණ්ඩලය' },
          { id: 'coaching' as const, labelEn: 'Head Coaches', labelSi: 'පුහුණුකරුවන්' },
          { id: 'captains' as const, labelEn: 'Team Captains', labelSi: 'නායකයින්' }
        ].map((item) => {
          const isActive = filterCategory === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setFilterCategory(item.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {language === 'si' ? item.labelSi : item.labelEn}
            </button>
          );
        })}
      </div>

      {/* Leaders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeaders.map((leader) => (
          <div
            key={leader.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between hover:border-amber-300 hover:shadow-md transition-all space-y-4"
          >
            <div className="flex items-start gap-4">
              <img
                src={leader.photoUrl || '/yssc-logo.png'}
                alt={leader.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shrink-0 shadow-xs"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/yssc-logo.png';
                }}
              />
              <div className="space-y-1">
                {leader.badge && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    <Award className="w-3 h-3 text-amber-700" />
                    <span>{language === 'si' ? leader.badgeSinhala || leader.badge : leader.badge}</span>
                  </span>
                )}
                <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                  {language === 'si' ? leader.nameSinhala : leader.name}
                </h3>
                <p className="text-xs font-semibold text-amber-800">
                  {language === 'si' ? leader.designationSinhala || leader.designation : leader.designation}
                </p>
                {leader.term && (
                  <p className="text-[10px] font-mono text-slate-400">Term: {leader.term}</p>
                )}
              </div>
            </div>

            {leader.bio && (
              <p className="text-xs text-slate-600 leading-relaxed font-normal bg-slate-50 p-3 rounded-xl border border-slate-150">
                {language === 'si' ? leader.bioSinhala || leader.bio : leader.bio}
              </p>
            )}

            {leader.phone && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <a
                  href={`tel:${leader.phone}`}
                  className="inline-flex items-center gap-1.5 text-slate-600 hover:text-amber-800 font-medium transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{leader.phone}</span>
                </a>
                <span className="text-[10px] text-slate-400 font-mono">Verified Officer</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
