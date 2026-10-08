import React, { useState } from 'react';
import { WorkshopSettings, FieldConfig, Registration, AdminRole } from '../../types';
import {
  LayoutDashboard,
  Settings,
  Sliders,
  Users,
  Terminal,
  LogOut,
  Power,
  RefreshCw,
  TrendingUp,
  Building,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Cloud,
  ShieldCheck,
  UserCheck,
  Lock,
} from 'lucide-react';
import { WorkshopInfoEditor } from './WorkshopInfoEditor';
import { FieldToggleEditor } from './FieldToggleEditor';
import { RegistrationsList } from './RegistrationsList';
import { DeploymentGuide } from './DeploymentGuide';
import { ApiService } from '../../services/api';

interface AdminDashboardProps {
  settings: WorkshopSettings;
  fields: FieldConfig[];
  registrations: Registration[];
  onRefresh: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings: initialSettings,
  fields: initialFields,
  registrations,
  onRefresh,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'info' | 'fields' | 'registrations' | 'deploy'>('overview');
  const [settings, setSettings] = useState<WorkshopSettings>(initialSettings);
  const [fields, setFields] = useState<FieldConfig[]>(initialFields);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const auth = ApiService.getAdminAuth();
  const currentRole: AdminRole = auth?.role || 'super_admin';
  const isReadOnly = currentRole === 'moderator';

  // Stats calculation
  const totalRegistrations = registrations.length;
  const activeRegistrations = registrations.filter((r) => r.status !== 'cancelled').length;
  const spotsLeft = Math.max(0, (settings.max_participants || 150) - activeRegistrations);

