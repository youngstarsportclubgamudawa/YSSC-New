import React from 'react';
import { useApp } from '../AppContext';
import { ClubLogo } from '../ClubLogo';
import { Award, MapPin, Phone, Mail, CheckCircle2, Shield, Calendar, Users } from 'lucide-react';

export const ClubView: React.FC = () => {
  const { language, t, clubProfile } = useApp();

  const achievements = [
    {
      title: 'Gamudawa Premier T20 Champions 2024',
      titleSinhala: 'ගම්උදාව ප්‍රිමියර් T20 ශූරතාව 2024',
      year: '2024',
      badge: 'Cricket Championship'
    },
    {
      title: 'District Volleyball Gold Trophy 2023',
      titleSinhala: 'දිස්ත්‍රික් වොලිබෝල් රන් කුසලානය 2023',
      year: '2023',
      badge: 'Volleyball Gold'
    },
    {
      title: 'Youth Sports Excellence Award 2022',
      titleSinhala: 'තරුණ ක්‍රීඩා විශිෂ්ටතා සම්මානය 2022',
      year: '2022',
      badge: 'Community Award'
    },
    {
      title: 'Affiliated Division I Club Accreditation',
      titleSinhala: 'පළමු පෙළ ක්‍රීඩා සමාජ අනුබද්ධතාවය',
      year: '2019',
      badge: 'Official Recognition'
    }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Club Identity Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-10 flex flex-col md:flex-row items-center gap-8">
        <ClubLogo size={120} />
        <div className="space-y-2 text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
            <Shield className="w-3.5 h-3.5 text-amber-700" />
            <span>ESTD. {clubProfile.establishedYear} · {clubProfile.village.toUpperCase()}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {language === 'si' ? clubProfile.nameSinhala : clubProfile.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
            {language === 'si' ? clubProfile.mottoSinhala : clubProfile.motto}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 justify-center md:justify-start">
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-600" /> {language === 'si' ? clubProfile.groundAddressSinhala : clubProfile.groundAddress}</span>
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-600" /> {clubProfile.phone}</span>
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-blue-600" /> {clubProfile.email}</span>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
            <span>🎯</span>
            <span>{language === 'si' ? 'අපගේ දැක්ම (Our Vision)' : 'Our Vision (අපගේ දැක්ම)'}</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {language === 'si' ? clubProfile.visionSinhala : clubProfile.vision}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal italic">
            {language === 'si' ? `"${clubProfile.vision}"` : `"${clubProfile.visionSinhala}"`}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <span>🚀</span>
            <span>{language === 'si' ? 'අපගේ මෙහෙවර (Our Mission)' : 'Our Mission (අපගේ මෙහෙවර)'}</span>
          </div>
          <div className="space-y-2 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
            {(language === 'si' ? clubProfile.missionListSinhala : clubProfile.missionList).map((missionItem, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-base">💪</span>
                <span>{missionItem}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Facilities */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            {language === 'si' ? 'ක්‍රීඩාංගණ පහසුකම්' : 'Ground Infrastructure'}
          </span>
          <h2 className="text-lg font-bold text-slate-900 leading-tight">
            {language === 'si' ? 'ගම්උදාව ක්‍රීඩා සංකීර්ණය' : 'Gamudawa Sports Complex Amenities'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-slate-700">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{language === 'si' ? 'තණතිලි තණතීරුව' : 'Turf Cricket Pitch'}</span>
            </div>
            <p className="text-slate-500">
              {language === 'si'
                ? 'පළමු පෙළ තරඟ සඳහා සුදුසු නියාමන මට්ටමේ ස්වාභාවික තණතීරුව.'
                : 'Full-size regulation turf cricket match pitch and boundary outfield.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{language === 'si' ? 'පුහුණු දැල් ආවරණ' : '4-Lane Practice Nets'}</span>
            </div>
            <p className="text-slate-500">
              {language === 'si'
                ? 'පන්දු යැවීමේ යන්ත්‍ර සහිත එළිමහන් සහ ආවරණය කළ දැල් 4ක්.'
                : '4-lane turf net practice enclosures equipped with bowling machines.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{language === 'si' ? 'විදුලි ආලෝක ධාරා' : 'Stadium Floodlights'}</span>
            </div>
            <p className="text-slate-500">
              {language === 'si'
                ? 'රාත්‍රී පාපන්දු සහ T20 ක්‍රිකට් තරඟ සඳහා ආලෝක පහසුකම්.'
                : 'High-power LED floodlights facilitating night football & T20 matches.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{language === 'si' ? 'සමාජ ශාලා ශ්‍රවණාගාරය' : 'Clubhouse Auditorium'}</span>
            </div>
            <p className="text-slate-500">
              {language === 'si'
                ? 'රැස්වීම් ශාලාව, ක්‍රීඩක ඇඳුම් මාරුකරන කාමර සහ ප්‍රථමාධාර ඒකකය.'
                : 'Player dressing rooms, executive conference hall, gym, and medical station.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{language === 'si' ? 'වොලිබෝල් අංගනය' : 'Outdoor Volleyball Court'}</span>
            </div>
            <p className="text-slate-500">
              {language === 'si'
                ? 'නියාමන ප්‍රමාණයේ විශේෂ වැලි සහ තද පොළොව සහිත පිටිය.'
                : 'Competition-grade outdoor court with spectator seating.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{language === 'si' ? 'ජල හා විවේකාගාර' : 'Player Pavilion & Refreshment'}</span>
            </div>
            <p className="text-slate-500">
              {language === 'si'
                ? 'ක්‍රීඩකයින්ට පානීය ජලය සහ විවේකී කුටිය.'
                : 'Shaded spectator pavilion with fresh drinking water.'}
            </p>
          </div>
        </div>
      </div>

      {/* Honours & Awards */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
            {language === 'si' ? 'ජයග්‍රහණ & ශූරතා' : 'Championship Honours'}
          </span>
          <h2 className="text-lg font-bold text-slate-900 leading-tight">
            {language === 'si' ? 'සමාජයේ කීර්තිමත් කුසලාන' : 'Club Trophies & Milestones'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-gradient-to-b from-amber-50/60 to-white border border-amber-200/80 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-lg bg-amber-100 text-amber-800">
                  <Award className="w-4 h-4" />
                </span>
                <span className="font-mono font-bold text-amber-800">{item.year}</span>
              </div>
              <p className="font-bold text-slate-900 text-sm">
                {language === 'si' ? item.titleSinhala : item.title}
              </p>
              <span className="inline-block text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                {item.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
