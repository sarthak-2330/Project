/**
 * Comprehensive Weekly Timetable Modal
 * Displays weekly schedule across lecture halls and laboratory slots
 */

import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, User, BookOpen } from 'lucide-react';

interface TimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TimetableModal: React.FC<TimetableModalProps> = ({ isOpen, onClose }) => {
  const [selectedDay, setSelectedDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'>('Thu');
  const [selectedSection, setSelectedSection] = useState<'Sem V-A' | 'Sem V-B' | 'Sem VII'>('Sem V-A');

  if (!isOpen) return null;

  const timetableSchedule: Record<string, { time: string; subject: string; room: string; faculty: string; type: 'lecture' | 'lab' | 'tutorial' }[]> = {
    Thu: [
      { time: '09:30 AM – 10:30 AM', subject: 'CS-501: Operating Systems', room: 'LH-302', faculty: 'Prof. Rajesh Sharma', type: 'lecture' },
      { time: '10:30 AM – 11:00 AM', subject: 'Academic Tea Break', room: 'Cafeteria', faculty: '—', type: 'tutorial' },
      { time: '11:00 AM – 12:00 PM', subject: 'CS-504: Database Management Systems', room: 'Lab 2B', faculty: 'Prof. Rajesh Sharma', type: 'lab' },
      { time: '01:00 PM – 02:00 PM', subject: 'CS-502: Computer Networks', room: 'LH-301', faculty: 'Dr. Priya Rao', type: 'lecture' },
      { time: '02:00 PM – 03:00 PM', subject: 'CS-702: Cloud Computing', room: 'LH-401', faculty: 'Prof. Rajesh Sharma', type: 'lecture' },
      { time: '03:15 PM – 04:45 PM', subject: 'CS-503: Design & Analysis of Algorithms', room: 'LH-304', faculty: 'Prof. Vikram Seth', type: 'lecture' }
    ],
    Mon: [
      { time: '09:30 AM – 10:30 AM', subject: 'CS-501: Operating Systems', room: 'LH-302', faculty: 'Prof. Rajesh Sharma', type: 'lecture' },
      { time: '11:00 AM – 01:00 PM', subject: 'CS-501: OS Kernel Programming Lab', room: 'Lab 1A', faculty: 'Prof. Rajesh Sharma', type: 'lab' },
      { time: '02:00 PM – 03:00 PM', subject: 'CS-502: Computer Networks', room: 'LH-301', faculty: 'Dr. Priya Rao', type: 'lecture' }
    ],
    Tue: [
      { time: '09:30 AM – 10:30 AM', subject: 'CS-503: Algorithms & Complexity', room: 'LH-304', faculty: 'Prof. Vikram Seth', type: 'lecture' },
      { time: '11:00 AM – 12:00 PM', subject: 'CS-504: DBMS Relational Modeling', room: 'LH-302', faculty: 'Prof. Rajesh Sharma', type: 'lecture' },
      { time: '02:00 PM – 04:00 PM', subject: 'CS-504: Database Systems Lab', room: 'Lab 2B', faculty: 'Prof. Rajesh Sharma', type: 'lab' }
    ],
    Wed: [
      { time: '09:30 AM – 10:30 AM', subject: 'CS-501: Operating Systems (Virtual Memory)', room: 'LH-302', faculty: 'Prof. Rajesh Sharma', type: 'lecture' },
      { time: '11:00 AM – 12:00 PM', subject: 'CS-502: Network Protocols & OSI', room: 'LH-301', faculty: 'Dr. Priya Rao', type: 'lecture' },
      { time: '01:00 PM – 03:00 PM', subject: 'Mini-Project Mentoring Session', room: 'Seminar Hall B', faculty: 'Faculty Panel', type: 'tutorial' }
    ],
    Fri: [
      { time: '09:30 AM – 10:30 AM', subject: 'CS-501: Operating Systems Review', room: 'LH-302', faculty: 'Prof. Rajesh Sharma', type: 'lecture' },
      { time: '11:00 AM – 12:00 PM', subject: 'CS-503: Graph Algorithms & Dynamic Programming', room: 'LH-304', faculty: 'Prof. Vikram Seth', type: 'lecture' },
      { time: '02:00 PM – 04:00 PM', subject: 'Departmental Defaulter Counseling & Remedial Clinic', room: 'Faculty Lounge 204', faculty: 'Dr. Priya Rao', type: 'tutorial' }
    ]
  };

  const currentSlots = timetableSchedule[selectedDay] || timetableSchedule['Thu'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Academic Lecture Timetable</h2>
              <p className="text-[11px] text-slate-500">Odd Term 2024–25 • Computer Science & Engineering</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section & Day Selectors */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 my-3">
          {/* Day Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const).map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  selectedDay === day
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Section Picker */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Cohort:</span>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value as any)}
              className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
            >
              <option value="Sem V-A">Sem V-A (LH-302)</option>
              <option value="Sem V-B">Sem V-B (Lab 2B)</option>
              <option value="Sem VII">Sem VII (LH-401)</option>
            </select>
          </div>
        </div>

        {/* Slots List */}
        <div className="space-y-2 mt-2">
          {currentSlots.map((slot, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 transition-all ${
                slot.type === 'lab'
                  ? 'bg-purple-50/50 border-purple-100'
                  : slot.type === 'tutorial'
                  ? 'bg-amber-50/50 border-amber-100'
                  : 'bg-slate-50/80 border-slate-200/80'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center font-bold text-slate-700 shrink-0 text-[11px]">
                  #{idx + 1}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm truncate">{slot.subject}</span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                        slot.type === 'lab'
                          ? 'bg-purple-100 text-purple-800'
                          : slot.type === 'tutorial'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {slot.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-[11px] mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-600" />
                      {slot.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {slot.room}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  {slot.faculty}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4 mt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold cursor-pointer"
          >
            Close Timetable
          </button>
        </div>
      </div>
    </div>
  );
};
