import React, { useState } from 'react';
import { useApp } from '../AppContext';
import {
  FileText,
  Users,
  DollarSign,
  Plus,
  Trash2,
  Check,
  Save,
  RefreshCw,
  Trophy,
  Shield,
  FileSpreadsheet,
  AlertCircle,
  Edit2
} from 'lucide-react';
import { MemberRecord, ManagementLeader, FinanceSummary } from '../types';

export const LiveDataEditor: React.FC = () => {
  const {
    language,
    role,
    memberRecords,
    updateMemberDetails,
    addMember,
    deleteMember,
    financeSummary,
    updateFinanceSummary,
    managementLeaders,
    updateLeader,
    pushChangesToSheet,
    isPushing,
    showToast
  } = useApp();

  const [activeSection, setActiveSection] = useState<'members' | 'finances' | 'leaders'>('members');

  // Filter for members editor
  const [memberSearch, setMemberSearch] = useState('');

  // New Member Modal/Inline State
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemCode, setNewMemCode] = useState(`YS-${String(memberRecords.length + 1).padStart(3, '0')}`);
  const [newMemName, setNewMemName] = useState('');
  const [newMemSinhala, setNewMemSinhala] = useState('');
  const [newMemPhone, setNewMemPhone] = useState('077-');
  const [newMemCat, setNewMemCat] = useState<'Senior' | 'Junior' | 'Honorary'>('Senior');

  // Editing finance fields
  const [finIncome, setFinIncome] = useState(financeSummary.totalIncome);
  const [finExpenses, setFinExpenses] = useState(financeSummary.totalExpenses);
  const [finFee, setFinFee] = useState(financeSummary.weeklyFee);

  const handleAddNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemName.trim()) return;

    addMember({
      memberCode: newMemCode,
      name: newMemName,
      nameSinhala: newMemSinhala || newMemName,
      phone: newMemPhone,
      category: newMemCat,
      categorySinhala: newMemCat === 'Senior' ? 'ජ්‍යෙෂ්ඨ' : newMemCat === 'Junior' ? 'කනිෂ්ඨ' : 'ගරු'
    });

    setIsAddingMember(false);
    setNewMemName('');
    setNewMemSinhala('');
    setNewMemCode(`YS-${String(memberRecords.length + 2).padStart(3, '0')}`);
  };

  const handleSaveFinances = (e: React.FormEvent) => {
    e.preventDefault();
    updateFinanceSummary({
      totalIncome: Number(finIncome),
      totalExpenses: Number(finExpenses),
      netBalance: Number(finIncome) - Number(finExpenses),
      weeklyFee: Number(finFee)
    });
  };

  const filteredMembers = memberRecords.filter(m =>
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.memberCode.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.phone.includes(memberSearch)
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-1">
            <Edit2 className="w-3.5 h-3.5 text-amber-700" />
            <span>Universal Live Content & Member Editor</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {language === 'si' ? 'වෙබ් පිටුව හා සියලු දත්ත සෘජුවම යාවත්කාලීන කරන්න' : 'Update & Retype Anything in the Portal'}
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            {language === 'si'
              ? 'ඔබට අවශ්‍ය ඕනෑම සාමාජිකයෙකුගේ විස්තර, දුරකථන අංක, මුදල් ගණනය කිරීම් සහ නායක මණ්ඩලයේ තොරතුරු සෘජුවම වෙනස් කරන්න හෝ අලුතින් එක් කරන්න.'
              : 'Directly edit, retype, add or delete any member record, phone, category, dues status, financial balances, and leadership rosters in real-time.'}
          </p>
        </div>

        <button
          onClick={() => pushChangesToSheet()}
          disabled={isPushing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isPushing ? 'animate-spin' : ''}`} />
          <span>{isPushing ? 'Pushing to Sheet...' : 'Push All Updates to Google Sheet'}</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSection('members')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'members'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>All 26+ Members Roster</span>
        </button>

        <button
          onClick={() => setActiveSection('finances')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'finances'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Treasury & Fees Settings</span>
        </button>

        <button
          onClick={() => setActiveSection('leaders')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'leaders'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Leadership Details</span>
        </button>
      </div>

      {/* SECTION 1: MEMBERS INLINE EDITOR */}
      {activeSection === 'members' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <input
              type="text"
              placeholder="Filter members by name, code or phone..."
              value={memberSearch}
              onChange={e => setMemberSearch(e.target.value)}
              className="w-full sm:w-72 p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
            />

            <button
              onClick={() => setIsAddingMember(!isAddingMember)}
              className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingMember ? 'Close Form' : '+ Add New Member'}</span>
            </button>
          </div>

          {/* Add New Member Form */}
          {isAddingMember && (
            <form onSubmit={handleAddNewMember} className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-4">
              <h4 className="font-bold text-emerald-900 text-xs uppercase">Enter New Member Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Code</label>
                  <input
                    type="text"
                    value={newMemCode}
                    onChange={e => setNewMemCode(e.target.value)}
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Full English Name</label>
                  <input
                    type="text"
                    value={newMemName}
                    onChange={e => setNewMemName(e.target.value)}
                    placeholder="e.g. Kasun Chamara"
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Sinhala Name</label>
                  <input
                    type="text"
                    value={newMemSinhala}
                    onChange={e => setNewMemSinhala(e.target.value)}
                    placeholder="e.g. කසුන් චාමර"
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Phone</label>
                  <input
                    type="text"
                    value={newMemPhone}
                    onChange={e => setNewMemPhone(e.target.value)}
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Category</label>
                  <select
                    value={newMemCat}
                    onChange={e => setNewMemCat(e.target.value as any)}
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-bold"
                  >
                    <option value="Senior">Senior (ජ්‍යෙෂ්ඨ)</option>
                    <option value="Junior">Junior (කනිෂ්ඨ)</option>
                    <option value="Honorary">Honorary (ගරු)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingMember(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer"
                >
                  Save Member
                </button>
              </div>
            </form>
          )}

          {/* Members Table with Live In-Place Inputs */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Full Name (English)</th>
                    <th className="py-2.5 px-3">Sinhala Name</th>
                    <th className="py-2.5 px-3">Phone</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-center">Paid (Rs)</th>
                    <th className="py-2.5 px-3 text-center">Owed (Rs)</th>
                    <th className="py-2.5 px-3 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredMembers.map(m => (
                    <tr key={m.memberId} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono font-bold text-slate-700">
                        <input
                          type="text"
                          value={m.memberCode}
                          onChange={e => updateMemberDetails(m.memberId, { memberCode: e.target.value })}
                          className="w-16 p-1 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-amber-500 rounded font-mono text-[11px]"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={m.name}
                          onChange={e => updateMemberDetails(m.memberId, { name: e.target.value })}
                          className="w-full min-w-[140px] p-1 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-amber-500 rounded font-semibold text-slate-900"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={m.nameSinhala}
                          onChange={e => updateMemberDetails(m.memberId, { nameSinhala: e.target.value })}
                          className="w-full min-w-[140px] p-1 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-amber-500 rounded text-slate-800"
                        />
                      </td>
                      <td className="py-2 px-3 font-mono">
                        <input
                          type="text"
                          value={m.phone}
                          onChange={e => updateMemberDetails(m.memberId, { phone: e.target.value })}
                          className="w-28 p-1 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-amber-500 rounded font-mono text-[11px]"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <select
                          value={m.category}
                          onChange={e => updateMemberDetails(m.memberId, { category: e.target.value as any })}
                          className="p-1 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 rounded text-[11px] font-medium"
                        >
                          <option value="Senior">Senior</option>
                          <option value="Junior">Junior</option>
                          <option value="Honorary">Honorary</option>
                        </select>
                      </td>
                      <td className="py-2 px-3 text-center font-bold text-emerald-800">
                        <input
                          type="number"
                          value={m.totalPaid}
                          onChange={e => {
                            const val = Number(e.target.value);
                            updateMemberDetails(m.memberId, {
                              totalPaid: val,
                              totalOwed: Math.max(0, 1000 - val),
                              status: val >= 1000 ? 'good' : val >= 500 ? 'due' : 'overdue'
                            });
                          }}
                          className="w-20 p-1 text-center bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-amber-500 rounded font-mono text-[11px] font-bold text-emerald-800"
                        />
                      </td>
                      <td className="py-2 px-3 text-center font-mono text-amber-800 font-bold">
                        Rs {m.totalOwed}
                      </td>
                      <td className="py-2 px-3 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Remove ${m.name} from club?`)) {
                              deleteMember(m.memberId);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                          title="Delete Member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: TREASURY & FINANCES SETTINGS */}
      {activeSection === 'finances' && (
        <form onSubmit={handleSaveFinances} className="max-w-xl space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Total Treasury Income (Rs)</label>
              <input
                type="number"
                value={finIncome}
                onChange={e => setFinIncome(Number(e.target.value))}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Total Expenses Recorded (Rs)</label>
              <input
                type="number"
                value={finExpenses}
                onChange={e => setFinExpenses(Number(e.target.value))}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Weekly Membership Fee (Rs)</label>
              <input
                type="number"
                value={finFee}
                onChange={e => setFinFee(Number(e.target.value))}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save Finance Numbers
            </button>
          </div>
        </form>
      )}

      {/* SECTION 3: LEADERS RENAME & ROLES */}
      {activeSection === 'leaders' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">Edit designations, contact numbers, and bios of club executives.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {managementLeaders.map(leader => (
              <div key={leader.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <input
                  type="text"
                  value={leader.name}
                  onChange={e => updateLeader(leader.id, { name: e.target.value })}
                  className="w-full p-1.5 font-bold text-slate-900 text-xs bg-white border border-slate-200 rounded-lg"
                />
                <input
                  type="text"
                  value={leader.designation}
                  onChange={e => updateLeader(leader.id, { designation: e.target.value })}
                  placeholder="Designation"
                  className="w-full p-1.5 text-xs text-amber-800 bg-white border border-slate-200 rounded-lg font-medium"
                />
                <input
                  type="text"
                  value={leader.phone || ''}
                  onChange={e => updateLeader(leader.id, { phone: e.target.value })}
                  placeholder="Phone"
                  className="w-full p-1.5 text-xs font-mono text-slate-700 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
