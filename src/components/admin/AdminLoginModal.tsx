import React, { useState } from 'react';
import { Lock, KeyRound, X, AlertTriangle, ShieldCheck, UserCheck, ShieldAlert } from 'lucide-react';
import { ApiService } from '../../services/api';
import { AdminRole } from '../../types';

interface AdminLoginModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onSuccess, onClose }) => {
  const [role, setRole] = useState<AdminRole>('super_admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your administrator password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await ApiService.adminLogin(password, role);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.error || 'Authentication failed. Invalid password for selected role.');
      }
    } catch (err: any) {
      setError(err.message || 'Login error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/80">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 mb-3 shadow-neon-cyan">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 font-sans tracking-tight">
            Role-Based Admin Portal
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Select your administrative role and enter your secure access key.
          </p>
        </div>

        {/* Role Access Selector */}
        <div className="mb-6 grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs">
          <button
            type="button"
            onClick={() => {
              setRole('super_admin');
              setError(null);
            }}
            className={`p-3 rounded-xl flex flex-col items-center justify-center space-y-1 transition ${
              role === 'super_admin'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-neon-cyan'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Super Admin</span>
            <span className="text-[9px] font-sans text-slate-900/80 font-normal">Full Control</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole('moderator');
              setError(null);
            }}
            className={`p-3 rounded-xl flex flex-col items-center justify-center space-y-1 transition ${
              role === 'moderator'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-slate-100 font-bold shadow-neon-purple'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Moderator</span>
            <span className="text-[9px] font-sans text-slate-300/80 font-normal">View & Export</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-2 font-semibold flex items-center justify-between">
              <span>{role === 'super_admin' ? 'Super Admin Password' : 'Moderator Password'}</span>
              <span className="text-[10px] text-cyan-400 font-normal">Required</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-slate-100 text-sm focus:outline-none font-mono"
                autoFocus
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 rounded-xl font-bold text-sm hover:brightness-110 transition flex items-center justify-center space-x-2 disabled:opacity-50 ${
              role === 'super_admin'
                ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-slate-950 shadow-neon-cyan'
                : 'bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 text-slate-100 shadow-neon-purple'
            }`}
          >
            {isLoading ? (
              <span>Verifying Credentials...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Login as {role === 'super_admin' ? 'Super Admin' : 'Moderator'}</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
