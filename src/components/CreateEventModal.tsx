import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Calendar, X } from 'lucide-react';
import { ClubEvent } from '../types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose }) => {
  const { language, t, addEvent } = useApp();
  const [title, setTitle] = useState('');
  const [titleSinhala, setTitleSinhala] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionSinhala, setDescriptionSinhala] = useState('');
  const [sportCategory, setSportCategory] = useState('cricket');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00 AM – 12:00 PM');
  const [location, setLocation] = useState('Gamudawa Central Grounds');
  const [coach, setCoach] = useState('Coach Sanath Jayawardena');
  const [capacity, setCapacity] = useState(20);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    const newEv: ClubEvent = {
      id: `ev-${Date.now()}`,
      title: title.trim(),
      titleSinhala: titleSinhala.trim() || title.trim(),
      description: description.trim() || 'Club sporting event at Gamudawa grounds.',
      descriptionSinhala: descriptionSinhala.trim() || 'ගම්උදාව ක්‍රීඩාංගණයේ පැවැත්වෙන නිල තරඟය/පුහුණුව.',
      sportCategory,
      date,
      time,
      location,
      locationSinhala: 'ගම්උදාව ක්‍රීඩාංගණය',
      coach,
      maxParticipants: Number(capacity) || 20,
      registeredMembers: [],
      badge: 'Upcoming',
      badgeSinhala: 'ඉදිරි තරඟය'
    };

    addEvent(newEv);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <Calendar className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight">
                {language === 'si' ? 'නව තරඟයක් / පුහුණු සැසියක් එක්කරන්න' : 'Schedule Club Match or Drill'}
              </h3>
              <p className="text-xs text-amber-100 mt-0.5">
                {language === 'si' ? 'සාමාජිකයින්ට ස්ථාන වෙන්කරවා ගැනීම සඳහා' : 'Open reservations for club athletes'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-700 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Event Title (English) *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Gamudawa T20 Trophy Round 2"
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Event Title (සිංහල)</label>
            <input
              type="text"
              value={titleSinhala}
              onChange={(e) => setTitleSinhala(e.target.value)}
              placeholder="උදා: ගම්උදාව T20 කුසලාන දෙවන වටය"
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-sinhala focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Category</label>
              <select
                value={sportCategory}
                onChange={(e) => setSportCategory(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                <option value="cricket">Cricket Match / Nets</option>
                <option value="football">Football Match</option>
                <option value="volleyball">Volleyball Practice</option>
                <option value="fitness">Fitness Boot Camp</option>
                <option value="meeting">Club Committee Meeting</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Capacity (Max Spots)</label>
              <input
                type="number"
                min="5"
                max="100"
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value))}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="09:00 AM – 12:00 PM"
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Venue</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Coach In Charge</label>
              <input
                type="text"
                value={coach}
                onChange={(e) => setCoach(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Match reporting time, equipment required, team kits..."
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              {language === 'si' ? 'තරඟය සටහන් කරන්න' : 'Publish Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
