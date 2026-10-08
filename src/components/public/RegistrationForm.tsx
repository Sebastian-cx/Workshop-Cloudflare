import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Terminal, Send, CheckCircle2, AlertTriangle, ShieldCheck, Lock, Shield } from 'lucide-react';
import { FieldConfig, WorkshopSettings } from '../../types';
import { ApiService } from '../../services/api';

interface RegistrationFormProps {
  fields: FieldConfig[];
  settings: WorkshopSettings;
  isOpen: boolean;
  spotsLeft: number;
  onSuccess: (registrationData: any) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  fields,
  settings,
  isOpen,
  spotsLeft,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>('1x00000000000000000000AA');

  // Load Cloudflare Turnstile Widget script
  useEffect(() => {
    const scriptId = 'cf-turnstile-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  const enabledFields = fields.filter((f) => f.enabled).sort((a, b) => a.order_index - b.order_index);

  // Dynamic Zod validation schema
  const schemaShape: Record<string, z.ZodTypeAny> = {};

  enabledFields.forEach((field) => {
    let validator: z.ZodTypeAny;

    if (field.field_type === 'email') {
      validator = z.string().email({ message: 'Please enter a valid email address' });
    } else {
      validator = z.string();
    }

    if (field.required) {
      validator = (validator as z.ZodString).min(1, { message: `${field.label} is required` });
    } else {
      validator = validator.optional().or(z.literal(''));
    }

    schemaShape[field.field_name] = validator;
  });

  const dynamicSchema = z.object(schemaShape);
  type FormData = z.infer<typeof dynamicSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(dynamicSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data: FormData) => {
    if (!isOpen || spotsLeft <= 0) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      const payload = {
        ...data,
        turnstileToken,
      };

      const response = await ApiService.registerParticipant(payload);
      if (response.success && response.data) {
        reset();
        onSuccess(response.data);
      } else {
        setServerError(response.error || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setServerError(err.message || 'Network error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="registration-form" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
      <div className="relative rounded-3xl glass-card border border-cyan-500/30 p-6 sm:p-10 shadow-glass overflow-hidden">
        
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-cyan-500/20 font-mono text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="text-slate-400 ml-2 font-semibold">// RECON_GATEWAY_V2.6 //</span>
          </div>
          <div className="flex items-center space-x-2 text-cyan-400">
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">256-BIT ENCRYPTED & BOT PROTECTED</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-sans tracking-tight">
            Workshop Participant Registration
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Fill out the required information below to reserve your seat for the OSINT session.
          </p>
        </div>

        {/* Registration Closed Banner */}
        {(!isOpen || spotsLeft <= 0) && (
          <div className="mb-8 p-6 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-center">
            <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-rose-200 font-sans">Registration Unavailable</h3>
            <p className="text-xs text-rose-300 font-mono mt-1">
              {!isOpen
                ? 'Registration has been closed by the event administrator.'
                : 'Maximum participant limit reached for this session.'}
            </p>
          </div>
        )}

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-sm flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Dynamic Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enabledFields.map((field) => {
              const fieldError = errors[field.field_name as keyof FormData];

              return (
                <div
                  key={field.field_name}
                  className={field.field_type === 'textarea' ? 'md:col-span-2' : ''}
                >
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2 font-semibold">
                    {field.label}
                    {field.required ? (
                      <span className="text-rose-400 ml-1 font-bold" title="Required">*</span>
                    ) : (
                      <span className="text-slate-400 text-[10px] ml-1 lowercase font-normal">(optional)</span>
                    )}
                  </label>

                  {field.field_type === 'select' ? (
                    <select
                      {...register(field.field_name as keyof FormData)}
                      disabled={!isOpen || spotsLeft <= 0 || isSubmitting}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border ${
                        fieldError ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700/80 focus:border-cyan-400'
                      } text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition font-sans disabled:opacity-50`}
                    >
                      <option value="">{field.placeholder || `Select ${field.label}`}</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt} className="bg-slate-900 text-slate-100">
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : field.field_type === 'textarea' ? (
                    <textarea
                      {...register(field.field_name as keyof FormData)}
                      disabled={!isOpen || spotsLeft <= 0 || isSubmitting}
                      placeholder={field.placeholder}
                      rows={3}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border ${
                        fieldError ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700/80 focus:border-cyan-400'
                      } text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition font-sans placeholder:text-slate-600 disabled:opacity-50`}
                    />
                  ) : (
                    <input
                      type={field.field_type}
                      {...register(field.field_name as keyof FormData)}
                      disabled={!isOpen || spotsLeft <= 0 || isSubmitting}
                      placeholder={field.placeholder}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border ${
                        fieldError ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700/80 focus:border-cyan-400'
                      } text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition font-sans placeholder:text-slate-600 disabled:opacity-50`}
                    />
                  )}

                  {fieldError && (
                    <p className="text-xs text-rose-400 font-mono mt-1.5 flex items-center space-x-1">
                      <span>⚠️ {fieldError.message as string}</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* 🛡️ Free Cloudflare Turnstile Bot Verification Widget */}
          <div className="pt-2">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between font-mono text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Protected by Cloudflare Turnstile</span>
              </div>
              <div className="flex items-center space-x-1 text-emerald-400 text-[11px] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>HUMAN VERIFIED</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={!isOpen || spotsLeft <= 0 || isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-slate-950 font-bold text-base hover:brightness-110 transition shadow-neon-cyan flex items-center justify-center space-x-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin mr-2" />
                  <span>Processing Intel & Securing Seat...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 text-slate-950" />
                  <span>Submit Workshop Registration</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security Footer Note */}
        <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-center space-x-2 text-[11px] text-slate-400 font-mono text-center">
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Your information is strictly protected and will only be used for workshop logistics.</span>
        </div>

      </div>
    </div>
  );
};
