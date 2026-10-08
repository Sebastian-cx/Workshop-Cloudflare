import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Registration } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRegistrationId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randStr = '';
  for (let i = 0; i < 6; i++) {
    randStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `OSINT-2026-${randStr}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return 'TBA';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function exportRegistrationsToCSV(registrations: Registration[]): void {
  if (!registrations || registrations.length === 0) return;

  const headers = [
    'Registration ID',
    'Full Name',
    'Email Address',
    'Phone',
    'College',
    'Department',
    'Year of Study',
    'Technical Experience',
    'Reason for Attending',
    'Status',
    'Registered At',
  ];

  const rows = registrations.map((r) => [
    `"${r.registration_id || ''}"`,
    `"${(r.full_name || '').replace(/"/g, '""')}"`,
    `"${(r.email || '').replace(/"/g, '""')}"`,
    `"${(r.phone || '').replace(/"/g, '""')}"`,
    `"${(r.college || '').replace(/"/g, '""')}"`,
    `"${(r.department || '').replace(/"/g, '""')}"`,
    `"${(r.year_of_study || '').replace(/"/g, '""')}"`,
    `"${(r.technical_experience || '').replace(/"/g, '""')}"`,
    `"${(r.reason || '').replace(/"/g, '""')}"`,
    `"${r.status || 'confirmed'}"`,
    `"${r.created_at || ''}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `OSINT_Workshop_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
