import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { FileText, FileSpreadsheet, FolderOpen, ExternalLink, Plus, HardDrive, Download } from 'lucide-react';
import { GOOGLE_DRIVE_FOLDER_URL } from '../initialData';
import { UploadDocModal } from '../components/UploadDocModal';

interface DocumentsViewProps {
  onOpenUploadModal?: () => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = () => {
  const { language, t, role, documents, setActiveTab } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const filteredDocs = documents.filter((doc) => {
    if (selectedCategory === 'all') return true;
    return doc.category === selectedCategory;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-semibold">
              <FolderOpen className="w-3.5 h-3.5 text-blue-300" />
              <span>{language === 'si' ? 'ගූගල් ඩ්‍රයිව් නිල ගොනු සුරක්ෂිතාගාරය' : 'Google Drive Official Archive'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {t.navDocuments}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-xl">
              {language === 'si'
                ? 'ව්‍යවස්ථාව, විගණන මූල්‍ය වාර්තා, වාර්ෂික මහා සභා රැස්වීම් සටහන් සහ තරඟාවලි නීති පද්ධතිය.'
                : 'Official club bylaws, AGM minutes, audited financial reports, and registration forms.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('master-doc')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-slate-950" />
              <span>{language === 'si' ? 'සජීවී ප්‍රධාන ලේඛනය' : 'Living Master Document'}</span>
            </button>

            <a
              href={GOOGLE_DRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-blue-900 font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            >
              <HardDrive className="w-4 h-4 text-blue-700" />
              <span>{t.googleDriveHub}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>

            {role === 'organiser' && (
              <button
                onClick={() => setUploadModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t.uploadDocBtn}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', labelEn: 'All Documents', labelSi: 'සියලුම ලේඛන' },
          { id: 'policies', labelEn: 'Constitution & Rules', labelSi: 'ව්‍යවස්ථාව & නීති' },
          { id: 'financial', labelEn: 'Financial Reports', labelSi: 'මූල්‍ය වාර්තා' },
          { id: 'minutes', labelEn: 'AGM Minutes', labelSi: 'මහා සභා සටහන්' },
          { id: 'fixtures', labelEn: 'Tournament Fixtures', labelSi: 'තරඟ කාලසටහන්' },
          { id: 'forms', labelEn: 'Forms & Regs', labelSi: 'අයදුම්පත්' }
        ].map((item) => {
          const isActive = selectedCategory === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedCategory(item.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {language === 'si' ? item.labelSi : item.labelEn}
            </button>
          );
        })}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => {
          const isSheet = doc.fileType === 'sheet';

          return (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`p-2.5 rounded-xl ${
                      isSheet ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {isSheet ? (
                      <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                    ) : (
                      <FileText className="w-5 h-5 text-blue-700" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {doc.fileType} · {doc.size}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                    {language === 'si' ? doc.titleSinhala : doc.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {language === 'si' ? doc.descriptionSinhala : doc.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-150 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Updated: {doc.updatedDate}</span>
                  <span className="truncate max-w-[140px]">{doc.uploadedBy}</span>
                </div>

                <a
                  href={doc.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-blue-800 border border-slate-200 hover:border-blue-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>Open in Google Drive</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <UploadDocModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </div>
  );
};
