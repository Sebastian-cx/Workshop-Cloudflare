import React from 'react';
import { Shield, Lock, Terminal, Cpu, CheckCircle } from 'lucide-react';
import { WorkshopSettings } from '../../types';

interface FooterProps {
  settings: WorkshopSettings;
  onOpenAdminModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdminModal }) => {
  return (
    <footer className="mt-24 border-t border-cyan-500/20 bg-[#03050c] text-slate-400 relative overflow-hidden">
      {/* Subtle top glow bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <Shield className="w-6 h-6 text-cyan-400" />
              <span className="font-extrabold text-slate-100 text-lg tracking-tight font-sans">
                OSINT WORKSHOP <span className="text-cyan-400 font-mono text-sm">2026</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-sans">
              Hosted for students, researchers, and security enthusiasts to master advanced Open Source Intelligence techniques.
            </p>
          </div>

          {/* Column 2: Security & Platform Specs */}
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-300/80 bg-slate-900/90 px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>POWERED BY CLOUDFLARE WORKERS & D1</span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-mono">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span>Zero Cold Starts • SQLite D1 Storage • Bot Protection Ready</span>
            </div>
          </div>

          {/* Column 3: Contact & Admin Link */}
          <div className="flex flex-col md:items-end justify-between space-y-3">
            {settings.toggle_contact_info && settings.contact_info && (
              <div className="text-xs text-slate-400 md:text-right">
                <span className="font-mono text-cyan-400 text-[11px] block uppercase">Contact Organizer</span>
                <span>{settings.contact_info}</span>
              </div>
            )}
            
            <button
              onClick={onOpenAdminModal}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-cyan-400 font-mono transition"
            >
              <Lock className="w-3 h-3 text-cyan-400" />
              <span>Admin Dashboard Access</span>
            </button>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400 font-mono">
          <div>
            © {new Date().getFullYear()} {settings.organizer || 'OSINT Workshop Team'}. All rights reserved.
          </div>
          <div className="mt-2 sm:mt-0 flex items-center space-x-4 text-slate-400">
            <span>Cybersecurity Training Platform</span>
            <span>•</span>
            <span className="text-cyan-400/80">Protected & Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
