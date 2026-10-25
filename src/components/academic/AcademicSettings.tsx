/**
 * Academic Settings & Institutional Configuration
 * Admin control over departments, subjects, faculty assignments,
 * attendance thresholds, and audit trail ledger.
 */

import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/storage';
import { 
  Building2, 
  BookOpen, 
  Sliders, 
  History, 
  Plus, 
  CheckCircle2, 
  ShieldCheck,
  X
} from 'lucide-react';

export const AcademicSettings: React.FC = () => {
  const { settings, departments, subjects, faculty, correctionRequests, defaulters, refreshData } = useDatabase();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'thresholds' | 'departments' | 'subjects' | 'corrections' | 'audit'>('thresholds');

  // Form states for thresholds
  const [threshold, setThreshold] = useState(settings.attendance_threshold_percentage);
  const [criticalThreshold, setCriticalThreshold] = useState(settings.critical_threshold_percentage);
  const [lateCountAttended, setLateCountAttended] = useState(settings.late_counts_as_attended);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Sync state whenever settings change in database
  React.useEffect(() => {
    setThreshold(settings.attendance_threshold_percentage);
    setCriticalThreshold(settings.critical_threshold_percentage);
    setLateCountAttended(settings.late_counts_as_attended);
  }, [settings.attendance_threshold_percentage, settings.critical_threshold_percentage, settings.late_counts_as_attended]);

  // Add Department Modal
  const [showAddDept, setShowAddDept] = useState(false);
  const [deptCode, setDeptCode] = useState('');
  const [deptName, setDeptName] = useState('');
  const [deptDesc, setDeptDesc] = useState('');

  // Add Subject Modal
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [subCode, setSubCode] = useState('');
  const [subName, setSubName] = useState('');
  const [subCredits, setSubCredits] = useState(4);
  const [subDeptId, setSubDeptId] = useState(departments[0]?.id || 'dept-cse');

  const auditLogs = db.getAuditLogs();

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateSettings({
      attendance_threshold_percentage: Number(threshold),
      critical_threshold_percentage: Number(criticalThreshold),
      late_counts_as_attended: lateCountAttended
    });

    db.addAuditLog({
      actor_profile_id: currentUser?.id || 'admin',
      actor_name: currentUser?.full_name || 'Administrator',
      action: 'UPDATE_ATTENDANCE_THRESHOLDS',
      entity_type: 'system_settings',
      entity_id: 'current_settings',
      metadata: {
        new_threshold: threshold,
        new_critical: criticalThreshold,
        late_counts_as_attended: lateCountAttended
      }
    });

    refreshData();
    setToastMsg('Attendance policy thresholds updated and saved!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptCode || !deptName) return;
    db.addDepartment({
      department_code: deptCode.toUpperCase().trim(),
      department_name: deptName.trim(),
      description: deptDesc.trim()
    });
    refreshData();
    setShowAddDept(false);
    setDeptCode('');
    setDeptName('');
    setDeptDesc('');
    setToastMsg(`Department ${deptCode} created successfully!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subCode || !subName) return;
    db.addSubject({
      subject_code: subCode.toUpperCase().trim(),
      subject_name: subName.trim(),
      department_id: subDeptId,
      semester_id: 'sem-5',
      credits: subCredits
    });
    refreshData();
    setShowAddSubject(false);
    setSubCode('');
    setSubName('');
    setToastMsg(`Subject ${subCode} added successfully!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto space-y-4 px-3 sm:px-4 pb-28 text-xs">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80">
        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
          Administrative Console
        </span>
        <h1 className="text-xl font-bold text-slate-900">Academic Regulations & Structure</h1>
        <p className="text-slate-500 mt-0.5">
          Configure institutional minimums, academic departments, curriculum subjects, and audit history.
        </p>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3 mt-2 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('thresholds')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              activeTab === 'thresholds' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Policy Thresholds
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              activeTab === 'departments' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Departments ({departments.length})
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              activeTab === 'subjects' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Subjects ({subjects.length})
          </button>
          <button
            onClick={() => setActiveTab('corrections')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              activeTab === 'corrections' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Correction Petitions ({correctionRequests.filter(r => r.request_status === 'pending').length} Pending)
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              activeTab === 'audit' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Audit Trail Ledger
          </button>
        </div>
      </div>

      {/* Tab 1: Thresholds Configuration */}
      {activeTab === 'thresholds' && (
        <form onSubmit={handleSaveThresholds} className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              Attendance Percentage Formulas & Gates
            </h3>
            <p className="text-slate-500 mt-0.5">
              These percentages govern automated hall ticket withholding, exam eligibility flags, and shortage alerts.
            </p>
          </div>

          {/* Quick Presets matching Institutional Policies */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Institutional Policy Presets (Quick Apply)
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setThreshold(75);
                  setCriticalThreshold(65);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  threshold === 75 && criticalThreshold === 65
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Standard (75% Gate / 65% Critical)
              </button>

              <button
                type="button"
                onClick={() => {
                  setThreshold(80);
                  setCriticalThreshold(70);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  threshold === 80 && criticalThreshold === 70
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Strict Regulation (80% Gate / 70% Critical)
              </button>

              <button
                type="button"
                onClick={() => {
                  setThreshold(70);
                  setCriticalThreshold(60);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  threshold === 70 && criticalThreshold === 60
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Lenient Term (70% Gate / 60% Critical)
              </button>

              <button
                type="button"
                onClick={() => {
                  setThreshold(85);
                  setCriticalThreshold(75);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  threshold === 85 && criticalThreshold === 75
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Audit Gate (85% Gate / 75% Critical)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Standard Eligibility Gate (% Minimum)
              </label>
              <input
                type="number"
                min="10"
                max="100"
                step="0.5"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 font-mono font-bold text-sm focus:outline-none focus:border-blue-600"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Students below this percentage are flagged as Defaulters.</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Critical Defaulter Severity Floor (% Floor)
              </label>
              <input
                type="number"
                min="10"
                max="90"
                step="0.5"
                value={criticalThreshold}
                onChange={(e) => setCriticalThreshold(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 font-mono font-bold text-sm focus:outline-none focus:border-blue-600"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Below this, severe Critical Alert & Exam Hold trigger.</span>
            </div>
          </div>

          {/* Live Impact Preview Banner */}
          <div className="bg-[#e5eeff] rounded-xl p-3.5 border border-blue-200/70 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="material-symbols-outlined text-blue-700 text-[20px] shrink-0">analytics</span>
              <div className="text-xs text-blue-900 leading-snug">
                <span className="font-bold">Current Live Defaulters:</span> {defaulters.length} students currently below gate ({defaulters.filter(d => d.tier === 'critical').length} Critical, {defaulters.filter(d => d.tier === 'warning').length} Warning).
              </div>
            </div>
            <span className="shrink-0 text-[11px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">
              Reactive
            </span>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={lateCountAttended}
                onChange={(e) => setLateCountAttended(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              <div>
                <span className="font-semibold text-slate-800">Count Late Attendance as Attended</span>
                <span className="text-[11px] text-slate-500 block">
                  Per Prompt Section 12: Late sessions are counted as attended by default in the official numerator.
                </span>
              </div>
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Policy Changes & Re-evaluate Defaulters</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Departments */}
      {activeTab === 'departments' && (
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Academic Departments</h3>
              <p className="text-slate-500">Active university faculties and subdivisions</p>
            </div>
            <button
              onClick={() => setShowAddDept(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Department</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {departments.map(d => (
              <div key={d.id} className="p-4 rounded-xl bg-[#eff4ff] border border-blue-100 space-y-1">
                <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-mono font-bold text-[10px]">
                  {d.department_code}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1">{d.department_name}</h4>
                <p className="text-slate-600 text-[11px]">{d.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Subjects */}
      {activeTab === 'subjects' && (
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Curriculum Subjects</h3>
              <p className="text-slate-500">Official course catalog and faculty assignments</p>
            </div>
            <button
              onClick={() => setShowAddSubject(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Subject</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {subjects.map(s => (
              <div key={s.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-600">{s.subject_code}</span>
                    <span className="font-bold text-slate-800">{s.subject_name}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Default Room: {s.room_default || 'LH-302'}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
                  {s.credits || 4} Credits
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Attendance Correction Petitions */}
      {activeTab === 'corrections' && (
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Attendance Correction Requests & Review
            </h3>
            <p className="text-slate-500">Authorized administrative approval workflow for attendance modifications</p>
          </div>

          <div className="space-y-3">
            {correctionRequests.length === 0 ? (
              <p className="py-6 text-center text-slate-400">No correction petitions on file.</p>
            ) : (
              correctionRequests.map(req => (
                <div key={req.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{req.student_name}</span>
                        <span className="text-slate-400 font-mono text-[11px]">({req.subject_name})</span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        Session Date: {req.attendance_date} • Requested: <strong className="uppercase text-blue-600">{req.requested_status}</strong> (from {req.previous_status || 'absent'})
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                        req.request_status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.request_status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {req.request_status}
                    </span>
                  </div>

                  <p className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 italic">
                    "{req.reason}"
                  </p>

                  {req.request_status === 'pending' && (
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => {
                          db.reviewCorrectionRequest(req.id, 'rejected', currentUser?.id || 'admin', 'Rejected by administrator: insufficient evidence provided.');
                          refreshData();
                          setToastMsg('Petition rejected and requester notified.');
                        }}
                        className="px-3 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-semibold cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          db.reviewCorrectionRequest(req.id, 'approved', currentUser?.id || 'admin', 'Approved per official documentation verified.');
                          refreshData();
                          setToastMsg('Petition approved and attendance record updated securely.');
                        }}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer shadow-xs"
                      >
                        Approve & Update Record
                      </button>
                    </div>
                  )}

                  {req.review_note && (
                    <p className="text-[10px] text-slate-500 font-mono">
                      Decision Note: {req.review_note} (Reviewed at {req.reviewed_at ? new Date(req.reviewed_at).toLocaleDateString() : 'N/A'})
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 space-y-3">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              Immutable Audit Trail Ledger
            </h3>
            <p className="text-slate-500">Chronological cryptographic record of administrative & attendance actions</p>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.map(log => (
              <div key={log.id} className="py-2.5 flex items-start justify-between gap-3 font-mono">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold text-[10px]">
                      {log.action}
                    </span>
                    <span className="text-slate-700 text-[11px]">{log.actor_name}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Entity: {log.entity_type} ({log.entity_id})
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {showAddDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3">Add Department</h3>
            <form onSubmit={handleAddDepartment} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI"
                  value={deptCode}
                  onChange={(e) => setDeptCode(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 uppercase"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence & Data Science"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddDept(false)} className="px-3 py-1.5 rounded-lg bg-slate-100">
                  Cancel
                </button>
                <button type="submit" className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3">Add Subject</h3>
            <form onSubmit={handleAddSubject} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Subject Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS-505"
                  value={subCode}
                  onChange={(e) => setSubCode(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 uppercase"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Subject Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Microprocessors & Interfacing"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddSubject(false)} className="px-3 py-1.5 rounded-lg bg-slate-100">
                  Cancel
                </button>
                <button type="submit" className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-full font-semibold shadow-xl flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
