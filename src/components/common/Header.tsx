import React from 'react';
import { Shield, Lock, Unlock, Terminal, Cpu } from 'lucide-react';
import { WorkshopSettings } from '../../types';

interface HeaderProps {
  settings: WorkshopSettings;
  isOpen: boolean;
  isAdminLoggedIn: boolean;
  onOpenAdminModal: () => void;
  onLogoutAdmin: () => void;
  onNavigateToForm: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  isOpen,
  isAdminLoggedIn,
  onOpenAdminModal,
  onLogoutAdmin,
  onNavigateToForm,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#050811]/80 border-b border-cyan-500/20 shadow-lg shadow-cyan-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 shadow-neon-cyan">
            <Shield className="w-6 h-6 text-cyan-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs tracking-widest text-cyan-400 uppercase font-bold">OSINT // INTEL</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono">v2026</span>
            </div>
            <h1 className="text-lg font-extrabold text-slate-100 tracking-tight font-sans">
              OSINT Workshop <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">2026</span>
            </h1>
          </div>
        </div>

        {/* Live Status Badge & Navigation */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 font-mono text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${isOpen ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]' : 'bg-rose-500'}`} />
            <span className={isOpen ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
              {isOpen ? 'REGISTRATION OPEN' : 'REGISTRATION CLOSED'}
            </span>
          </div>

          <button
            onClick={onNavigateToForm}
            className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-semibold text-sm hover:brightness-110 transition shadow-neon-cyan"
          >
            <Cpu className="w-4 h-4" />
            <span>Register Now</span>
          </button>

          {/* Admin Control Button */}
          {isAdminLoggedIn ? (
            <div className="flex items-center space-x-2">
              <span className="hidden lg:inline-flex items-center px-2.5 py-1 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300 font-mono text-xs">
                <Terminal className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
                ADMIN MODE
              </span>
              <button
                onClick={onLogoutAdmin}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 text-xs font-mono transition"
                title="Logout Admin"
              >
                <Unlock className="w-3.5 h-3.5 text-rose-400" />
                <span>Exit Admin</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAdminModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/30 text-cyan-400 text-xs font-mono transition hover:border-cyan-400 shadow-sm"
              title="Admin Control Dashboard"
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Admin Portal</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
