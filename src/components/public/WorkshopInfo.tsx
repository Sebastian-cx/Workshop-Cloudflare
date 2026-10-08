import React from 'react';
import { Calendar, Clock, MapPin, Award, UserCheck, AlertCircle, Mail, DollarSign, Image as ImageIcon } from 'lucide-react';
import { WorkshopSettings } from '../../types';
import { formatDate } from '../../lib/utils';

interface WorkshopInfoProps {
  settings: WorkshopSettings;
}

export const WorkshopInfo: React.FC<WorkshopInfoProps> = ({ settings }) => {
  // Count active visible cards to balance grid layout
  const visibleCardsCount = [
    settings.toggle_date,
    settings.toggle_time,
    settings.toggle_venue,
    settings.toggle_registration_fee,
    settings.toggle_organizer,
    settings.toggle_registration_deadline,
  ].filter(Boolean).length;

  if (visibleCardsCount === 0 && !settings.toggle_workshop_banner) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      
      {/* Optional Banner Image */}
      {settings.toggle_workshop_banner && settings.workshop_banner && (
        <div className="relative mb-10 rounded-2xl overflow-hidden border border-cyan-500/30 shadow-glass group max-h-[300px]">
          <img
            src={settings.workshop_banner}
            alt="OSINT Workshop Banner"
            className="w-full h-64 sm:h-72 object-cover object-center transform group-hover:scale-105 transition duration-700 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/40 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
            <div>
              <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block font-semibold mb-1">
                // OFFICIAL WORKSHOP SESSION //
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-100 font-sans">
                Hands-on Threat Intelligence & Investigation Skills
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Header Badge */}
      <div className="text-center mb-8">
        <h2 className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-bold mb-2">
          // EVENT SPECIFICATIONS & LOGISTICS //
        </h2>
        <p className="text-2xl font-bold text-slate-100 font-sans">Workshop Details & Agenda</p>
      </div>

      {/* Grid of Dynamic Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card: Date */}
        {settings.toggle_date && (
          <div className="p-6 rounded-2xl glass-card glass-card-hover border border-cyan-500/20 relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-cyan-400/80 uppercase tracking-wider block font-semibold mb-1">
              Event Date
            </span>
            <p className="text-lg font-bold text-slate-100 font-mono">
              {formatDate(settings.date)}
            </p>
          </div>
        )}

        {/* Card: Time */}
        {settings.toggle_time && (
          <div className="p-6 rounded-2xl glass-card glass-card-hover border border-cyan-500/20 relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-blue-400/80 uppercase tracking-wider block font-semibold mb-1">
              Workshop Schedule
            </span>
            <p className="text-lg font-bold text-slate-100 font-mono">
              {settings.time || 'Schedule TBA'}
            </p>
          </div>
        )}

        {/* Card: Venue */}
        {settings.toggle_venue && (
          <div className="p-6 rounded-2xl glass-card glass-card-hover border border-cyan-500/20 relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-purple-400/80 uppercase tracking-wider block font-semibold mb-1">
              Location / Venue
            </span>
            <p className="text-base font-bold text-slate-100 font-sans leading-snug">
              {settings.venue || 'Venue TBA'}
            </p>
          </div>
        )}

        {/* Card: Fee */}
        {settings.toggle_registration_fee && (
          <div className="p-6 rounded-2xl glass-card glass-card-hover border border-cyan-500/20 relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-emerald-400/80 uppercase tracking-wider block font-semibold mb-1">
              Registration Fee
            </span>
            <p className="text-lg font-bold text-emerald-400 font-mono">
              {settings.registration_fee || 'Free'}
            </p>
          </div>
        )}

        {/* Card: Organizer */}
        {settings.toggle_organizer && (
          <div className="p-6 rounded-2xl glass-card glass-card-hover border border-cyan-500/20 relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-cyan-400/80 uppercase tracking-wider block font-semibold mb-1">
              Organized By
            </span>
            <p className="text-base font-bold text-slate-100 font-sans leading-snug">
              {settings.organizer || 'Organizing Committee'}
            </p>
          </div>
        )}

        {/* Card: Deadline */}
        {settings.toggle_registration_deadline && settings.registration_deadline && (
          <div className="p-6 rounded-2xl glass-card glass-card-hover border border-cyan-500/20 relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4 text-rose-400 group-hover:scale-110 transition">
              <AlertCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-rose-400/80 uppercase tracking-wider block font-semibold mb-1">
              Registration Deadline
            </span>
            <p className="text-base font-bold text-slate-100 font-mono">
              {formatDate(settings.registration_deadline)}
            </p>
          </div>
        )}

      </div>
    </section>
  );
};
