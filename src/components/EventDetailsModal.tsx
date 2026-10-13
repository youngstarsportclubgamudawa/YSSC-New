import React from 'react';
import { useApp } from '../AppContext';
import { ClubEvent } from '../types';
import { Calendar, Clock, MapPin, Users, X } from 'lucide-react';

interface EventDetailsModalProps {
  event: ClubEvent | null;
  onClose: () => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, onClose }) => {
  const { language, t, currentUser, toggleEventRegistration, memberRecords } = useApp();

  if (!event) return null;

  const isRegistered = event.registeredMembers.includes(currentUser.id);
  const isFull = event.registeredMembers.length >= event.maxParticipants;
  const spotsLeft = event.maxParticipants - event.registeredMembers.length;
  const registeredList = event.registeredMembers.map((id) => {
    return (
      memberRecords.find((m) => m.memberId === id) || {
        memberId: id,
        name: 'Club Athlete',
        nameSinhala: 'ක්‍රීඩකයා',
        memberCode: 'YS-M',
        category: 'Senior'
      }
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-start justify-between">
          <div className="space-y-1 pr-4">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/20 text-white">
              {language === 'si' ? event.badgeSinhala : event.badge}
            </span>
            <h3 className="font-extrabold text-base sm:text-lg leading-snug">
              {language === 'si' ? event.titleSinhala : event.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700">
          <p className="text-slate-600 leading-relaxed font-normal">
            {language === 'si' ? event.descriptionSinhala : event.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Date:</strong> {event.date}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Time:</strong> {event.time}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Venue:</strong> {language === 'si' ? event.locationSinhala : event.location}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <Users className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>{t.eventCoach}:</strong> {event.coach}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">
                {language === 'si' ? 'ලියාපදිංචි සාමාජිකයින්' : 'Registered Attendees'} (
                {registeredList.length}/{event.maxParticipants})
              </span>
              <span className="text-slate-500">
                {spotsLeft > 0 ? `${spotsLeft} ${t.spotsLeft}` : t.fullCapacity}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
              {registeredList.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px]"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-[9px] shrink-0">
                    {idx + 1}
                  </div>
                  <span className="truncate font-medium text-slate-800">
                    {language === 'si' ? (m as any).nameSinhala || m.name : m.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
          >
            {t.close}
          </button>
          <button
            onClick={() => toggleEventRegistration(event.id)}
            disabled={!isRegistered && isFull}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
              isRegistered
                ? 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200'
                : isFull
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs'
            }`}
          >
            {isRegistered ? t.cancelBooking : isFull ? t.fullCapacity : t.bookSpot}
          </button>
        </div>
      </div>
    </div>
  );
};
