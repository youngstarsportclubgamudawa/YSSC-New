import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { ClubEvent } from '../types';
import { Calendar, Clock, MapPin, Users, Plus, CheckCircle2 } from 'lucide-react';
import { EventDetailsModal } from '../components/EventDetailsModal';
import { CreateEventModal } from '../components/CreateEventModal';

interface EventsViewProps {
  onSelectEvent?: (ev: ClubEvent) => void;
  onOpenCreateEventModal?: () => void;
}

export const EventsView: React.FC<EventsViewProps> = () => {
  const { language, t, role, events, weeklyDrills, currentUser, toggleEventRegistration } = useApp();
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [activeModalEvent, setActiveModalEvent] = useState<ClubEvent | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const filteredEvents = events.filter((ev) => {
    if (selectedSport === 'all') return true;
    return ev.sportCategory.toLowerCase() === selectedSport.toLowerCase();
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 text-white border border-white/20 text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              <span>{language === 'si' ? 'ගම්උදාව ක්‍රීඩා කාලසටහන' : 'Gamudawa Fixtures & Drills'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {language === 'si' ? 'තරඟාවලි සහ පුහුණු සැසි' : 'Club Events & Training Drills'}
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 leading-relaxed max-w-xl">
              {language === 'si'
                ? 'ගම්උදාව ක්‍රීඩාංගණයේ පැවැත්වෙන නිල ක්‍රිකට්, පාපන්දු, වොලිබෝල් තරඟ සහ සතිපතා පුහුණු සැසි.'
                : 'Official matches, friendly fixtures, and structured training sessions at Gamudawa grounds.'}
            </p>
          </div>

          {role === 'organiser' && (
            <button
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-amber-600" />
              <span>{t.createEventBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'cricket', 'football', 'volleyball', 'fitness'].map((cat) => {
          const isActive = selectedSport === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedSport(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'all' ? (language === 'si' ? 'සියලුම' : 'All Events') : cat}
            </button>
          );
        })}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((ev) => {
          const isRegistered = ev.registeredMembers.includes(currentUser.id);
          const spotsLeft = ev.maxParticipants - ev.registeredMembers.length;

          return (
            <div
              key={ev.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col hover:border-amber-300 hover:shadow-md transition-all"
            >
              <div className="p-5 flex-1 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                    {language === 'si' ? ev.badgeSinhala : ev.badge}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 capitalize">
                    {ev.sportCategory}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                  {language === 'si' ? ev.titleSinhala : ev.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {language === 'si' ? ev.descriptionSinhala : ev.description}
                </p>

                <div className="space-y-1.5 pt-2 text-xs text-slate-600 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>{ev.date}</span>
                    <span className="text-slate-300">•</span>
                    <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>{ev.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span className="truncate">
                      {language === 'si' ? ev.locationSinhala : ev.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>
                      {t.eventCoach}: <strong>{ev.coach}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-150 flex items-center justify-between gap-2">
                <div className="text-[11px] text-slate-500">
                  <span className="font-bold text-slate-800">{ev.registeredMembers.length}</span> /{' '}
                  {ev.maxParticipants} spots ({spotsLeft > 0 ? `${spotsLeft} left` : 'Full'})
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveModalEvent(ev)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => toggleEventRegistration(ev.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1 ${
                      isRegistered
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-rose-100 hover:text-rose-800'
                        : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                    }`}
                  >
                    {isRegistered && <CheckCircle2 className="w-3 h-3" />}
                    <span>{isRegistered ? 'Registered' : 'Book'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Drills Timetable */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
            {language === 'si' ? 'සතිපතා පුහුණු සැසි' : 'Weekly Drills & Coaching'}
          </span>
          <h2 className="text-lg font-bold text-slate-900 leading-tight">
            {language === 'si' ? 'ස්ථීර කාලසටහන' : 'Fixed Training Schedule'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weeklyDrills.map((drill) => (
            <div
              key={drill.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-amber-800">
                  {language === 'si' ? drill.daySinhala : drill.day}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-slate-200 text-slate-700">
                  {language === 'si' ? drill.targetGroupSinhala : drill.targetGroup}
                </span>
              </div>
              <p className="font-bold text-slate-900 text-sm">
                {language === 'si' ? drill.sessionSinhala : drill.session}
              </p>
              <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-200/60 font-mono">
                <span>{drill.time}</span>
                <span>{drill.coach}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <EventDetailsModal
        event={activeModalEvent}
        onClose={() => setActiveModalEvent(null)}
      />

      <CreateEventModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
};
