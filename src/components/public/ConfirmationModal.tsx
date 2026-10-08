import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Printer, X, Download, ShieldCheck, QrCode, Calendar, MapPin, User, Mail, Award } from 'lucide-react';
import { formatDate } from '../../lib/utils';

interface ConfirmationModalProps {
  data: any;
  onClose: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ data, onClose }) => {
  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00F0FF', '#3B82F6', '#8B5CF6', '#10B981'],
      });
    } catch {}
  }, []);

  if (!data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/80 my-8">
        
        {/* Close Button (Hidden on Print) */}
        <button
          onClick={onClose}
          className="no-print absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Ticket Container */}
        <div id="printable-ticket" className="space-y-6">
          
          {/* Header Badge */}
          <div className="text-center space-y-2 border-b border-cyan-500/20 pb-6">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-400 shadow-neon-cyan">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block font-bold">
              // REGISTRATION CONFIRMED //
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-sans">
              OSINT Workshop Entry Pass
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Keep this receipt & ticket ID for workshop check-in verification.
            </p>
          </div>

          {/* Ticket ID & QR Code Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                REGISTRATION TICKET ID
              </span>
              <span className="text-2xl font-extrabold font-mono text-cyan-400 tracking-wider">
                {data.registration_id}
              </span>
              <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-mono mt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>CONFIRMED & VERIFIED</span>
              </div>
            </div>

            {/* Simulated QR Code SVG */}
            <div className="p-2 bg-white rounded-xl flex-shrink-0 shadow-lg" title="Verification QR Code">
              <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" fill="white" />
                <path d="M10 10h30v30H10zM60 10h30v30H60zM10 60h30v30H10z" fill="black" />
                <path d="M20 20h10v10H20zM70 20h10v10H70zM20 70h10v10H20z" fill="white" />
                <rect x="45" y="10" width="10" height="30" fill="black" />
                <rect x="10" y="45" width="30" height="10" fill="black" />
                <rect x="50" y="50" width="40" height="40" fill="black" />
                <rect x="65" y="65" width="10" height="10" fill="white" />
              </svg>
            </div>
          </div>

          {/* Participant Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans border-b border-slate-800 pb-6">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 font-mono uppercase block text-[10px] mb-0.5">Participant Name</span>
              <span className="text-sm font-bold text-slate-100 flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>{data.full_name}</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 font-mono uppercase block text-[10px] mb-0.5">Email Address</span>
              <span className="text-sm font-bold text-slate-100 flex items-center space-x-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span className="truncate">{data.email}</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 font-mono uppercase block text-[10px] mb-0.5">Workshop Session</span>
              <span className="text-sm font-bold text-slate-100 flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5 text-cyan-400" />
                <span>{data.workshop_name || 'OSINT Workshop'}</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 font-mono uppercase block text-[10px] mb-0.5">Date & Time</span>
              <span className="text-sm font-bold text-slate-100 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>{formatDate(data.date)} • {data.time || '10:00 AM'}</span>
              </span>
            </div>
          </div>

          <div className="text-center font-mono text-[11px] text-slate-400">
            A confirmation email has been dispatched to <span className="text-cyan-400 font-semibold">{data.email}</span>.
          </div>

        </div>

        {/* Modal Actions (No Print) */}
        <div className="no-print mt-6 pt-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-sm font-semibold border border-cyan-500/30 flex items-center justify-center space-x-2 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save Ticket Receipt</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm hover:brightness-110 transition shadow-neon-cyan flex items-center justify-center"
          >
            <span>Done & Close</span>
          </button>
        </div>

      </div>
    </div>
  );
};
