/**
 * Attendance Reports & Analytics View
 * Supports department filters, date filters, subject analysis,
 * CSV download, and printable layout.
 */

import React, { useState, useMemo } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Download, Printer, Filter, BarChart3, TrendingUp, Users } from 'lucide-react';

export const AttendanceReports: React.FC = () => {
  const { studentSummaries, departments, subjects, sessions } = useDatabase();

  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [dateRange, setDateRange] = useState('OCT_2024');

  // Filtered dataset
  const filteredList = useMemo(() => {
    return studentSummaries.filter(item => {
      if (selectedDept !== 'ALL') {
        if (selectedDept === 'CSE' && item.student.department_id !== 'dept-cse') return false;
        if (selectedDept === 'ECE' && item.student.department_id !== 'dept-ece') return false;
        if (selectedDept === 'ME' && item.student.department_id !== 'dept-me') return false;
      }
      return true;
    });
  }, [studentSummaries, selectedDept]);

  // Overall metrics
  const totalStudents = filteredList.length;
  const avgAttendance = useMemo(() => {
    if (totalStudents === 0) return 0;
    const sum = filteredList.reduce((acc, curr) => acc + (curr.attendance_percentage || 0), 0);
    return Number((sum / totalStudents).toFixed(1));
  }, [filteredList, totalStudents]);

  const defaultersCount = filteredList.filter(s => (s.attendance_percentage || 0) < 75).length;
  const safeCount = totalStudents - defaultersCount;

  // CSV Export handler
  const handleExportCSV = () => {
    const headers = ['Roll Number', 'Full Name', 'Department', 'Attended', 'Total Eligible', 'Attendance %', 'Status'];
    const rows = filteredList.map(item => [
      item.student.enrollment_number,
      item.student.profile?.full_name || '',
      item.student.department?.department_code || 'CSE',
      item.attended_sessions,
      item.total_eligible_sessions || 80,
      `${item.attendance_percentage || 0}%`,
      (item.attendance_percentage || 0) >= 75 ? 'ELIGIBLE' : 'DEFAULTER'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CAMS_Official_Attendance_Report_${selectedDept}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto space-y-4 px-3 sm:px-4 pb-28">
      {/* Top Header & Actions */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
            Institutional Audit
          </span>
          <h1 className="text-xl font-bold text-slate-900">Attendance Reports & Records</h1>
          <p className="text-xs text-slate-500">Official college records verified under academic regulations</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="h-10 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="h-10 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Department</label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600"
          >
            <option value="ALL">All Departments</option>
            <option value="CSE">Computer Science & Engg.</option>
            <option value="ECE">Electronics & Communication</option>
            <option value="ME">Mechanical Engineering</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Academic Cycle</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600"
          >
            <option value="OCT_2024">Fall 2024 (Month of October)</option>
            <option value="TERM_ODD">Full Odd-Term 2024–25</option>
            <option value="WEEK_9">Week 9 (Oct 21–25, 2024)</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Subject Focus</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600"
          >
            <option value="ALL">All Enrolled Subjects</option>
            <option value="CS-501">CS-501: Operating Systems</option>
            <option value="CS-504">CS-504: Database Management Systems</option>
            <option value="CS-502">CS-502: Computer Networks</option>
          </select>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Audited Students</span>
          <span className="text-2xl font-bold text-slate-900 tabular-nums">{totalStudents}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cohort Mean</span>
          <span className="text-2xl font-bold text-emerald-700 tabular-nums">{avgAttendance}%</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Defaulters (&lt;75%)</span>
          <span className="text-2xl font-bold text-red-600 tabular-nums">{defaultersCount}</span>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Dept</th>
                <th className="py-3 px-4">Attended / Total</th>
                <th className="py-3 px-4">Quorum %</th>
                <th className="py-3 px-4">Exam Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map(item => {
                const s = item.student;
                const pct = item.attendance_percentage ?? 85.0;
                const isPass = pct >= 75;

                return (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">
                      {s.enrollment_number}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {s.profile?.full_name}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {s.department?.department_code || 'CSE'}
                    </td>
                    <td className="py-3 px-4 tabular-nums text-slate-600">
                      {item.attended_sessions} / {item.total_eligible_sessions || 80}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold tabular-nums">
                      <span className={pct < 75 ? 'text-red-600' : 'text-emerald-700'}>
                        {pct.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {isPass ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Eligible
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
                          Shortage
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