  // College breakdown calculation
  const collegeBreakdown = registrations.reduce((acc, r) => {
    const col = r.college || 'Unspecified Institution';
    acc[col] = (acc[col] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleSaveConfig = async () => {
    if (isReadOnly) {
      alert('Access Denied: Moderator role is read-only for settings.');
      return;
    }
    setIsSaving(true);
    setSaveSuccessMsg(null);
    try {
      const res = await ApiService.saveAdminConfig(settings, fields);
      if (res.success) {
        setSaveSuccessMsg('Workshop settings & field toggles saved successfully!');
        onRefresh();
        setTimeout(() => setSaveSuccessMsg(null), 3000);
      } else {
        alert(res.error || 'Failed to save settings');
      }
    } catch {
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMasterToggleRegistration = async () => {
    if (isReadOnly) {
      alert('Access Denied: Moderator role cannot modify registration gateway status.');
      return;
    }
    const nextState = !settings.registration_open;
    const updated = { ...settings, registration_open: nextState };
    setSettings(updated);
    setIsSaving(true);
    try {
      await ApiService.saveAdminConfig(updated, fields);
      onRefresh();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Banner Header */}
      <div className="relative rounded-3xl glass-card border border-cyan-500/30 p-6 sm:p-8 mb-8 shadow-glass overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="flex items-center space-x-1.5 text-cyan-400 font-mono text-xs font-semibold">
                <Terminal className="w-4 h-4" />
                <span>MANAGEMENT CONSOLE</span>
              </span>
              
              {/* Role Badge */}
              <span
                className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full font-mono text-xs font-bold ${
                  currentRole === 'super_admin'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                }`}
              >
                {currentRole === 'super_admin' ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>ROLE: SUPER ADMIN</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>ROLE: MODERATOR (READ-ONLY SETTINGS)</span>
                  </>
                )}
              </span>
            </div>

            <h2 className="text-3xl font-extrabold text-slate-100 font-sans tracking-tight">
              Admin Control Dashboard
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              {isReadOnly
                ? 'Logged in as Moderator. You can view attendees, inspect profiles, search, filter, and export CSV.'
                : 'Full Super Admin access: Toggle public visibility, modify registration fields, manage attendees, and sync D1 settings.'}
            </p>
          </div>

          {/* Master Registration Switch & Actions */}
          <div className="flex flex-wrap items-center gap-4">
            
            {/* Master Toggle */}
            <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center space-x-3">
              <div className="text-right font-mono text-xs">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Master Status</span>
                <span className={settings.registration_open ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {settings.registration_open ? 'REGISTRATIONS OPEN' : 'REGISTRATIONS CLOSED'}
                </span>
              </div>
              <button
                onClick={handleMasterToggleRegistration}
                disabled={isReadOnly}
                className={`p-3 rounded-xl transition ${
                  settings.registration_open
                    ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/40'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
                title={isReadOnly ? 'Moderator role cannot toggle status' : 'Toggle Registration Open/Closed'}
              >
                <Power className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={onLogout}
              className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-rose-400 hover:bg-slate-800 transition font-mono text-xs font-semibold flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit Console</span>
            </button>

          </div>
        </div>

        {/* Save success toast */}
        {saveSuccessMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center space-x-2 animate-bounce">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 p-1.5 rounded-2xl bg-slate-950/90 border border-slate-800 font-mono text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-xl transition ${
            activeTab === 'overview'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-neon-cyan'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Analytics & Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('info')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-xl transition ${
            activeTab === 'info'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-neon-cyan'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Workshop Info & Toggles {isReadOnly && '(View)'}</span>
        </button>

        <button
          onClick={() => setActiveTab('fields')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-xl transition ${
            activeTab === 'fields'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-neon-cyan'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Registration Form Fields {isReadOnly && '(View)'}</span>
        </button>

        <button
          onClick={() => setActiveTab('registrations')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-xl transition ${
            activeTab === 'registrations'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-neon-cyan'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Registrations ({totalRegistrations})</span>
        </button>

        <button
          onClick={() => setActiveTab('deploy')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-xl transition ${
            activeTab === 'deploy'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-neon-cyan'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Cloud className="w-4 h-4" />
          <span>Cloudflare Guide</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="rounded-3xl glass-card border border-cyan-500/20 p-6 sm:p-8 shadow-glass">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-xs font-mono uppercase text-slate-400 block font-semibold mb-1">
                  Total Registrations
                </span>
                <span className="text-3xl font-extrabold font-mono text-cyan-400">{activeRegistrations}</span>
                <span className="text-[11px] text-slate-500 block mt-1">Active confirmed seats</span>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-xs font-mono uppercase text-slate-400 block font-semibold mb-1">
                  Capacity / Limit
                </span>
                <span className="text-3xl font-extrabold font-mono text-slate-100">{settings.max_participants}</span>
                <span className="text-[11px] text-slate-500 block mt-1">Maximum participant seats</span>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-xs font-mono uppercase text-slate-400 block font-semibold mb-1">
                  Spots Remaining
                </span>
                <span className="text-3xl font-extrabold font-mono text-emerald-400">{spotsLeft}</span>
                <span className="text-[11px] text-slate-500 block mt-1">Available seats left</span>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-xs font-mono uppercase text-slate-400 block font-semibold mb-1">
                  Institutions Represented
                </span>
                <span className="text-3xl font-extrabold font-mono text-purple-400">
                  {Object.keys(collegeBreakdown).length}
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">Colleges & Organizations</span>
              </div>
            </div>

            {/* Breakdown Chart & Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-slate-100 font-mono uppercase flex items-center space-x-2">
                  <Building className="w-4 h-4 text-cyan-400" />
                  <span>College / Institution Breakdown</span>
                </h4>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {Object.keys(collegeBreakdown).length === 0 ? (
                    <p className="text-xs text-slate-500 font-mono">No registrations recorded yet.</p>
                  ) : (
                    Object.entries(collegeBreakdown).map(([college, count]) => {
                      const pct = Math.round((count / activeRegistrations) * 100) || 0;
                      return (
                        <div key={college} className="space-y-1">
                          <div className="flex justify-between text-xs font-sans">
                            <span className="text-slate-300 font-medium truncate max-w-[200px]">{college}</span>
                            <span className="font-mono text-cyan-400 font-bold">{count} ({pct}%)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-slate-100 font-mono uppercase flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span>Role Access Controls</span>
                </h4>
                <div className="space-y-3 text-xs font-sans">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-200 block">Registration Gateway Switch</span>
                      <span className="text-slate-400 text-[11px]">Super Admin only: Turn public registration form ON or OFF globally.</span>
                    </div>
                    <button
                      onClick={handleMasterToggleRegistration}
                      disabled={isReadOnly}
                      className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition ${
                        settings.registration_open
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      {settings.registration_open ? 'OPEN' : 'CLOSED'}
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-200 block">Save & Sync All Configurations</span>
                      <span className="text-slate-400 text-[11px]">Super Admin only: Sync pending settings to Cloudflare D1.</span>
                    </div>
                    <button
                      onClick={handleSaveConfig}
                      disabled={isSaving || isReadOnly}
                      className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-mono text-xs font-bold hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Syncing...' : 'Sync Now'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* WORKSHOP INFO TAB */}
        {activeTab === 'info' && (
          <WorkshopInfoEditor
            settings={settings}
            onChange={setSettings}
            onSave={handleSaveConfig}
            isSaving={isSaving}
            isReadOnly={isReadOnly}
          />
        )}

        {/* FIELDS TAB */}
        {activeTab === 'fields' && (
          <FieldToggleEditor
            fields={fields}
            onChange={setFields}
            onSave={handleSaveConfig}
            isSaving={isSaving}
            isReadOnly={isReadOnly}
          />
        )}

        {/* REGISTRATIONS TAB */}
        {activeTab === 'registrations' && (
          <RegistrationsList
            registrations={registrations}
            onRefresh={onRefresh}
            isLoading={isSaving}
            isReadOnly={isReadOnly}
          />
        )}

        {/* DEPLOYMENT GUIDE TAB */}
        {activeTab === 'deploy' && <DeploymentGuide />}

      </div>
    </div>
  );
};
