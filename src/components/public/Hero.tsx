import React, { useState, useEffect } from 'react';
import { Terminal, Calendar, Clock, MapPin, ChevronDown, Cpu, ShieldAlert, Sparkles } from 'lucide-react';
import { WorkshopSettings } from '../../types';
import { formatDate } from '../../lib/utils';

interface HeroProps {
  settings: WorkshopSettings;
  spotsLeft: number;
  isOpen: boolean;
  onRegisterClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, spotsLeft, isOpen, onRegisterClick }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    if (!settings.date) return;

    const targetTime = new Date(`${settings.date}T10:00:00`).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [settings.date]);

  return (
    <div className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden">
      {/* Background Radar / Glow accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Terminal Badge Prompt */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 font-mono text-xs mb-8 shadow-neon-cyan animate-pulse">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">root@osint-intel:~#</span>
          <span className="text-cyan-300 font-semibold">./initialize_recon_workshop.sh --live</span>
          <Sparkles className="w-3 h-3 text-cyan-400" />
        </div>

        {/* Dynamic Workshop Title */}
        {settings.toggle_workshop_name && (
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight max-w-4xl mx-auto leading-[1.15] mb-6">
            {settings.workshop_name.includes(':') ? (
              <>
                <span className="block">{settings.workshop_name.split(':')[0]}</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 font-mono text-3xl sm:text-4xl lg:text-5xl block mt-2">
                  {settings.workshop_name.split(':')[1]}
                </span>
              </>
            ) : (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                {settings.workshop_name}
              </span>
            )}
          </h1>
        )}

        {/* Dynamic Workshop Description */}
        {settings.toggle_description && settings.description && (
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8 font-sans font-normal">
            {settings.description}
          </p>
        )}

        {/* Countdown Timer */}
        {timeLeft && (
          <div className="max-w-xl mx-auto mb-10 p-4 rounded-2xl glass-card border border-cyan-500/30">
            <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-3 font-semibold">
              // WORKSHOP COUNTDOWN LAUNCH TIMER //
            </div>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700/60">
                <span className="block text-2xl sm:text-3xl font-bold font-mono text-cyan-400">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Days</span>
              </div>
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700/60">
                <span className="block text-2xl sm:text-3xl font-bold font-mono text-cyan-400">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Hours</span>
              </div>
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700/60">
                <span className="block text-2xl sm:text-3xl font-bold font-mono text-cyan-400">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Minutes</span>
              </div>
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700/60">
                <span className="block text-2xl sm:text-3xl font-bold font-mono text-cyan-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Seconds</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {isOpen ? (
            <button
              onClick={onRegisterClick}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-slate-950 font-bold text-base hover:brightness-110 transition shadow-neon-cyan flex items-center justify-center space-x-3 group"
            >
              <Cpu className="w-5 h-5 text-slate-950 group-hover:rotate-45 transition duration-300" />
              <span>Claim Your Workshop Seat</span>
              <ChevronDown className="w-5 h-5 text-slate-950 group-hover:translate-y-1 transition duration-200" />
            </button>
          ) : (
            <div className="flex items-center space-x-3 px-6 py-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 font-mono text-sm">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Registration Closed by Administrator</span>
            </div>
          )}

          {settings.toggle_max_participants && (
            <div className="px-5 py-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 font-mono text-xs text-slate-300 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>SPOTS REMAINING:</span>
              <span className="text-cyan-400 font-bold text-sm">{spotsLeft} / {settings.max_participants}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
