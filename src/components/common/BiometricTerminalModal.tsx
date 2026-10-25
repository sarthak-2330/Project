/**
 * Biometric Terminal Diagnostics Modal
 * Displays hardware telemetry, mesh fidelity, and live beacon status
 */

import React, { useState } from 'react';
import { X, Wifi, Radio, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';

interface BiometricTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BiometricTerminalModal: React.FC<BiometricTerminalModalProps> = ({
  isOpen,
  onClose
}) => {
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>('Hardware online (12ms RTT)');

  if (!isOpen) return null;

  const handlePing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      setPingResult(`Ping ACK received: 9.4ms latency | 0% packet loss | Signal RSSI -42 dBm`);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in text-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Biometric Terminal Diagnosis</h2>
              <p className="text-[11px] text-slate-500">Hall LH-302 • Hardware Node #BT-302-A</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 space-y-3">
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Mesh Beacon Operational
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                99.8% FIDELITY
              </span>
            </div>
            <p className="text-emerald-800/80 text-[11px]">
              Classroom LH-302 dual-frequency RFID + BLE mesh reader active. Auto-synced with CAMS live roll call session.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-700">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] font-bold">FIRMWARE</span>
              <span className="font-mono font-bold text-slate-900">v3.4.12-PROD</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] font-bold">HEARTBEAT</span>
              <span className="font-mono font-bold text-slate-900">1.2s intervals</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] font-bold">CARDS SCANNED TODAY</span>
              <span className="font-mono font-bold text-slate-900">124 Badges</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] font-bold">SECURITY SEAL</span>
              <span className="font-mono font-bold text-emerald-700">AES-256 HSM</span>
            </div>
          </div>

          {pingResult && (
            <div className="p-2.5 bg-slate-100 text-slate-700 font-mono text-[10px] rounded-lg">
              {pingResult}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            onClick={handlePing}
            disabled={isPinging}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
            <span>Ping Hardware</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
