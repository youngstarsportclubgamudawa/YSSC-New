import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { FolderOpen, X, Link2 } from 'lucide-react';

interface UploadDocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadDocModal: React.FC<UploadDocModalProps> = ({ isOpen, onClose }) => {
  const { language, t, addDocument } = useApp();
  const [title, setTitle] = useState('');
  const [titleSinhala, setTitleSinhala] = useState('');
  const [category, setCategory] = useState<'minutes' | 'financial' | 'policies' | 'fixtures' | 'forms'>('minutes');
  const [fileType, setFileType] = useState<'pdf' | 'sheet' | 'doc'>('pdf');
  const [driveUrl, setDriveUrl] = useState('');
  const [size, setSize] = useState('1.2 MB');
  const [description, setDescription] = useState('');
  const [descriptionSinhala, setDescriptionSinhala] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !driveUrl.trim()) return;

    addDocument({
      title: title.trim(),
      titleSinhala: titleSinhala.trim() || title.trim(),
      category,
      fileType,
      size: size || '1.0 MB',
      driveUrl: driveUrl.trim(),
      uploadedBy: 'Club Organiser (Google Drive)',
      description: description.trim() || 'Club official Google Drive document',
      descriptionSinhala: descriptionSinhala.trim() || 'සමාජ නිල ගූගල් ඩ්‍රයිව් ලේඛනය'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <FolderOpen className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight">
                {language === 'si' ? 'ගූගල් ඩ්‍රයිව් ලේඛනයක් එක්කිරීම' : 'Link Google Drive Document'}
              </h3>
              <p className="text-xs text-blue-200 mt-0.5">
                {language === 'si'
                  ? 'සමාජ සාමාජිකයින්ට බැලීමට ගොනුවක් එක්කරන්න'
                  : 'Publish club minutes, forms, or policies'}
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

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-700">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
              Document Title (English) *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Gamudawa Tournament Rules 2026"
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
              Document Title (සිංහල)
            </label>
            <input
              type="text"
              value={titleSinhala}
              onChange={(e) => setTitleSinhala(e.target.value)}
              placeholder="උදා: ගම්උදාව තරඟාවලි නීති පද්ධතිය"
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-sinhala focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="minutes">AGM & Committee Minutes</option>
                <option value="financial">Financial Statements</option>
                <option value="policies">Constitution & Bylaws</option>
                <option value="fixtures">Tournament Fixtures</option>
                <option value="forms">Membership Forms</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Format</label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as any)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="pdf">PDF Document</option>
                <option value="sheet">Google Sheet</option>
                <option value="doc">Word / Google Doc</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
              Google Drive Shareable Link *
            </label>
            <div className="relative">
              <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="url"
                required
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Brief Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What this document contains..."
              className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
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
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              {language === 'si' ? 'ලේඛනය එක්කරන්න' : 'Publish to Drive Hub'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
