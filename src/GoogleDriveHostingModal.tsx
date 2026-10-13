import React, { useState } from 'react';
import { useApp } from './AppContext';
import {
  X,
  FolderOpen,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  FileText,
  Upload,
  Globe,
  Smartphone,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { GOOGLE_DRIVE_FOLDER_URL } from './initialData';
import { generateDriveLauncherHtml } from './sheetUtils';
import { getAccessToken } from './googleAuth';

interface GoogleDriveHostingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleDriveHostingModal: React.FC<GoogleDriveHostingModalProps> = ({
  isOpen,
  onClose
}) => {
  const { language, googleUser, signInWithGoogle, isGoogleLoggingIn, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'hub' | 'launcher' | 'instructions'>('hub');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isUploadingToDrive, setIsUploadingToDrive] = useState(false);

  if (!isOpen) return null;

  const currentWebUrl = window.location.origin;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentWebUrl);
    setCopiedLink(true);
    showToast(language === 'si' ? 'වෙබ් සබැඳිය පිටපත් කරන ලදී!' : 'Live web app link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCreateDriveLauncher = async () => {
    setIsUploadingToDrive(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        showToast(language === 'si' ? 'කරුණාකර පළමුව Google ගිණුමට ලොග් වන්න' : 'Please sign in with Google first');
        return;
      }
      const htmlContent = generateDriveLauncherHtml(currentWebUrl);
      const metadata = {
        name: 'Young Star Sports Club Portal - Web Launcher.html',
        mimeType: 'text/html',
        description: `Official web portal launcher for Young Star Sports Club Gamudawa (${currentWebUrl})`
      };
      const boundary = `-------yssc_boundary_${Date.now()}`;
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;

      const multipartBody =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: text/html; charset=UTF-8\r\n\r\n' +
        htmlContent +
        closeDelimiter;

      const res = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': `multipart/related; boundary=${boundary}`
          },
          body: multipartBody
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Google Drive upload failed (${res.status})`);
      }

      showToast(
        language === 'si'
          ? 'Web Launcher ගොනුව ඔබගේ Google Drive වෙත සාර්ථකව සුරැකිණි!'
          : 'Web Launcher shortcut created in your Google Drive!'
      );
    } catch (e: any) {
      showToast(language === 'si' ? `Drive වෙත යැවීම අසාර්ථකයි: ${e.message}` : `Drive upload notice: ${e.message}`);
    } finally {
      setIsUploadingToDrive(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <FolderOpen className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg leading-tight">
                  {language === 'si'
                    ? 'Google Drive ගොනු සහ Web Hosting මධ්‍යස්ථානය'
                    : 'Google Drive Files & Live Web Hosting Hub'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-700/80 border border-blue-400/30 text-[10px] font-semibold">
                  Google Workspace
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                {language === 'si'
                  ? 'නිල ගූගල් ඩ්‍රයිව් ෆෝල්ඩරය සහ සජීවී වෙබ් සබැඳි කළමනාකරණය'
                  : 'Young Star Sports Club Gamudawa cloud repository & web connection'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 shrink-0">
          <button
            onClick={() => setActiveTab('hub')}
            className={`px-4 py-2 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'hub'
                ? 'border-blue-600 text-blue-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'si' ? 'සජීවී වෙබ් සබැඳිය' : 'Live Web Portal'}
          </button>
          <button
            onClick={() => setActiveTab('launcher')}
            className={`px-4 py-2 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'launcher'
                ? 'border-blue-600 text-blue-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'si' ? 'Drive Launcher සෑදීම' : 'Google Drive Shortcut'}
          </button>
          <button
            onClick={() => setActiveTab('instructions')}
            className={`px-4 py-2 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'instructions'
                ? 'border-blue-600 text-blue-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'si' ? 'Drive & Hosting උපදෙස්' : 'Hosting Heritage'}
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {activeTab === 'hub' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950 space-y-1">
                  <span className="font-bold block text-sm">
                    {language === 'si'
                      ? 'ඔබගේ යෙදුම දැනටමත් සජීවීව අන්තර්ජාලයේ ක්‍රියාත්මකයි!'
                      : 'Your application is ALREADY a live web page hosted on Google Cloud!'}
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {language === 'si'
                      ? 'ඕනෑම සාමාජිකයෙකුට ඕනෑම ස්මාර්ට් ජංගම දුරකථනයකින්, පරිගණකයකින් හෝ ටැබ්ලට් එකකින් පහත ඇති නිල සබැඳිය (URL) මඟින් සජීවීව මෙම යෙදුමට පිවිසිය හැක.'
                      : 'Every club member can access this live web app immediately from any smartphone, tablet, or PC worldwide via the secure URL below.'}
                  </p>
                </div>
              </div>

              {/* URL Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600">
                  <span>{language === 'si' ? 'නිල සජීවී වෙබ් සබැඳිය (Web URL)' : 'Active Web Portal URL'}</span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    HTTPS 256-bit Secure
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <div className="flex-1 font-mono text-xs sm:text-sm text-amber-300 px-2 overflow-x-auto py-1">
                    {currentWebUrl}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                    <a
                      href={currentWebUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Tab</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Mobile Install Guide */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Smartphone className="w-4 h-4 text-amber-600" />
                  <span>How to use as Mobile App on your Phone</span>
                </div>
                <ul className="space-y-1 list-disc list-inside leading-relaxed text-slate-600">
                  <li><strong>Android (Chrome):</strong> Tap the 3 dots (⋮) top right → select <strong>"Add to Home screen"</strong>.</li>
                  <li><strong>iPhone (Safari):</strong> Tap the Share button → select <strong>"Add to Home Screen"</strong>.</li>
                  <li>The official Young Star Sports Club icon will appear directly on your home screen!</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'launcher' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
                <h4 className="font-bold text-sm text-blue-950">
                  {language === 'si' ? 'Google Drive Launcher එකක් සාදන්න' : 'Create Google Drive Shortcut Launcher'}
                </h4>
                <p className="text-xs text-blue-900 leading-relaxed">
                  {language === 'si'
                    ? "'Young Star Sports Club Portal - Web Launcher.html' නමින් ගොනුවක් ඔබගේ Google Drive හි සෑදෙනු ඇත. එය මත ක්ලික් කිරීමෙන් ඕනෑම වේලාවක සජීවී වෙබ් යෙදුම විවෘත වේ."
                    : "This creates a 'Young Star Sports Club Portal - Web Launcher.html' file inside your Google Drive so club officials can open this live web app right from their Google Drive folder alongside their Google Sheets."}
                </p>
                {googleUser ? (
                  <button
                    onClick={handleCreateDriveLauncher}
                    disabled={isUploadingToDrive}
                    className="mt-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isUploadingToDrive ? 'Creating in Google Drive...' : 'Create in My Google Drive'}</span>
                  </button>
                ) : (
                  <div className="pt-2">
                    <button
                      onClick={signInWithGoogle}
                      disabled={isGoogleLoggingIn}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
                    >
                      {isGoogleLoggingIn && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                      <span>Sign in with Google First</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Direct Link to Club Drive */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900">Official Club Drive Folder</div>
                  <div className="text-xs text-slate-500">Access documents, constitution PDFs, and match photos</div>
                </div>
                <a
                  href={GOOGLE_DRIVE_FOLDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Drive Folder</span>
                </a>
              </div>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <h4 className="font-bold text-sm text-slate-900">
                How Modern Web Hosting Works with Google Drive
              </h4>
              <p>
                In 2016, Google officially discontinued raw static web server hosting (<code className="bg-slate-200 px-1 py-0.5 rounded font-mono">googledrive.com/host/</code>) because Google Drive is designed for cloud file storage rather than running web servers.
              </p>
              <p>
                Modern responsive web applications require full web servers—which is why your YSSC Gamudawa application is deployed live on Google Cloud. You can link your Google Drive folder and files into the portal via the "Documents" tab and Google Drive buttons!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            {language === 'si' ? 'වසන්න' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
