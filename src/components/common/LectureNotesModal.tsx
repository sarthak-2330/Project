/**
 * Lecture Notes & Teaching Material Modal
 * Displays curriculum topics, slide decks, and lab prerequisites
 */

import React from 'react';
import { X, BookOpen, FileText, Download, CheckCircle2, Link as LinkIcon } from 'lucide-react';

interface LectureNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LectureNotesModal: React.FC<LectureNotesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in text-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Lecture Materials & Syllabus</h2>
              <p className="text-[11px] text-slate-500">CS-702: Cloud Computing • Room LH-401</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 space-y-3">
          <div className="p-3.5 rounded-xl bg-[#eff4ff] border border-blue-100 space-y-1">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
              Today's Module
            </span>
            <h3 className="font-bold text-slate-900 text-sm">
              Module 4: Distributed Consensus & Raft Protocol
            </h3>
            <p className="text-slate-600 text-[11px]">
              Covers Leader Election, Log Replication, Safety Invariants, and Split-Brain mitigation in distributed microservices.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 text-xs">Lecture Assets & Handouts</h4>

            <div className="p-3 rounded-xl border border-slate-200/80 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">CS702_Lec14_RaftConsensus.pdf</p>
                  <span className="text-[10px] text-slate-400">PDF Slide Deck • 42 Slides • 4.8 MB</span>
                </div>
              </div>
              <button
                onClick={() => alert('Downloading CS702_Lec14_RaftConsensus.pdf')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>

            <div className="p-3 rounded-xl border border-slate-200/80 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-purple-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">Lab_Prerequisite_DockerCompose.md</p>
                  <span className="text-[10px] text-slate-400">Markdown Tutorial • 3-Node Container Cluster</span>
                </div>
              </div>
              <button
                onClick={() => alert('Downloading Lab_Prerequisite_DockerCompose.md')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
