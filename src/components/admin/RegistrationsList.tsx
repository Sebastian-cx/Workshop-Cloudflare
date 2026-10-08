import React, { useState } from 'react';
import { Registration } from '../../types';
import { Search, Download, Trash2, Eye, User, Mail, Building, Award, Calendar, RefreshCw, X, ShieldCheck, Lock } from 'lucide-react';
import { exportRegistrationsToCSV, formatDate } from '../../lib/utils';
import { ApiService } from '../../services/api';

interface RegistrationsListProps {
  registrations: Registration[];
  onRefresh: () => void;
  isLoading: boolean;
  isReadOnly?: boolean;
}

export const RegistrationsList: React.FC<RegistrationsListProps> = ({
  registrations,
  onRefresh,
  isLoading,
  isReadOnly = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | string | null>(null);

  const filteredRegistrations = registrations.filter((r) => {
    const matchesSearch =
      (r.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.college || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.registration_id || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: number | string) => {
    if (isReadOnly) return;
    if (!window.confirm('Are you sure you want to delete this participant registration?')) return;

    setIsDeleting(id);
    try {
      const res = await ApiService.deleteRegistration(id);
      if (res.success) {
        onRefresh();
        if (selectedReg && (selectedReg.id === id || selectedReg.registration_id === id)) {
          setSelectedReg(null);
        }
      } else {
        alert(res.error || 'Failed to delete registration');
      }
    } catch {
      alert('Failed to delete registration');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleExportCSV = () => {
    exportRegistrationsToCSV(filteredRegistrations);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div>
          <h3 className="text-xl font-bold text-slate-100 font-sans">
            Participant Registrations ({filteredRegistrations.length})
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Search, filter, inspect details, and export participant data to CSV.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-400 transition"
            title="Refresh Table"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <button
            onClick={handleExportCSV}
            disabled={filteredRegistrations.length === 0}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-sm hover:brightness-110 transition shadow-neon-cyan flex items-center space-x-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by participant name, email, college, or Ticket ID..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-400 text-slate-100 text-sm focus:outline-none font-sans"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-400 font-sans"
          >
            <option value="all">All Registration Statuses</option>
            <option value="confirmed">Confirmed Registrations</option>
            <option value="cancelled">Cancelled Registrations</option>
          </select>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-glass">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 font-mono text-[11px] uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4 font-semibold">Ticket ID</th>
                <th className="py-3.5 px-4 font-semibold">Participant</th>
                <th className="py-3.5 px-4 font-semibold">College / Department</th>
                <th className="py-3.5 px-4 font-semibold">Registered Date</th>
                <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans text-xs">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-mono">
                    No matching participant registrations found.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg) => (
                  <tr key={reg.id || reg.registration_id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                      {reg.registration_id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-100">{reg.full_name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{reg.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div>{reg.college || 'N/A'}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{reg.department || 'N/A'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono whitespace-nowrap">
                      {formatDate(reg.created_at)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                          reg.status === 'confirmed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedReg(reg)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-400 hover:bg-slate-700 transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!isReadOnly && (
                          <button
                            onClick={() => handleDelete(reg.id || reg.registration_id)}
                            disabled={isDeleting === (reg.id || reg.registration_id)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-rose-400 hover:bg-slate-700 transition"
                            title="Delete Registration"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Participant Detail Drawer / Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setSelectedReg(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-cyan-500/20 pb-4 mb-4">
              <span className="font-mono text-xs text-cyan-400 uppercase font-bold block">
                PARTICIPANT PROFILE INTEL
              </span>
              <h3 className="text-xl font-extrabold text-slate-100 font-sans">
                {selectedReg.full_name}
              </h3>
              <span className="text-xs font-mono text-cyan-300 font-semibold">{selectedReg.registration_id}</span>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 font-mono block text-[10px]">Email Address</span>
                <span className="font-semibold text-slate-200 text-sm">{selectedReg.email}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 font-mono block text-[10px]">Phone Number</span>
                <span className="font-semibold text-slate-200">{selectedReg.phone || 'Not provided'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 font-mono block text-[10px]">College / Institution</span>
                <span className="font-semibold text-slate-200">{selectedReg.college || 'Not provided'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 font-mono block text-[10px]">Department & Year</span>
                <span className="font-semibold text-slate-200">
                  {selectedReg.department || 'N/A'} • {selectedReg.year_of_study || 'N/A'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 font-mono block text-[10px]">Technical Experience</span>
                <span className="font-semibold text-slate-200">{selectedReg.technical_experience || 'Not provided'}</span>
              </div>

              {selectedReg.reason && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 font-mono block text-[10px]">Reason for Attending</span>
                  <p className="text-slate-300 mt-1">{selectedReg.reason}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedReg(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-semibold"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
