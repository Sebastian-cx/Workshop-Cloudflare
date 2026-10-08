import React from 'react';
import { WorkshopSettings } from '../../types';
import { Save, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface WorkshopInfoEditorProps {
  settings: WorkshopSettings;
  onChange: (updatedSettings: WorkshopSettings) => void;
  onSave: () => void;
  isSaving: boolean;
  isReadOnly?: boolean;
}

export const WorkshopInfoEditor: React.FC<WorkshopInfoEditorProps> = ({
  settings,
  onChange,
  onSave,
  isSaving,
  isReadOnly = false,
}) => {
  const handleToggle = (key: keyof WorkshopSettings) => {
    if (isReadOnly) return;
    onChange({
      ...settings,
      [key]: !settings[key],
    });
  };

  const handleInputChange = (key: keyof WorkshopSettings, value: any) => {
    if (isReadOnly) return;
    onChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div>
          <h3 className="text-xl font-bold text-slate-100 font-sans">
            Workshop Information & Toggle Settings
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Edit workshop details and toggle visibility for public view.
          </p>
        </div>

        {!isReadOnly && (
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm hover:brightness-110 transition shadow-neon-cyan flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Info Settings'}</span>
          </button>
        )}
      </div>

      {isReadOnly && (
        <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-mono flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <span>Moderator Mode Notice: You have read-only permissions for workshop information.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Workshop Name */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase text-slate-300 font-semibold flex items-center space-x-2">
              <span>Workshop Name</span>
            </label>
            <button
              onClick={() => handleToggle('toggle_workshop_name')}
              disabled={isReadOnly}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full font-mono text-xs font-bold transition ${
                settings.toggle_workshop_name
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {settings.toggle_workshop_name ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{settings.toggle_workshop_name ? 'ON (VISIBLE)' : 'OFF (HIDDEN)'}</span>
            </button>
          </div>
          <input
            type="text"
            value={settings.workshop_name}
            disabled={isReadOnly}
            onChange={(e) => handleInputChange('workshop_name', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-400 disabled:opacity-60"
          />
        </div>

        {/* Description */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 md:col-span-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase text-slate-300 font-semibold">
              Workshop Description
            </label>
            <button
              onClick={() => handleToggle('toggle_description')}
              disabled={isReadOnly}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full font-mono text-xs font-bold transition ${
                settings.toggle_description
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {settings.toggle_description ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{settings.toggle_description ? 'ON (VISIBLE)' : 'OFF (HIDDEN)'}</span>
            </button>
          </div>
          <textarea
            value={settings.description}
            disabled={isReadOnly}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-400 disabled:opacity-60"
          />
        </div>

        {/* Date */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase text-slate-300 font-semibold">
              Workshop Date
            </label>
            <button
              onClick={() => handleToggle('toggle_date')}
              disabled={isReadOnly}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full font-mono text-xs font-bold transition ${
                settings.toggle_date
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {settings.toggle_date ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{settings.toggle_date ? 'ON (VISIBLE)' : 'OFF (HIDDEN)'}</span>
            </button>
          </div>
          <input
            type="date"
            value={settings.date}
            disabled={isReadOnly}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-400 font-mono disabled:opacity-60"
          />
        </div>

        {/* Time */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase text-slate-300 font-semibold">
              Workshop Time
            </label>
            <button
              onClick={() => handleToggle('toggle_time')}
              disabled={isReadOnly}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full font-mono text-xs font-bold transition ${
                settings.toggle_time
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {settings.toggle_time ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{settings.toggle_time ? 'ON (VISIBLE)' : 'OFF (HIDDEN)'}</span>
            </button>
          </div>
          <input
            type="text"
            value={settings.time}
            disabled={isReadOnly}
            onChange={(e) => handleInputChange('time', e.target.value)}
            placeholder="e.g. 10:00 AM - 04:00 PM EST"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-400 disabled:opacity-60"
          />
        </div>

        {/* Venue */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase text-slate-300 font-semibold">
              Venue / Location
            </label>
            <button
              onClick={() => handleToggle('toggle_venue')}
              disabled={isReadOnly}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full font-mono text-xs font-bold transition ${
                settings.toggle_venue
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {settings.toggle_venue ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{settings.toggle_venue ? 'ON (VISIBLE)' : 'OFF (HIDDEN)'}</span>
            </button>
          </div>
          <input
            type="text"
            value={settings.venue}
            disabled={isReadOnly}
            onChange={(e) => handleInputChange('venue', e.target.value)}
            placeholder="e.g. Auditorium Hall & Online Stream"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-400 disabled:opacity-60"
          />
        </div>

        {/* Organizer */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase text-slate-300 font-semibold">
              Organizer Details
            </label>
            <button
              onClick={() => handleToggle('toggle_organizer')}
              disabled={isReadOnly}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full font-mono text-xs font-bold transition ${
                settings.toggle_organizer
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {settings.toggle_organizer ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{settings.toggle_organizer ? 'ON (VISIBLE)' : 'OFF (HIDDEN)'}</span>
            </button>
          </div>
          <input
            type="text"
            value={settings.organizer}
            disabled={isReadOnly}
            onChange={(e) => handleInputChange('organizer', e.target.value)}
            placeholder="e.g. Department of Cybersecurity"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-400 disabled:opacity-60"
          />
        </div>

        {/* Registration Fee */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase text-slate-300 font-semibold">
              Registration Fee
            </label>
            <button
              onClick={() => handleToggle('toggle_registration_fee')}
              disabled={isReadOnly}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full font-mono text-xs font-bold transition ${
                settings.toggle_registration_fee
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {settings.toggle_registration_fee ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{settings.toggle_registration_fee ? 'ON (VISIBLE)' : 'OFF (HIDDEN)'}</span>
            </button>
          </div>
          <input
            type="text"
            value={settings.registration_fee}
            disabled={isReadOnly}
            onChange={(e) => handleInputChange('registration_fee', e.target.value)}
            placeholder="e.g. Free or $10"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-400 disabled:opacity-60"
          />
        </div>

        {/* Registration Deadline */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase text-slate-300 font-semibold">
              Registration Deadline
            </label>
            <button
              onClick={() => handleToggle('toggle_registration_deadline')}
              disabled={isReadOnly}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full font-mono text-xs font-bold transition ${
                settings.toggle_registration_deadline
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {settings.toggle_registration_deadline ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{settings.toggle_registration_deadline ? 'ON (VISIBLE)' : 'OFF (HIDDEN)'}</span>
            </button>
          </div>
          <input
            type="datetime-local"
            value={settings.registration_deadline}
            disabled={isReadOnly}
            onChange={(e) => handleInputChange('registration_deadline', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-400 font-mono disabled:opacity-60"
          />
        </div>

        {/* Max Participants Limit */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase text-slate-300 font-semibold">
              Max Participant Limit
            </label>
            <button
              onClick={() => handleToggle('toggle_max_participants')}
              disabled={isReadOnly}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full font-mono text-xs font-bold transition ${
                settings.toggle_max_participants
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {settings.toggle_max_participants ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{settings.toggle_max_participants ? 'ON (VISIBLE)' : 'OFF (HIDDEN)'}</span>
            </button>
          </div>
          <input
            type="number"
            value={settings.max_participants}
            disabled={isReadOnly}
            onChange={(e) => handleInputChange('max_participants', Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-400 font-mono disabled:opacity-60"
          />
        </div>

        {/* Contact Info */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase text-slate-300 font-semibold">
              Contact Information
            </label>
            <button
              onClick={() => handleToggle('toggle_contact_info')}
              disabled={isReadOnly}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full font-mono text-xs font-bold transition ${
                settings.toggle_contact_info
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {settings.toggle_contact_info ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{settings.toggle_contact_info ? 'ON (VISIBLE)' : 'OFF (HIDDEN)'}</span>
            </button>
          </div>
          <input
            type="text"
            value={settings.contact_info}
            disabled={isReadOnly}
            onChange={(e) => handleInputChange('contact_info', e.target.value)}
            placeholder="e.g. osint@university.edu"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-400 disabled:opacity-60"
          />
        </div>

        {/* Banner Image URL */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 md:col-span-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase text-slate-300 font-semibold">
              Workshop Banner Image URL
            </label>
            <button
              onClick={() => handleToggle('toggle_workshop_banner')}
              disabled={isReadOnly}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full font-mono text-xs font-bold transition ${
                settings.toggle_workshop_banner
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {settings.toggle_workshop_banner ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{settings.toggle_workshop_banner ? 'ON (VISIBLE)' : 'OFF (HIDDEN)'}</span>
            </button>
          </div>
          <input
            type="text"
            value={settings.workshop_banner}
            disabled={isReadOnly}
            onChange={(e) => handleInputChange('workshop_banner', e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-400 font-mono disabled:opacity-60"
          />
        </div>

      </div>
    </div>
  );
};
